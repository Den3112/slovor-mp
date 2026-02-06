import { PackageCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ConditionToggleProps } from './types';

export function ConditionToggle({ value, onChange }: ConditionToggleProps) {
    const { t } = useTranslation(['filters', 'common']);

    return (
        <div className="space-y-3">
            <label className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <PackageCheck className="h-3.5 w-3.5" />
                {t('filters:condition')}
            </label>
            <div className="bg-muted/20 flex rounded-xl border border-border/60 p-1">
                {[
                    { value: '', label: t('common:all') || 'All' },
                    { value: 'new', label: t('filters:new') },
                    { value: 'used', label: t('filters:used') },
                ].map((c) => (
                    <button
                        key={c.value}
                        onClick={() => onChange(c.value)}
                        className={cn(
                            'flex-1 rounded-lg py-2 text-[10px] font-bold tracking-widest uppercase transition-all',
                            value === c.value
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                        )}
                    >
                        {c.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
