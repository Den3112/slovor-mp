'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { storageApi } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { PageTransition } from '@/components/ui/page-transition'

import {
  SettingsHeader,
  SettingsAvatar,
  SettingsForm,
  SettingsSkeleton,
  SettingsFormData,
} from './settings-view/index'

export function SettingsView() {
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [formData, setFormData] = useState<SettingsFormData>({
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
      toast.error(t('profile:updateError'), {
        description: error.message,
      })
    } else {
      toast.success(t('profile:updateSuccess'), {
        description: t('profile:updateSuccessDesc'),
      })
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    const toastId = toast.loading(t('profile:uploading'))

    // Upload logic reusing storageApi
    const res = await storageApi.uploadImage(file, user.id, 'avatars')

    if (res.data) {
      setFormData((prev) => ({ ...prev, avatar_url: res.data.url }))
      toast.success(t('profile:avatarSuccess'), { id: toastId })
    } else if (res.error) {
      toast.error(t('profile:avatarError'), {
        description: res.error,
        id: toastId,
      })
    }

    setIsUploading(false)
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <SettingsHeader />

        <div className="bg-card border-border rounded-lg border p-6 shadow-sm md:p-8">
          {!isDataLoaded ? (
            <SettingsSkeleton />
          ) : (
            <div className="space-y-8">
              <SettingsAvatar
                avatarUrl={formData.avatar_url}
                isUploading={isUploading}
                onUpload={handleAvatarUpload}
              />

              <SettingsForm
                formData={formData}
                setFormData={setFormData}
                isLoading={isLoading}
                isUploading={isUploading}
                onSubmit={handleUpdate}
                userEmail={user?.email}
              />
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
