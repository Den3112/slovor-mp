import { Tag } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { CategorySelectProps } from './types'

export function CategorySelect({
  categories,
  value,
  onChange,
  locale,
}: CategorySelectProps) {
  const { t } = useTranslation(['filters', 'common', 'categories'])

  return (
    <div className="space-y-3">
      <label className="text-primary flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
        <Tag className="h-4 w-4" />
        {t('common:category')}
      </label>
      <Select
        value={value || 'all'}
        onValueChange={(v) => onChange(v === 'all' ? '' : v)}
      >
        <SelectTrigger className="border-border/60 bg-muted/20 h-11 w-full rounded-lg font-bold">
          <SelectValue
            placeholder={t('filters:allCategories')}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t('filters:allCategories')}
          </SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {getLocalizedCategoryName(cat, locale, t)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
