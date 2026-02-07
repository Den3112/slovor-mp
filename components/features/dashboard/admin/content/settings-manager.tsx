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
  Share2,
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
    footerDescription:
      'Modern marketplace for Slovakia and Czech Republic. Buy and sell with confidence.',
  })

  const [social, setSocial] = useState({
    facebook: 'https://facebook.com/slovor',
    instagram: 'https://instagram.com/slovor',
    twitter: 'https://twitter.com/slovor',
  })

  const [system, setSystem] = useState({
    maintenanceMode: false,
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await platformSettingsApi.getAll()
        if (error) throw new Error(error)
        if (data) {
          const gen = data.find((s) => s.key === 'general')?.value
          const soc = data.find((s) => s.key === 'social')?.value
          const sys = data.find((s) => s.key === 'system')?.value

          if (gen) setGeneral(gen)
          if (soc) setSocial(soc)
          if (sys) setSystem(sys)
        }
      } catch (error) {
        toast.error(t('admin:loadSettingsError'))
      } finally {
        setIsInitialLoading(false)
      }
    }
    loadSettings()
  }, [t])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const results = await Promise.all([
        platformSettingsApi.update('general', general),
        platformSettingsApi.update('social', social),
        platformSettingsApi.update('system', system),
      ])

      const hasError = results.some((r) => r.error)
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
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Basic Info */}
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-card border-border space-y-6 rounded-lg border p-6 shadow-sm md:p-8">
            <h3 className="flex items-center gap-3 text-xl font-bold tracking-tight uppercase">
              <Globe className="text-primary h-5 w-5" />
              {t('admin:generalBranding')}
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  {t('admin:siteName')}
                </label>
                <Input
                  value={general.siteName}
                  onChange={(e) =>
                    setGeneral({ ...general, siteName: e.target.value })
                  }
                  className="h-12 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  {t('admin:supportEmail')}
                </label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                  <Input
                    value={general.supportEmail}
                    onChange={(e) =>
                      setGeneral({ ...general, supportEmail: e.target.value })
                    }
                    className="h-12 rounded-lg pl-12"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                {t('admin:footerDescription')}
              </label>
              <textarea
                value={general.footerDescription}
                onChange={(e) =>
                  setGeneral({ ...general, footerDescription: e.target.value })
                }
                className="border-input bg-background focus:ring-ring min-h-[100px] w-full rounded-lg border p-4 text-sm font-medium transition-all focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-card border-border space-y-6 rounded-lg border p-6 shadow-sm md:p-8">
            <h3 className="flex items-center gap-3 text-xl font-bold tracking-tight uppercase">
              <Share2 className="text-primary h-5 w-5" />
              {t('admin:socialMedia')}
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                  <Facebook className="h-3 w-3" /> {t('admin:facebook')}
                </label>
                <Input
                  value={social.facebook}
                  onChange={(e) =>
                    setSocial({ ...social, facebook: e.target.value })
                  }
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                  <Instagram className="h-3 w-3" /> {t('admin:instagram')}
                </label>
                <Input
                  value={social.instagram}
                  onChange={(e) =>
                    setSocial({ ...social, instagram: e.target.value })
                  }
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                  <Twitter className="h-3 w-3" /> {t('admin:twitter')}
                </label>
                <Input
                  value={social.twitter}
                  onChange={(e) =>
                    setSocial({ ...social, twitter: e.target.value })
                  }
                  className="h-11 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Status & Actions */}
        <div className="space-y-6">
          <div className="bg-primary/5 border-primary/20 space-y-6 rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight uppercase">
              {t('admin:systemAction')}
            </h3>
            <p className="text-muted-foreground text-[10px] leading-relaxed font-bold tracking-widest uppercase">
              {t('admin:systemActionDesc')}
            </p>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 h-14 w-full rounded-lg text-xs font-bold tracking-widest uppercase shadow-sm transition-all active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              {t('admin:publishChanges')}
            </Button>
          </div>

          <div
            className={cn(
              'rounded-lg border p-6 shadow-sm transition-all duration-500',
              system.maintenanceMode
                ? 'border-amber-500/30 bg-amber-500/10'
                : 'border-emerald-500/30 bg-emerald-500/10'
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold tracking-tight uppercase">
                {t('admin:maintenance')}
              </h3>
              <div
                onClick={() =>
                  setSystem({
                    ...system,
                    maintenanceMode: !system.maintenanceMode,
                  })
                }
                className={cn(
                  'relative h-6 w-12 cursor-pointer rounded-lg transition-colors duration-300',
                  system.maintenanceMode ? 'bg-amber-500' : 'bg-emerald-500'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 left-1 h-4 w-4 rounded-lg bg-white transition-transform duration-300',
                    system.maintenanceMode && 'translate-x-6'
                  )}
                />
              </div>
            </div>
            <div className="flex gap-3">
              {system.maintenanceMode ? (
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              )}
              <p className="text-xs leading-relaxed font-bold">
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
