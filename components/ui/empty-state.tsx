interface EmptyStateProps {
  icon?: string | React.ElementType
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon = '🔍',
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const isString = typeof icon === 'string'

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className={cn("mb-4 flex items-center justify-center", isString ? "text-7xl" : "")}>
        {isString ? (
          icon
        ) : (
          (() => {
            const Icon = icon
            return <Icon className="h-16 w-16 text-muted-foreground/50" />
          })()
        )}
      </div>
      <h3 className="mb-2 text-2xl font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mb-6 max-w-md text-center text-muted-foreground">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
