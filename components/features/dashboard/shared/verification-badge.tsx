import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

interface VerificationBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'none'
  className?: string
}

export function VerificationBadge({
  status,
  className,
}: VerificationBadgeProps) {
  const { t } = useTranslation(['admin'])

  const styles: Record<string, string> = {
    approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    none: 'bg-muted text-muted-foreground border-border/40',
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-md px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase',
        styles[status] || styles.none,
        className
      )}
    >
      {t(`admin:${status}`)}
    </Badge>
  )
}
