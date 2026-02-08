import { Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
          <Input
            type="number"
            value={min}
            onChange={(e) => onMinChange(e.target.value)}
            placeholder={t('filters:priceMin')}
            className="pl-7"
          />
        </div>
        <div className="relative">
          <span className="text-muted-foreground/40 absolute top-1/2 left-3 -translate-y-1/2 text-[10px] font-bold">
            €
          </span>
          <Input
            type="number"
            value={max}
            onChange={(e) => onMaxChange(e.target.value)}
            placeholder={t('filters:priceMax')}
            className="pl-7"
          />
        </div>
      </div>
    </div>
  )
}
