'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/shared/lib/i18n'
import { useAuth } from '@/app/providers/auth-provider'
import { profilesApi } from '@/entities/user/api'
import { PremiumBackground } from '@/shared/ui/premium-background'
import { BentoGrid, BentoTile } from '@/shared/ui/bento'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import {
  User as UserIcon,
  Phone,
  MapPin,
  Camera,
  Shield,
  Bell,
  Globe,
  Loader2,
  Save,
  Settings as SettingsIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/shared/lib/utils'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function SettingsView() {
  const { user } = useAuth()
  const { t } = useTranslation(['profile', 'common'])
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'notifications'
  >('profile')

  const loadProfile = React.useCallback(async () => {
    try {
      const { data, error } = await profilesApi.getById(user!.id)
      if (error) throw new Error(error)
      setProfile(data)
    } catch (err: any) {
      toast.error(t('profile:settings_view.loadError'))
    } finally {
      setIsLoading(false)
    }
  }, [user, t])

  useEffect(() => {
    if (user?.id) {
      loadProfile()
    }
  }, [user?.id, loadProfile])

  async function handleSave() {
    if (!user?.id) return
    setIsSaving(true)
    try {
      const { error } = await profilesApi.update(user.id, profile)
      if (error) throw new Error(error)

      // Refresh state to ensure UI is in sync
      await loadProfile()

      toast.success(t('profile:settings_view.saveSuccess'))
    } catch (err: any) {
      toast.error(err.message || 'Update failed')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin stroke-3" />
      </div>
    )
  }

  return (
    <PremiumBackground
      variant="mesh"
      className="min-h-screen px-4 py-10 md:px-8"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-6xl space-y-12"
      >
        <div className="flex flex-col gap-6 px-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-foreground text-gradient text-4xl font-black tracking-tighter uppercase sm:text-5xl lg:text-6xl">
              {t('profile:settings')}
            </h1>
            <p className="text-primary/40 text-xs font-black tracking-[0.2em] uppercase">
              {t('profile:settingsDescription')}
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="shadow-primary/20 hover:bg-primary/90 h-14 min-w-[180px] rounded-2xl px-8 text-[10px] font-black tracking-[0.2em] uppercase shadow-2xl transition-all active:scale-95"
          >
            {isSaving ? (
              <Loader2 className="mr-3 h-5 w-5 animate-spin stroke-3" />
            ) : (
              <Save className="mr-3 h-5 w-5 stroke-3" />
            )}
            {t('common:saveChanges')}
          </Button>
        </div>

        <div className="glass-panel border-primary/10 bg-primary/5 shadow-primary/5 flex w-fit gap-2 rounded-[2rem] border p-1.5 shadow-2xl">
          <TabButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={<UserIcon className="h-4.5 w-4.5 stroke-3" />}
            label={t('profile:general')}
          />
          <TabButton
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
            icon={<Shield className="h-4.5 w-4.5 stroke-3" />}
            label={t('profile:security')}
          />
          <TabButton
            active={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
            icon={<Bell className="h-4.5 w-4.5 stroke-3" />}
            label={t('profile:notifications')}
          />
        </div>

        <BentoGrid className="gap-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-12 grid grid-cols-12 gap-8"
              >
                {/* Avatar Section */}
                <BentoTile
                  colSpan={12}
                  className="bg-card border-border flex flex-col items-center justify-center rounded-2xl border p-12 shadow-md transition-all duration-500 hover:shadow-lg md:col-span-4"
                >
                  <div className="group relative cursor-pointer">
                    <div className="bg-primary/20 absolute -inset-4 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
                    <Avatar className="ring-primary/10 group-hover:ring-primary/40 h-44 w-44 rounded-full border-0 ring-8 ring-offset-0 transition-all duration-700 group-hover:scale-105">
                      <AvatarImage
                        src={profile?.avatar_url}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/5 text-primary text-4xl font-black">
                        {profile?.display_name?.charAt(0) ||
                          user?.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-primary/80 absolute inset-0 flex items-center justify-center rounded-full opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                      <Camera className="h-10 w-10 stroke-3 text-white" />
                    </div>
                  </div>
                  <div className="mt-8 space-y-1 text-center">
                    <h3 className="text-foreground text-xl leading-none font-black tracking-tighter uppercase">
                      {profile?.display_name || 'User'}
                    </h3>
                    <p className="text-primary/40 text-[10px] font-black tracking-widest uppercase">
                      {user?.email}
                    </p>
                  </div>
                </BentoTile>

                {/* Info Form */}
                <BentoTile
                  colSpan={12}
                  className="bg-card border-border space-y-10 rounded-2xl border p-12 shadow-md md:col-span-8"
                >
                  <div className="grid gap-10 md:grid-cols-2">
                    <div className="space-y-4">
                      <Label
                        htmlFor="display_name"
                        className="text-primary/40 flex items-center gap-3 pl-1 text-[10px] font-black tracking-[0.25em] uppercase"
                      >
                        <UserIcon className="h-4 w-4 stroke-3 opacity-50" />{' '}
                        {t('profile:displayName')}
                      </Label>
                      <Input
                        id="display_name"
                        value={profile?.display_name || ''}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            display_name: e.target.value,
                          })
                        }
                        className="bg-primary/5 border-primary/10 hover:border-primary/20 focus:bg-background h-14 rounded-2xl px-6 text-[13px] font-black tracking-tight transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label
                      htmlFor="bio"
                      className="text-primary/40 flex items-center gap-3 pl-1 text-[10px] font-black tracking-[0.25em] uppercase"
                    >
                      <Globe className="h-4 w-4 stroke-3 opacity-50" />{' '}
                      {t('profile:bio')}
                    </Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profile?.bio || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className="bg-primary/5 border-primary/10 hover:border-primary/20 focus:bg-background min-h-[140px] resize-none rounded-xl p-6 text-[13px] leading-relaxed font-black tracking-tight transition-all duration-300"
                    />
                  </div>

                  <div className="grid gap-10 md:grid-cols-2">
                    <div className="space-y-4">
                      <Label
                        htmlFor="phone"
                        className="text-primary/40 flex items-center gap-3 pl-1 text-[10px] font-black tracking-[0.25em] uppercase"
                      >
                        <Phone className="h-4 w-4 stroke-3 opacity-50" />{' '}
                        {t('profile:phoneNumber')}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile?.phone || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        className="bg-primary/5 border-primary/10 hover:border-primary/20 focus:bg-background h-14 rounded-2xl px-6 text-[13px] font-black tracking-tight transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label
                        htmlFor="location"
                        className="text-primary/40 flex items-center gap-3 pl-1 text-[10px] font-black tracking-[0.25em] uppercase"
                      >
                        <MapPin className="h-4 w-4 stroke-3 opacity-50" />{' '}
                        {t('profile:location')}
                      </Label>
                      <Input
                        id="location"
                        value={profile?.location || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                        className="bg-primary/5 border-primary/10 hover:border-primary/20 focus:bg-background h-14 rounded-2xl px-6 text-[13px] font-black tracking-tight transition-all duration-300"
                      />
                    </div>
                  </div>
                </BentoTile>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-12"
              >
                <BentoTile
                  colSpan={12}
                  className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 shadow-md"
                >
                  <div className="bg-primary/10 absolute -top-20 -right-20 h-64 w-64 animate-pulse rounded-full opacity-40 blur-[100px]" />
                  <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div className="space-y-4">
                      <div className="bg-primary shadow-primary/20 flex h-16 w-16 items-center justify-center rounded-xl shadow-lg">
                        <SettingsIcon className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground ml-1 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
                          {t('profile:settingsSubtitle', {
                            defaultValue: 'Configure your profile',
                          })}
                        </p>
                        <h1 className="text-foreground text-5xl font-black tracking-tighter uppercase sm:text-6xl">
                          {t('dashboard:settings')}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-primary/10 hover:bg-primary h-14 rounded-xl px-12 text-[10px] font-black tracking-[0.2em] uppercase transition-all hover:text-white active:scale-95"
                  >
                    {t('profile:changePassword')}
                  </Button>
                </BentoTile>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-12"
              >
                <BentoTile
                  colSpan={12}
                  className="bg-card border-border flex min-h-[500px] flex-col items-center justify-center rounded-2xl border p-16 text-center shadow-md"
                >
                  <div className="bg-primary/5 border-primary/5 mb-10 flex h-24 w-24 items-center justify-center rounded-xl border shadow-inner transition-transform duration-700 hover:scale-110">
                    <Bell className="text-primary/20 h-10 w-10 stroke-3" />
                  </div>
                  <h3 className="text-foreground mb-3 text-3xl font-black tracking-tighter uppercase">
                    {t('profile:notificationSettings')}
                  </h3>
                  <p className="text-primary/40 mx-auto mb-12 max-w-md text-xs leading-relaxed font-black tracking-[0.2em] uppercase">
                    {t('profile:notifications.description')}
                  </p>
                  <div className="w-full max-w-md space-y-6">
                    <NotificationToggle
                      label={t('profile:emailNotifications')}
                      enabled={true}
                    />
                    <NotificationToggle
                      label={t('profile:pushNotifications')}
                      enabled={false}
                    />
                    <NotificationToggle
                      label={t('profile:smsNotifications')}
                      enabled={false}
                    />
                  </div>
                </BentoTile>
              </motion.div>
            )}
          </AnimatePresence>
        </BentoGrid>
      </motion.div>
    </PremiumBackground>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      aria-label={label}
      className={cn(
        'group flex h-11 items-center gap-3 rounded-[1.25rem] px-5 text-[9px] font-black tracking-[0.2em] uppercase transition-all duration-300 active:scale-95',
        active
          ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-xl'
          : 'text-primary/40 hover:bg-primary/5 hover:text-primary'
      )}
    >
      <span
        className={cn(
          'transition-transform duration-300 group-hover:scale-110',
          active ? 'text-white' : 'opacity-50'
        )}
      >
        {icon}
      </span>
      {label}
    </button>
  )
}

function NotificationToggle({
  label,
  enabled,
}: {
  label: string
  enabled: boolean
}) {
  const [isOn, setIsOn] = useState(enabled)
  return (
    <div className="bg-primary/5 group border-border hover:border-primary/20 flex items-center justify-between rounded-xl border p-5 transition-all duration-300">
      <div className="flex items-center gap-4">
        <span className="text-foreground/80 text-[11px] font-black tracking-widest uppercase">
          {label}
        </span>
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary h-5 border-none px-2 py-0 text-[8px] font-black tracking-widest uppercase"
        >
          Soon
        </Badge>
      </div>
      <button
        onClick={() => setIsOn(!isOn)}
        role="switch"
        aria-checked={isOn}
        aria-label={label}
        className={cn(
          'relative h-7 w-13 rounded-full shadow-inner transition-all duration-500',
          isOn ? 'bg-primary' : 'bg-primary/10'
        )}
      >
        <div
          className={cn(
            'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-500',
            isOn ? 'right-1 translate-x-0' : 'left-1 translate-x-0 shadow-none'
          )}
        />
      </button>
    </div>
  )
}
