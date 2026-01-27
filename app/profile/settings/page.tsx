'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Loader2,
  Save,
  User,
  Phone,
  MapPin,
  AlignLeft,
  Mail,
  Coins,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useCurrency } from '@/components/providers/currency-provider'
import { CURRENCIES, type CurrencyCode } from '@/lib/types/currency'
import Image from 'next/image'
import { storageApi } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { useTranslation } from '@/lib/i18n'
import { PageTransition } from '@/components/ui/page-transition'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()
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
      toast.error(t('profile.updateError'), {
        description: error.message,
      })
    } else {
      toast.success(t('profile.updateSuccess'), {
        description: t('profile.updateSuccessDesc'),
      })
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    const toastId = toast.loading(t('profile.uploading'))

    // Upload logic reusing storageApi
    // Use 'avatars' bucket
    const res = await storageApi.uploadImage(file, user.id, 'avatars')

    if (res.data) {
      setFormData((prev) => ({ ...prev, avatar_url: res.data.url }))
      toast.success(t('profile.avatarSuccess'), { id: toastId })
    } else if (res.error) {
      toast.error(t('profile.avatarError'), {
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
        <div className="from-background/80 via-background/60 to-background/40 group relative flex flex-col gap-4 overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10">
            <h1 className="font-heading text-foreground mb-2 text-4xl font-black tracking-tight md:text-5xl">
              {t('profile.settings')}
            </h1>
            <p className="text-muted-foreground max-w-lg text-base leading-relaxed font-medium md:text-lg">
              {t('profile.settingsDescription')}
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          <Card className="border-border/50 bg-card/50 rounded-5xl p-8 shadow-xl backdrop-blur-sm">
            {!isDataLoaded ? (
              // Skeleton Loading State
              <div className="animate-shimmer space-y-8">
                <div className="border-border/40 flex flex-col items-center gap-8 border-b pb-8 sm:flex-row sm:items-start">
                  <div className="bg-muted h-32 w-32 rounded-full" />
                  <div className="w-full max-w-sm flex-1 space-y-2">
                    <div className="bg-muted h-6 w-32 rounded" />
                    <div className="bg-muted h-4 w-48 rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="bg-muted h-4 w-24 rounded" />
                      <div className="bg-muted h-12 w-full rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-8">
                {/* Avatar Section */}
                <div className="border-border/40 flex flex-col items-center gap-8 border-b pb-8 sm:flex-row sm:items-start">
                  <div className="group relative">
                    <div className="border-background bg-muted relative h-32 w-32 overflow-hidden rounded-full border-4 shadow-2xl transition-transform group-hover:scale-105">
                      {formData.avatar_url ? (
                        <Image
                          src={formData.avatar_url}
                          alt="Avatar"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="text-muted-foreground bg-primary/5 flex h-full w-full items-center justify-center">
                          <User className="h-12 w-12 opacity-20" />
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById('avatar-input')?.click()
                      }
                      className="bg-primary text-primary-foreground absolute right-0 bottom-0 rounded-full p-2.5 shadow-lg transition-transform hover:scale-110"
                    >
                      <div className="h-4 w-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-full w-full"
                        >
                          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.5l-.5 4a2 2 0 0 0 2 2l4-.5a2 2 0 0 0 .5-.5l11.832-11.832z" />
                        </svg>
                      </div>
                    </button>
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h3 className="text-xl font-bold">{t('profile.profilePicture')}</h3>
                    <p className="text-muted-foreground mx-auto max-w-sm text-sm sm:mx-0">
                      {t('profile.uploadDescription')}
                    </p>
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                </div>

                {/* Form Fields - 2 Column Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold">{t('profile.fullName')}</label>
                    <div className="group relative">
                      <User className="text-muted-foreground group-hover:text-primary absolute top-3.5 left-4 h-4 w-4 transition-colors" />
                      <Input
                        className="bg-background/50 border-input/50 focus:bg-background h-12 rounded-xl pl-11 transition-all"
                        value={formData.display_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            display_name: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold">{t('profile.location')}</label>
                    <div className="group relative">
                      <MapPin className="text-muted-foreground group-hover:text-primary absolute top-3.5 left-4 h-4 w-4 transition-colors" />
                      <Input
                        className="bg-background/50 border-input/50 focus:bg-background h-12 rounded-xl pl-11 transition-all"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="Bratislava, Slovakia"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold">
                      {t('profile.phoneNumber')}
                    </label>
                    <div className="group relative">
                      <Phone className="text-muted-foreground group-hover:text-primary absolute top-3.5 left-4 h-4 w-4 transition-colors" />
                      <Input
                        className="bg-background/50 border-input/50 focus:bg-background h-12 rounded-xl pl-11 transition-all"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+421 900 000 000"
                      />
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold">
                      {t('profile.preferredCurrency')}
                    </label>
                    <div className="group relative">
                      <Coins className="text-muted-foreground group-hover:text-primary absolute top-3.5 left-4 h-4 w-4 transition-colors" />
                      <select
                        className="border-input/50 bg-background/50 ring-offset-background focus:bg-background focus-visible:ring-ring flex h-12 w-full appearance-none rounded-xl border px-3 py-2 pl-11 text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        value={currency}
                        onChange={(e) =>
                          setCurrency(e.target.value as CurrencyCode)
                        }
                      >
                        {Object.values(CURRENCIES).map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name} ({curr.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Email (Full Width) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-muted-foreground ml-1 text-sm font-bold">
                      {t('profile.emailReadonly')}
                    </label>
                    <div className="relative">
                      <Mail className="text-muted-foreground/50 absolute top-3.5 left-4 h-4 w-4" />
                      <Input
                        className="bg-muted/20 border-border/20 text-muted-foreground h-12 cursor-not-allowed rounded-xl pl-11"
                        value={user?.email || ''}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  {/* Bio (Full Width) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="ml-1 text-sm font-bold">
                      {t('profile.bio')}
                    </label>
                    <div className="group relative">
                      <AlignLeft className="text-muted-foreground group-hover:text-primary absolute top-3.5 left-4 h-4 w-4 transition-colors" />
                      <textarea
                        className="border-input/50 bg-background/50 ring-offset-background placeholder:text-muted-foreground focus:bg-background focus-visible:ring-ring flex min-h-[120px] w-full resize-y rounded-xl border px-3 py-3 pl-11 text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder={t('profile.bioPlaceholder')}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-border/40 flex justify-end border-t pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="shadow-primary/20 h-12 rounded-xl px-8 text-base font-bold shadow-lg transition-transform hover:scale-105"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-5 w-5" />
                    )}
                    {t('profile.saveChanges')}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
