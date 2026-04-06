import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'

interface StatusBadgeProps {
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation(['admin'])

  const styles = {
    open: 'bg-destructive/10 text-destructive border-destructive/20',
    in_progress: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    closed: 'bg-muted text-muted-foreground border-border/40',
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-md px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase',
        styles[status],
        className
      )}
    >
      {t(
        `admin:tab${status
          .split('_')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join('')}`
      )}
    </Badge>
  )
}
