import { Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export function UsersHeader() {
    const { t } = useTranslation('common');

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    {t('admin:userManagement')}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {t('admin:manageMembersTrust')}
                </p>
            </div>
        </div>
    );
}
