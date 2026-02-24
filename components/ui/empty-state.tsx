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
    <div className="bg-muted/30 border-border/50 relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border px-6 py-20 text-center shadow-sm">
      {/* Decorative background elements */}
      <div className="bg-primary/5 absolute top-0 h-64 w-64 -translate-y-1/2 rounded-full blur-[100px]" />
      <div className="bg-secondary/10 absolute right-0 bottom-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full blur-[80px]" />

      <div className="relative z-10 flex flex-col items-center">
        <div
          className={cn(
            'bg-background shadow-primary/5 ring-border/50 mb-6 flex h-24 w-24 items-center justify-center rounded-2xl shadow-md ring-1',
            isString ? 'text-5xl' : ''
          )}
        >
          {isString ? (
            <span>{icon}</span>
          ) : (
            (() => {
              const Icon = icon as React.ElementType
              return (
                <Icon className="text-primary/80 h-10 w-10" strokeWidth={1.5} />
              )
            })()
          )}
        </div>

        <h3 className="text-foreground font-heading mb-3 text-2xl font-bold tracking-tight">
          {title}
        </h3>

        {description && (
          <p className="text-muted-foreground mb-8 max-w-md text-sm leading-relaxed">
            {description}
          </p>
        )}

        {actionLabel &&
          (onAction || actionHref) &&
          (onAction ? (
            <button
              onClick={onAction}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-bold shadow-lg transition-all active:scale-95"
            >
              {actionLabel}
            </button>
          ) : actionHref ? (
            <Link
              href={actionHref}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-bold shadow-lg transition-all active:scale-95"
            >
              {actionLabel}
            </Link>
          ) : null)}
      </div>
    </div>
  )
}
