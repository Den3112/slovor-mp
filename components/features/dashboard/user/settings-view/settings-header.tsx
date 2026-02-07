import { useTranslation } from '@/lib/i18n'

export function SettingsHeader() {
  const { t } = useTranslation()

  return (
    <div className="bg-card border-border flex flex-col gap-2 rounded-lg border p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-foreground flex items-center gap-2 text-3xl font-bold tracking-tight uppercase">
          {t('profile:settings')}
        </h1>
        <p className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
          {t('profile:settingsDescription')}
        </p>
      </div>
    </div>
  )
}
