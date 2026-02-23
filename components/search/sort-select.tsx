'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from '@/lib/i18n'

export function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useTranslation()
  const currentSort = searchParams.get('sort') || 'newest'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`/${locale}/search?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm whitespace-nowrap">
        {t('filters:sort')}:
      </span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="border-border bg-muted/30 focus:ring-primary w-[180px] rounded-xl font-medium">
          <SelectValue placeholder={t('filters:sort')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{t('filters:newest')}</SelectItem>
          <SelectItem value="price-low">{t('filters:priceLow')}</SelectItem>
          <SelectItem value="price-high">{t('filters:priceHigh')}</SelectItem>
          <SelectItem value="views">{t('filters:popular')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
