'use client'

import { useState, useEffect } from 'react'
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
import { platformSettingsApi } from '@/lib/api'

export function SettingsManager() {
    const { t } = useTranslation(['common', 'admin'])
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)

    const [general, setGeneral] = useState({
        siteName: 'Slovor Marketplace',
        supportEmail: 'support@slovor.sk',
        footerDescription: 'Modern marketplace for Slovakia and Czech Republic. Buy and sell with confidence.'
    })

    const [social, setSocial] = useState({
        facebook: 'https://facebook.com/slovor',
        instagram: 'https://instagram.com/slovor',
        twitter: 'https://twitter.com/slovor'
    })

    const [system, setSystem] = useState({
        maintenanceMode: false
    })

    useEffect(() => {
        async function loadSettings() {
            try {
                const { data, error } = await platformSettingsApi.getAll()
                if (error) throw new Error(error)
                if (data) {
                    const gen = data.find(s => s.key === 'general')?.value
                    const soc = data.find(s => s.key === 'social')?.value
                    const sys = data.find(s => s.key === 'system')?.value

                    if (gen) setGeneral(gen)
                    if (soc) setSocial(soc)
                    if (sys) setSystem(sys)
                }
            } catch (error) {
                toast.error('Failed to load settings')
            } finally {
                setIsInitialLoading(false)
            }
        }
        loadSettings()
    }, [])

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const results = await Promise.all([
                platformSettingsApi.update('general', general),
                platformSettingsApi.update('social', social),
                platformSettingsApi.update('system', system)
            ])

            const hasError = results.some(r => r.error)
            if (hasError) throw new Error('Some settings failed to save')

            toast.success(t('admin:settingsSaved'))
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setIsLoading(false)
        }
    }

    if (isInitialLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                        <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                            <Globe className="h-5 w-5 text-primary" />
                            {t('admin:generalBranding')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('admin:siteName')}</label>
                                <Input
                                    value={general.siteName}
                                    onChange={e => setGeneral({ ...general, siteName: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('admin:supportEmail')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={general.supportEmail}
                                        onChange={e => setGeneral({ ...general, supportEmail: e.target.value })}
                                        className="h-12 pl-12 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('admin:footerDescription')}</label>
                            <textarea
                                value={general.footerDescription}
                                onChange={e => setGeneral({ ...general, footerDescription: e.target.value })}
                                className="border-input bg-background focus:ring-ring w-full min-h-[100px] rounded-xl border p-4 text-sm font-medium transition-all focus:ring-2 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                        <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                            <Share2 className="h-5 w-5 text-primary" />
                            {t('admin:socialMedia')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Facebook className="h-3 w-3" /> {t('admin:facebook')}
                                </label>
                                <Input
                                    value={social.facebook}
                                    onChange={e => setSocial({ ...social, facebook: e.target.value })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Instagram className="h-3 w-3" /> {t('admin:instagram')}
                                </label>
                                <Input
                                    value={social.instagram}
                                    onChange={e => setSocial({ ...social, instagram: e.target.value })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Twitter className="h-3 w-3" /> {t('admin:twitter')}
                                </label>
                                <Input
                                    value={social.twitter}
                                    onChange={e => setSocial({ ...social, twitter: e.target.value })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Status & Actions */}
                <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-6 shadow-sm">
                        <h3 className="text-lg font-bold uppercase tracking-tight">{t('admin:systemAction')}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed">
                            {t('admin:systemActionDesc')}
                        </p>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full h-14 rounded-xl font-bold uppercase tracking-widest text-xs shadow-sm bg-primary hover:bg-primary/90 transition-all active:scale-95"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                            {t('admin:publishChanges')}
                        </Button>
                    </div>

                    <div className={cn(
                        "rounded-xl p-6 border transition-all duration-500 shadow-sm",
                        system.maintenanceMode
                            ? "bg-amber-500/10 border-amber-500/30"
                            : "bg-emerald-500/10 border-emerald-500/30"
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold uppercase tracking-tight">{t('admin:maintenance')}</h3>
                            <div
                                onClick={() => setSystem({ ...system, maintenanceMode: !system.maintenanceMode })}
                                className={cn(
                                    "w-12 h-6 rounded-xl relative cursor-pointer transition-colors duration-300",
                                    system.maintenanceMode ? "bg-amber-500" : "bg-emerald-500"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-lg transition-transform duration-300",
                                    system.maintenanceMode && "translate-x-6"
                                )} />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {system.maintenanceMode ? (
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                            ) : (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                            )}
                            <p className="text-xs font-bold leading-relaxed">
                                {system.maintenanceMode
                                    ? t('admin:maintenanceOn')
                                    : t('admin:maintenanceOff')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
