import { TrendingUp } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n';
import { SortSelectProps } from './types';

export function SortSelect({ value, onChange, options }: SortSelectProps) {
    const { t } = useTranslation(['filters']);

    return (
        <div className="space-y-3">
            <label className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <TrendingUp className="h-3.5 w-3.5" />
                {t('filters:sort')}
            </label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="border-border/60 bg-muted/20 h-11 w-full rounded-xl font-bold">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
