'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

interface ListingStatusBadgeProps {
  status: string
  className?: string
}

export function ListingStatusBadge({
  status,
  className,
}: ListingStatusBadgeProps) {
  const { t } = useTranslation(['admin'])

  const styles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    draft: 'bg-muted text-muted-foreground border-border/40',
    sold: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-md px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase',
        styles[status] || styles.draft,
        className
      )}
    >
      {t(`admin:status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
    </Badge>
  )
}
