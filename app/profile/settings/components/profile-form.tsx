'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Save, User, Phone, MapPin, AlignLeft, Mail, Coins } from 'lucide-react'
import { CURRENCIES, type CurrencyCode } from '@/lib/types/currency'
import { useCurrency } from '@/components/providers/currency-provider'

interface SettingsProfileFormProps {
    formData: {
        display_name: string
        phone: string
        bio: string
        location: string
        avatar_url: string
    }
    userEmail: string | undefined
    isLoading: boolean
    isUploading: boolean
    onUpdate: (e: React.FormEvent) => void
    onChange: (field: string, value: string) => void
    children?: React.ReactNode // For avatar upload
}

export function SettingsProfileForm({
    formData,
    userEmail,
    isLoading,
    isUploading,
    onUpdate,
    onChange,
    children
}: SettingsProfileFormProps) {
    const { currency, setCurrency } = useCurrency()

    return (
        <form onSubmit={onUpdate} className="space-y-8">
            {children}

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
                            onChange={e => onChange('display_name', e.target.value)}
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
                            onChange={e => onChange('location', e.target.value)}
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
                            onChange={e => onChange('phone', e.target.value)}
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
                            value={userEmail || ''}
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
                            onChange={e => onChange('bio', e.target.value)}
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
    )
}
