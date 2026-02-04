'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Loader2,
    Save,
    User,
    Phone,
    MapPin,
    AlignLeft,
    Mail,
    Coins,
    Camera,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useCurrency } from '@/components/providers/currency-provider'
import { CURRENCIES, type CurrencyCode } from '@/lib/types/currency'
import Image from 'next/image'
import { storageApi } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { useTranslation } from '@/lib/i18n'
import { PageTransition } from '@/components/ui/page-transition'

export function SettingsView() {
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
            <div className="space-y-6">
                {/* Header - Solid */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-card border border-border p-6 rounded-xl shadow-sm">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-2">
                            {t('profile.settings')}
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t('profile.settingsDescription')}</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
                    {!isDataLoaded ? (
                        // Skeleton Loading State
                        <div className="animate-pulse space-y-8">
                            <div className="flex flex-col items-center gap-8 border-b pb-8 sm:flex-row sm:items-start border-border/40">
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
                            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start pb-6 border-b border-border/40">
                                <div className="relative group">
                                    <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-muted/30 bg-muted shadow-sm relative">
                                        {formData.avatar_url ? (
                                            <Image
                                                src={formData.avatar_url}
                                                alt="Avatar"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary/50">
                                                <User className="h-10 w-10 opacity-50" />
                                            </div>
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('avatar-input')?.click()}
                                        className="absolute bottom-0 right-0 p-2 rounded-xl bg-primary text-primary-foreground shadow-md hover:scale-105 transition-transform"
                                        title={t('profile.uploadAvatar')}
                                    >
                                        <Camera className="h-4 w-4" />
                                    </button>
                                    <input
                                        id="avatar-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                </div>

                                <div className="flex-1 text-center sm:text-left space-y-1 mt-2">
                                    <h3 className="font-bold text-lg">{t('profile.profilePicture')}</h3>
                                    <p className="text-sm text-muted-foreground text-balanced max-w-xs">{t('profile.uploadDescription')}</p>
                                </div>
                            </div>

                            {/* Form Fields - 2 Column Grid */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('profile.fullName')}</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9 h-11 rounded-xl"
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
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('profile.location')}</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9 h-11 rounded-xl"
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
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        {t('profile.phoneNumber')}
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9 h-11 rounded-xl"
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
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        {t('profile.preferredCurrency')}
                                    </label>
                                    <div className="relative">
                                        <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <select
                                            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
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
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        {t('profile.emailReadonly')}
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            className="pl-9 h-11 bg-muted/20 text-muted-foreground rounded-xl"
                                            value={user?.email || ''}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Bio (Full Width) */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        {t('profile.bio')}
                                    </label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                        <Textarea
                                            data-testid="profile-settings-bio"
                                            className="min-h-[120px] pl-9 py-3 resize-y"
                                            value={formData.bio}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                setFormData({ ...formData, bio: e.target.value })
                                            }
                                            placeholder={t('profile.bioPlaceholder')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-border/40">
                                <Button
                                    type="submit"
                                    data-testid="profile-settings-save"
                                    disabled={isLoading || isUploading}
                                    className="min-w-[140px] rounded-xl font-black uppercase tracking-widest"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    {t('profile.saveChanges')}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}
