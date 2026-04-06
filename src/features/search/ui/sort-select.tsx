import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { useTranslation } from '@/shared/lib/i18n'
import { SortSelectProps } from './types'

export function SortSelect({ value, onChange, options }: SortSelectProps) {
  const { t } = useTranslation(['filters'])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="border-border bg-muted/30 focus:ring-primary h-12 w-full rounded-xl font-medium">
        <SelectValue placeholder={t('filters:sort')} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
