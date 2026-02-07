import { MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from '@/lib/i18n'
import { LocationSelectProps } from './types'

const LOCATIONS = [
  { value: '', label: 'allLocations' },
  { value: 'Bratislava', label: 'Bratislava' },
  { value: 'Košice', label: 'Košice' },
  { value: 'Prešov', label: 'Prešov' },
  { value: 'Žilina', label: 'Žilina' },
  { value: 'Banská Bystrica', label: 'Banská Bystrica' },
  { value: 'Nitra', label: 'Nitra' },
  { value: 'Trnava', label: 'Trnava' },
  { value: 'Trenčín', label: 'Trenčín' },
]

export function LocationSelect({ value, onChange }: LocationSelectProps) {
  const { t } = useTranslation(['filters'])

  return (
    <div className="space-y-3">
      <label className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
        <MapPin className="h-3.5 w-3.5" />
        {t('filters:location')}
      </label>
      <Select
        value={value || 'all'}
        onValueChange={(v) => onChange(v === 'all' ? '' : v)}
      >
        <SelectTrigger className="border-border/60 bg-muted/20 h-11 w-full rounded-lg font-bold">
          <SelectValue placeholder={t('filters:allLocations')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filters:allLocations')}</SelectItem>
          {LOCATIONS.filter((l) => l.value).map((loc) => (
            <SelectItem key={loc.value} value={loc.value}>
              {loc.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
