interface EmptyStateProps {
  icon?: string | React.ElementType
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

import { Search } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon = Search,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const isString = typeof icon === 'string'

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div
        className={cn(
          'mb-4 flex items-center justify-center',
          isString ? 'text-7xl' : ''
        )}
      >
        {isString
          ? icon
          : (() => {
            const Icon = icon
            return <Icon className="text-muted-foreground/50 h-16 w-16" />
          })()}
      </div>
      <h3 className="text-foreground mb-2 text-2xl font-bold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md text-center">
          {description}
        </p>
      )}
      {actionLabel && (onAction || actionHref) && (
        onAction ? (
          <button
            onClick={onAction}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold transition-colors"
          >
            {actionLabel}
          </button>
        ) : actionHref ? (
          <Link
            href={actionHref}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold transition-colors"
          >
            {actionLabel}
          </Link>
        ) : null
      )}
    </div>
  )
}
