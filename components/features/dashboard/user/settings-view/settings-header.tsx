import { useTranslation } from '@/lib/i18n'

export function SettingsHeader() {
  const { t } = useTranslation()

  return (
    <div className="bg-card border-border/50 flex flex-col gap-2 rounded-xl border p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1
          className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-2xl font-bold tracking-tight text-transparent transition-all duration-300"
        >
          {t('profile:settings')}
        </h1>
        <p className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
          {t('profile:settingsDescription')}
        </p>
      </div>
    </div>
  )
}
