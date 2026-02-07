import { Tag } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { PriceRangeProps } from './types'

export function PriceRange({
  min,
  max,
  onMinChange,
  onMaxChange,
}: PriceRangeProps) {
  const { t } = useTranslation(['filters', 'common'])

  return (
    <div className="space-y-3">
      <label className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
        <Tag className="h-3.5 w-3.5" />
        {t('common:price')}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <span className="text-muted-foreground/40 absolute top-1/2 left-3 -translate-y-1/2 text-[10px] font-bold">
            €
          </span>
          <input
            type="number"
            value={min}
            onChange={(e) => onMinChange(e.target.value)}
            placeholder={t('filters:priceMin')}
            className="border-border/60 bg-muted/20 placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/10 w-full rounded-lg border py-2.5 pr-3 pl-7 text-xs font-bold transition-all focus:ring-4 focus:outline-none"
          />
        </div>
        <div className="relative">
          <span className="text-muted-foreground/40 absolute top-1/2 left-3 -translate-y-1/2 text-[10px] font-bold">
            €
          </span>
          <input
            type="number"
            value={max}
            onChange={(e) => onMaxChange(e.target.value)}
            placeholder={t('filters:priceMax')}
            className="border-border/60 bg-muted/20 placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/10 w-full rounded-lg border py-2.5 pr-3 pl-7 text-xs font-bold transition-all focus:ring-4 focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
