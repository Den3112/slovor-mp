'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Save, User, Phone, MapPin, AlignLeft, Mail, Coins } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useCurrency } from '@/components/providers/currency-provider'
import { CURRENCIES, type CurrencyCode } from '@/lib/types/currency'
import Image from 'next/image'
import { storageApi } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { PageTransition } from '@/components/ui/page-transition'

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
    // Use 'avatars' bucket
    const res = await storageApi.uploadImage(file, user.id, 'avatars')

    if (res.data) {
      setFormData(prev => ({ ...prev, avatar_url: res.data.url }))
      toast.success('Avatar uploaded successfully', { id: toastId })
    } else if (res.error) {
      toast.error('Upload failed', {
        description: res.error,
        id: toastId
      })
    }

    setIsUploading(false)
  }

  return (
    <PageTransition>
      <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Premium Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-[2rem] bg-gradient-to-br from-background/80 via-background/60 to-background/40 backdrop-blur-xl p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tight text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground font-medium text-base md:text-lg max-w-lg leading-relaxed">Manage your profile details, contact information, and preferences.</p>
          </div>
        </div>

        <div className="grid gap-8">
          <Card className="p-8 rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
            {!isDataLoaded ? (
              // Skeleton Loading State
              <div className="space-y-8 animate-shimmer">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-8 border-b border-border/40">
                  <div className="h-32 w-32 rounded-full bg-muted" />
                  <div className="space-y-2 flex-1 w-full max-w-sm">
                    <div className="h-6 w-32 bg-muted rounded" />
                    <div className="h-4 w-48 bg-muted rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-12 w-full bg-muted rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-8">

                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-8 border-b border-border/40">
                  <div className="relative group">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted shadow-2xl transition-transform group-hover:scale-105">
                      {formData.avatar_url ? (
                        <Image src={formData.avatar_url} alt="Avatar" fill className="object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-primary/5">
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
                      onClick={() => document.getElementById('avatar-input')?.click()}
                      className="absolute bottom-0 right-0 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
                    >
                      <div className="h-4 w-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.5l-.5 4a2 2 0 0 0 2 2l4-.5a2 2 0 0 0 .5-.5l11.832-11.832z" /></svg>
                      </div>
                    </button>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h3 className="text-xl font-bold">Profile Picture</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto sm:mx-0">
                      Upload a high-quality photo to build trust with other users.
                      <br />Supported formats: JPG, PNG, GIF. Max 5MB.
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      <Input
                        className="pl-11 h-12 rounded-xl bg-background/50 border-input/50 focus:bg-background transition-all"
                        value={formData.display_name}
                        onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Location</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      <Input
                        className="pl-11 h-12 rounded-xl bg-background/50 border-input/50 focus:bg-background transition-all"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Bratislava, Slovakia"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      <Input
                        className="pl-11 h-12 rounded-xl bg-background/50 border-input/50 focus:bg-background transition-all"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+421 900 000 000"
                      />
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Preferred Currency</label>
                    <div className="relative group">
                      <Coins className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      <select
                        className="flex h-12 w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 pl-11 text-sm ring-offset-background focus:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all appearance-none"
                        value={currency}
                        onChange={e => setCurrency(e.target.value as CurrencyCode)}
                      >
                        {Object.values(CURRENCIES).map(curr => (
                          <option key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name} ({curr.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Email (Full Width) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold ml-1 text-muted-foreground">Email Address (Read-only)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground/50" />
                      <Input
                        className="pl-11 h-12 rounded-xl bg-muted/20 border-border/20 text-muted-foreground cursor-not-allowed"
                        value={user?.email || ''}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  {/* Bio (Full Width) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold ml-1">Bio / Description</label>
                    <div className="relative group">
                      <AlignLeft className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      <textarea
                        className="flex min-h-[120px] w-full rounded-xl border border-input/50 bg-background/50 px-3 py-3 pl-11 text-sm ring-offset-background placeholder:text-muted-foreground focus:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-y"
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell buyers a bit about yourself, your shop policies, or what you sell..."
                      />
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-border/40 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="h-12 px-8 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Save Changes
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
