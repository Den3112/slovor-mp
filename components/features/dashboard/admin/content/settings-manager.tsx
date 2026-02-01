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
    CheckCircle2,
    Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export function SettingsManager() {
    const { t } = useTranslation('common')
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
        toast.success(t('admin.settingsSaved'))
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
                        <h3 className="text-xl font-black italic flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            {t('admin.generalBranding')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.siteName')}</label>
                                <Input
                                    value={settings.siteName}
                                    onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.supportEmail')}</label>
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
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.footerDescription')}</label>
                            <textarea
                                value={settings.footerDescription}
                                onChange={e => setSettings({ ...settings, footerDescription: e.target.value })}
                                className="border-input bg-background focus:ring-ring w-full min-h-[100px] rounded-xl border p-4 text-sm font-medium transition-all focus:ring-2 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
                        <h3 className="text-xl font-black italic flex items-center gap-2">
                            <Share2 className="h-5 w-5 text-primary" />
                            {t('admin.socialMedia')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Facebook className="h-3 w-3" /> {t('admin.facebook')}
                                </label>
                                <Input
                                    value={settings.facebookUrl}
                                    onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Instagram className="h-3 w-3" /> {t('admin.instagram')}
                                </label>
                                <Input
                                    value={settings.instagramUrl}
                                    onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Twitter className="h-3 w-3" /> {t('admin.twitter')}
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
                        <h3 className="text-lg font-black italic">{t('admin.systemAction')}</h3>
                        <p className="text-sm font-medium text-muted-foreground">
                            {t('admin.systemActionDesc')}
                        </p>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                            {t('admin.publishChanges')}
                        </Button>
                    </div>

                    <div className={cn(
                        "rounded-3xl p-6 border transition-all duration-500 shadow-xl",
                        settings.maintenanceMode
                            ? "bg-amber-500/10 border-amber-500/30"
                            : "bg-emerald-500/10 border-emerald-500/30"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black italic uppercase tracking-tight">{t('admin.maintenance')}</h3>
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
                                    ? t('admin.maintenanceOn')
                                    : t('admin.maintenanceOff')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
