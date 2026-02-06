import { useTranslation } from '@/lib/i18n';

export function SettingsHeader() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-card border border-border p-6 rounded-xl shadow-sm">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold uppercase tracking-tight flex items-center gap-2 text-foreground">
                    {t('profile:settings')}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {t('profile:settingsDescription')}
                </p>
            </div>
        </div>
    );
}
