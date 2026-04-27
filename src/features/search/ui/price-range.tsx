import { Input } from '@/shared/ui/input'
import { useTranslation } from '@/shared/lib/i18n'
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
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <span className="text-muted-foreground/40 absolute top-1/2 left-3 -translate-y-1/2 text-[10px] font-bold">
            {t('common:currencySymbol')}
          </span>
          <Input
            type="number"
            value={min}
            onChange={(e) => onMinChange(e.target.value)}
            placeholder={t('filters:priceMin')}
            aria-label={t('filters:priceMin')}
            className="pl-7"
          />
        </div>
        <div className="relative">
          <span className="text-muted-foreground/40 absolute top-1/2 left-3 -translate-y-1/2 text-[10px] font-bold">
            {t('common:currencySymbol')}
          </span>
          <Input
            type="number"
            value={max}
            onChange={(e) => onMaxChange(e.target.value)}
            placeholder={t('filters:priceMax')}
            aria-label={t('filters:priceMax')}
            className="pl-7"
          />
        </div>
      </div>
    </div>
  )
}
