'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/components/providers/auth-provider'
import { profilesApi } from '@/lib/api/profiles'
import { PremiumBackground } from '@/components/ui/premium-background'
import { BentoGrid, BentoTile } from '@/components/ui/bento'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
      toast.error(t('profile:settings.loadError') || 'Failed to load profile')
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
      toast.success(
        t('profile:settings.saveSuccess') || 'Profile updated successfully'
      )
    } catch (err: any) {
      toast.error(err.message || 'Update failed')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <PremiumBackground variant="mesh" className="min-h-screen p-4 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-5xl space-y-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('profile:settings')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('profile:settings.description') ||
                'Manage your account settings and profile preferences.'}
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="shadow-primary/20 min-w-[140px] rounded-xl shadow-lg"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {t('common:saveChanges')}
          </Button>
        </div>

        <div className="bg-muted/50 border-border/10 flex w-fit gap-2 rounded-2xl border p-1 backdrop-blur-md">
          <TabButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={<UserIcon className="h-4 w-4" />}
            label={t('profile:general')}
          />
          <TabButton
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
            icon={<Shield className="h-4 w-4" />}
            label={t('profile:security')}
          />
          <TabButton
            active={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
            icon={<Bell className="h-4 w-4" />}
            label={t('common:notifications')}
          />
        </div>

        <BentoGrid>
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="col-span-12 grid grid-cols-12 gap-6"
              >
                {/* Avatar Section */}
                <BentoTile
                  colSpan={12}
                  className="bg-card/40 border-border/5 flex flex-col items-center justify-center p-8 backdrop-blur-xl md:col-span-4"
                >
                  <div className="group relative cursor-pointer">
                    <Avatar className="border-primary/20 group-hover:border-primary/40 h-32 w-32 border-4 transition-all">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-2xl font-bold">
                        {profile?.display_name?.charAt(0) ||
                          user?.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-foreground/40 absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="text-background h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="mt-4 font-semibold">
                    {profile?.display_name || 'User'}
                  </h3>
                  <p className="text-muted-foreground text-xs">{user?.email}</p>
                </BentoTile>

                {/* Info Form */}
                <BentoTile
                  colSpan={12}
                  className="bg-card/40 border-border/5 space-y-6 p-6 backdrop-blur-xl md:col-span-8"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="display_name"
                        className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase"
                      >
                        <UserIcon className="h-3 w-3" />{' '}
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
                        className="bg-background/50 border-border/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="full_name"
                        className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase"
                      >
                        <UserIcon className="h-3 w-3" /> {t('profile:fullName')}
                      </Label>
                      <Input
                        id="full_name"
                        value={profile?.full_name || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, full_name: e.target.value })
                        }
                        className="bg-background/50 border-border/10 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase"
                    >
                      <Globe className="h-3 w-3" /> {t('profile:bio')}
                    </Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profile?.bio || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className="bg-background/50 border-border/10 resize-none rounded-xl"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase"
                      >
                        <Phone className="h-3 w-3" /> {t('profile:phoneNumber')}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile?.phone || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        className="bg-background/50 border-border/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase"
                      >
                        <MapPin className="h-3 w-3" /> {t('profile:location')}
                      </Label>
                      <Input
                        id="location"
                        value={profile?.location || ''}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                        className="bg-background/50 border-border/10 rounded-xl"
                      />
                    </div>
                  </div>
                </BentoTile>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="col-span-12 grid grid-cols-12 gap-6"
              >
                <BentoTile
                  colSpan={12}
                  className="bg-card/40 border-border/5 flex min-h-[400px] flex-col items-center justify-center p-8 text-center backdrop-blur-xl"
                >
                  <Shield className="text-primary/40 mb-4 h-16 w-16" />
                  <h3 className="mb-2 text-xl font-bold">
                    {t('profile:securitySettings')}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    {t('profile:security.description') ||
                      'Manage your password and authentication methods to keep your account secure.'}
                  </p>
                  <Button
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/10 rounded-xl"
                  >
                    {t('profile:changePassword')}
                  </Button>
                </BentoTile>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="col-span-12 grid grid-cols-12 gap-6"
              >
                <BentoTile
                  colSpan={12}
                  className="bg-card/40 border-border/5 flex min-h-[400px] flex-col items-center justify-center p-8 text-center backdrop-blur-xl"
                >
                  <Bell className="text-primary/40 mb-4 h-16 w-16" />
                  <h3 className="mb-2 text-xl font-bold">
                    {t('common:notificationSettings')}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    {t('profile:notifications.description') ||
                      'Choose how you want to be notified about updates and messages.'}
                  </p>
                  <div className="w-full max-w-sm space-y-4 text-left">
                    <NotificationToggle
                      label="Email Notifications"
                      enabled={true}
                    />
                    <NotificationToggle
                      label="Push Notifications"
                      enabled={false}
                    />
                    <NotificationToggle
                      label="SMS Notifications"
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
      className={cn(
        'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
      )}
    >
      {icon}
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
    <div className="bg-muted/5 border-border/5 flex items-center justify-between rounded-xl border p-4">
      <span className="font-medium">{label}</span>
      <button
        onClick={() => setIsOn(!isOn)}
        className={cn(
          'relative h-5 w-10 rounded-full transition-colors',
          isOn ? 'bg-primary' : 'bg-muted/30'
        )}
      >
        <div
          className={cn(
            'bg-background absolute top-1 h-3 w-3 rounded-full transition-all',
            isOn ? 'right-1' : 'left-1'
          )}
        />
      </button>
    </div>
  )
}
