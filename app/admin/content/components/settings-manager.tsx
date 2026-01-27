'use client'

import { useState } from 'react'
import {
    Save,
    Loader2,
    Globe,
    Mail,
    Facebook,
    Instagram,
    Twitter,
    AlertCircle,
    CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function SettingsManager() {
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        siteName: 'Slovor Marketplace',
        supportEmail: 'support@slovor.sk',
        facebookUrl: 'https://facebook.com/slovor',
        instagramUrl: 'https://instagram.com/slovor',
        twitterUrl: 'https://twitter.com/slovor',
        footerDescription: 'Modern marketplace for Slovakia and Czech Republic. Buy and sell with confidence.',
        maintenanceMode: false
    })

    const handleSave = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        toast.success('Settings saved successfully')
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
                        <h3 className="text-xl font-black italic flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            General Branding
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Site Name</label>
                                <Input
                                    value={settings.siteName}
                                    onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Support Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={settings.supportEmail}
                                        onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
                                        className="h-12 pl-12 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Footer Description</label>
                            <textarea
                                value={settings.footerDescription}
                                onChange={e => setSettings({ ...settings, footerDescription: e.target.value })}
                                className="w-full min-h-[100px] p-4 rounded-2xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
                        <h3 className="text-xl font-black italic flex items-center gap-2">
                            <PlusIcon className="h-5 w-5 text-primary" />
                            Social Media
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Facebook className="h-3 w-3" /> Facebook
                                </label>
                                <Input
                                    value={settings.facebookUrl}
                                    onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Instagram className="h-3 w-3" /> Instagram
                                </label>
                                <Input
                                    value={settings.instagramUrl}
                                    onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Twitter className="h-3 w-3" /> Twitter/X
                                </label>
                                <Input
                                    value={settings.twitterUrl}
                                    onChange={e => setSettings({ ...settings, twitterUrl: e.target.value })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 space-y-6 shadow-lg shadow-primary/5">
                        <h3 className="text-lg font-black italic">System Action</h3>
                        <p className="text-sm font-medium text-muted-foreground">
                            Update global configuration. Changes will be applied immediately across the marketplace.
                        </p>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                            Publish Changes
                        </Button>
                    </div>

                    <div className={cn(
                        "rounded-3xl p-6 border transition-all duration-500 shadow-xl",
                        settings.maintenanceMode
                            ? "bg-amber-500/10 border-amber-500/30"
                            : "bg-emerald-500/10 border-emerald-500/30"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black italic uppercase tracking-tight">Maintenance</h3>
                            <div
                                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                className={cn(
                                    "w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300",
                                    settings.maintenanceMode ? "bg-amber-500" : "bg-emerald-500"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300",
                                    settings.maintenanceMode && "translate-x-6"
                                )} />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {settings.maintenanceMode ? (
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                            ) : (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                            )}
                            <p className="text-xs font-bold leading-relaxed">
                                {settings.maintenanceMode
                                    ? "Storefront is hidden. Only admins can access the site."
                                    : "Marketplace is live and accepting transactions."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
    )
}
