'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    User,
    MapPin,
    Phone,
    Coins,
    Mail,
    AlignLeft,
    Loader2,
    Save,
} from 'lucide-react'
import { CURRENCIES, type CurrencyCode } from '@/lib/types/currency'

interface SettingsFormProps {
    formData: any
    setFormData: (data: any) => void
    currency: CurrencyCode
    setCurrency: (currency: CurrencyCode) => void
    userEmail: string
    onSubmit: (e: React.FormEvent) => void
    isLoading: boolean
    isUploading: boolean
}

export function SettingsForm({
    formData,
    setFormData,
    currency,
    setCurrency,
    userEmail,
    onSubmit,
    isLoading,
    isUploading,
}: SettingsFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Form Fields - 2 Column Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold">Full Name</label>
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
                    <label className="ml-1 text-sm font-bold">Location</label>
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
                    <label className="ml-1 text-sm font-bold">Phone Number</label>
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
                    <label className="ml-1 text-sm font-bold">Preferred Currency</label>
                    <div className="group relative">
                        <Coins className="text-muted-foreground group-hover:text-primary absolute top-3.5 left-4 h-4 w-4 transition-colors" />
                        <select
                            className="border-input/50 bg-background/50 ring-offset-background focus:bg-background focus-visible:ring-ring flex h-12 w-full appearance-none rounded-xl border px-3 py-2 pl-11 text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
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
                        Email Address (Read-only)
                    </label>
                    <div className="relative">
                        <Mail className="text-muted-foreground/50 absolute top-3.5 left-4 h-4 w-4" />
                        <Input
                            className="bg-muted/20 border-border/20 text-muted-foreground h-12 cursor-not-allowed rounded-xl pl-11"
                            value={userEmail}
                            readOnly
                            disabled
                        />
                    </div>
                </div>

                {/* Bio (Full Width) */}
                <div className="space-y-2 md:col-span-2">
                    <label className="ml-1 text-sm font-bold">Bio / Description</label>
                    <div className="group relative">
                        <AlignLeft className="text-muted-foreground group-hover:text-primary absolute top-3.5 left-4 h-4 w-4 transition-colors" />
                        <textarea
                            className="border-input/50 bg-background/50 ring-offset-background placeholder:text-muted-foreground focus:bg-background focus-visible:ring-ring flex min-h-[120px] w-full resize-y rounded-xl border px-3 py-3 pl-11 text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell buyers a bit about yourself, your shop policies, or what you sell..."
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
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
