import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent'
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { t } = useTranslation(['admin'])

  const styles = {
    low: 'bg-muted text-muted-foreground border-border/40',
    medium: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    high: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    urgent: 'bg-destructive/10 text-destructive border-destructive/20',
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-md px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase',
        styles[priority],
        className
      )}
    >
      {t(
        `admin:priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`
      )}
    </Badge>
  )
}
