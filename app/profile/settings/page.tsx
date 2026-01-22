'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PageTransition } from '@/components/ui/page-transition'
import { SettingsProfileForm } from './components/profile-form'
import { SettingsAvatarUpload } from './components/avatar-upload'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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
              <SettingsProfileForm
                formData={formData}
                userEmail={user?.email}
                isLoading={isLoading}
                isUploading={false}
                onUpdate={handleUpdate}
                onChange={(field, value) => {
                  setFormData(prev => ({ ...prev, [field]: value }))
                }}
              >
                <SettingsAvatarUpload
                  avatarUrl={formData.avatar_url}
                  onAvatarChange={(newUrl) => setFormData(prev => ({ ...prev, avatar_url: newUrl }))}
                />
              </SettingsProfileForm>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
