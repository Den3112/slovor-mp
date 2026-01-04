'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { profilesApi, storageApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User as UserIcon,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  FileText
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { User as UserProfile } from '@/lib/types/database'

export default function SettingsPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return

    const loadProfile = async () => {
      setIsLoading(true)
      // Use getOrCreate to handle new users without a profile
      const { data, error } = await profilesApi.getOrCreate(user.id, user.email ?? undefined)
      if (error) {
        console.error('Error loading profile:', error)
      } else {
        setProfile(data)
      }
      setIsLoading(false)
    }

    loadProfile()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setMessage(null)

    const { data, error } = await profilesApi.update(user.id, {
      display_name: profile?.display_name,
      bio: profile?.bio,
      phone: profile?.phone,
      location: profile?.location,
      avatar_url: profile?.avatar_url,
    })

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update profile: ' + error })
    } else {
      setProfile(data)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMessage(null), 3000)
    }
    setIsSaving(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsSaving(true)
    const { data, error } = await storageApi.uploadImage(file, user.id)

    if (error) {
      setMessage({ type: 'error', text: 'Upload failed: ' + error })
    } else if (data) {
      setProfile({ ...profile, avatar_url: data.url })
      // Automatically save the new avatar URL
      await profilesApi.update(user.id, { avatar_url: data.url })
      setMessage({ type: 'success', text: 'Avatar updated!' })
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-20 pt-8">
      <div>
        <h1 className="mb-2 font-heading text-4xl font-black tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-lg text-muted-foreground">
          Personalize your profile and account settings.
        </p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-4 shadow-lg",
              message.type === 'success'
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                : "border-red-500/20 bg-red-500/10 text-red-500"
            )}
          >
            {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="font-bold">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="group relative mx-auto h-48 w-48 overflow-hidden rounded-[2.5rem] border-4 border-card bg-muted shadow-xl transition-all hover:border-primary/50">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <UserIcon className="h-20 w-20 text-primary/20" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            >
              <div className="flex flex-col items-center gap-2 text-white">
                <Camera className="h-8 w-8" />
                <span className="text-xs font-black uppercase tracking-widest">Change Photo</span>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="rounded-[2rem] border border-border/40 bg-card p-6 text-center shadow-sm">
            <h3 className="font-heading text-xl font-bold">{profile?.display_name || user?.email?.split('@')[0]}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                Member
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Main Settings Form */}
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-[2.5rem] border border-border/40 bg-card shadow-sm transition-all hover:border-primary/20">
            <div className="border-b border-border/40 bg-muted/30 px-8 py-6">
              <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-widest">
                <UserIcon className="h-5 w-5 text-primary" />
                Profile Details
              </h3>
            </div>

            <div className="space-y-8 p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Display Name
                  </label>
                  <input
                    value={profile?.display_name || ''}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    className="w-full rounded-2xl border border-border/40 bg-muted/20 px-5 py-4 font-medium outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5"
                    placeholder="E.g. Alex"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    Phone Number
                  </label>
                  <input
                    value={profile?.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full rounded-2xl border border-border/40 bg-muted/20 px-5 py-4 font-medium outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5"
                    placeholder="+421 ..."
                  />
                </div>

                <div className="col-span-1 space-y-3 md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Location
                  </label>
                  <input
                    value={profile?.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full rounded-2xl border border-border/40 bg-muted/20 px-5 py-4 font-medium outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5"
                    placeholder="Bratislava, Slovakia"
                  />
                </div>

                <div className="col-span-1 space-y-3 md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    About Me
                  </label>
                  <textarea
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-border/40 bg-muted/20 px-5 py-4 font-medium outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/5"
                    placeholder="Tell something about yourself..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted/30 px-8 py-6">
              <Button
                type="submit"
                disabled={isSaving}
                className="h-14 rounded-2xl px-10 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>

          {/* Account Settings (Placeholder for more settings) */}
          <div className="rounded-[2.5rem] border border-border/40 bg-card p-8 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black uppercase tracking-widest">
              Account Security
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Manage your password and security preferences.
            </p>
            <Button variant="outline" className="rounded-xl border-border/40 px-6 font-bold hover:bg-muted/50">
              Change Password
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
