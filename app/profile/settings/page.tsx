'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { useCurrency } from '@/components/providers/currency-provider'
import { storageApi } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { PageTransition } from '@/components/ui/page-transition'

import { SkeletonSettings } from './components/skeleton-settings'
import { AvatarSection } from './components/avatar-section'
import { SettingsForm } from './components/settings-form'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { currency, setCurrency } = useCurrency()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [formData, setFormData] = useState({
    display_name: '',
    phone: '',
    bio: '',
    location: '',
    avatar_url: '',
  })

  useEffect(() => {
    if (user) {
      // Load profile
      const supabase = createClient()
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setFormData({
              display_name: data.display_name || '',
              phone: data.phone || '',
              bio: data.bio || '',
              location: data.location || '',
              avatar_url: data.avatar_url || '',
            })
          }
          setIsDataLoaded(true)
        })
    }
  }, [user])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    const supabase = createClient()

    // Updates
    const updates = {
      id: user.id,
      display_name: formData.display_name,
      phone: formData.phone,
      bio: formData.bio,
      location: formData.location,
      avatar_url: formData.avatar_url,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile', {
        description: error.message,
      })
    } else {
      toast.success('Profile updated successfully', {
        description: 'Your changes have been saved to your public profile.',
      })
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    const toastId = toast.loading('Uploading avatar...')

    // Upload logic reusing storageApi
    const res = await storageApi.uploadImage(file, user.id, 'avatars')

    if (res.data) {
      setFormData((prev) => ({ ...prev, avatar_url: res.data.url }))
      toast.success('Avatar uploaded successfully', { id: toastId })
    } else if (res.error) {
      toast.error('Upload failed', {
        description: res.error,
        id: toastId,
      })
    }

    setIsUploading(false)
  }

  return (
    <PageTransition>
      <div className="animate-in fade-in slide-in-from-bottom-4 max-w-4xl space-y-8 duration-700">
        {/* Premium Header */}
        <div className="from-background/80 via-background/60 to-background/40 group relative flex flex-col gap-4 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10">
            <h1 className="font-heading text-foreground mb-2 text-4xl font-black tracking-tight md:text-5xl">
              Settings
            </h1>
            <p className="text-muted-foreground max-w-lg text-base leading-relaxed font-medium md:text-lg">
              Manage your profile details, contact information, and preferences.
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          <Card className="border-border/50 bg-card/50 rounded-[2.5rem] p-8 shadow-xl backdrop-blur-sm">
            {!isDataLoaded ? (
              <SkeletonSettings />
            ) : (
              <>
                <AvatarSection
                  avatarUrl={formData.avatar_url}
                  isUploading={isUploading}
                  onUpload={handleAvatarUpload}
                />
                <SettingsForm
                  formData={formData}
                  setFormData={setFormData}
                  currency={currency}
                  setCurrency={setCurrency}
                  userEmail={user?.email || ''}
                  onSubmit={handleUpdate}
                  isLoading={isLoading}
                  isUploading={isUploading}
                />
              </>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
