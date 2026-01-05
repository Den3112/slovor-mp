'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Save, User, Phone, MapPin, AlignLeft } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import Image from 'next/image'
import { storageApi } from '@/lib/api'

export default function SettingsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
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
              full_name: data.full_name || '',
              phone: data.phone || '',
              bio: data.bio || '',
              location: data.location || '',
              avatar_url: data.avatar_url || '',
            })
          }
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
      full_name: formData.full_name,
      phone: formData.phone,
      bio: formData.bio,
      location: formData.location,
      avatar_url: formData.avatar_url,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert('Error updating profile')
    } else {
      // Success feedback?
    }
    setIsLoading(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    // Upload logic reusing storageApi
    const res = await storageApi.uploadImages([file], user.id)
    const uploadedUrl = res.data?.[0]?.url
    if (uploadedUrl) {
      setFormData(prev => ({ ...prev, avatar_url: uploadedUrl }))
    }
    setIsUploading(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-black">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <form onSubmit={handleUpdate} className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm space-y-6">

        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-muted">
            {formData.avatar_url ? (
              <Image src={formData.avatar_url} alt="Avatar" fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <User className="h-10 w-10 opacity-20" />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <div>
            <Button type="button" variant="outline" className="font-bold" onClick={() => document.getElementById('avatar-input')?.click()}>
              Change Avatar
            </Button>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-bold">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+421 900 000 000"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="Bratislava, Slovakia"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Bio</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us a bit about yourself..."
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-end">
          <Button type="submit" disabled={isLoading || isUploading} className="font-bold min-w-[120px]">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>

      </form>
    </div>
  )
}
