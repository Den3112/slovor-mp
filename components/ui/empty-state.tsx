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
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/10 bg-zinc-950/30 px-8 py-20 text-center">
      <div className={cn("relative mb-8 flex h-24 w-24 items-center justify-center border-2 border-primary/20", isString ? "text-5xl" : "")}>
        <div className="absolute -inset-2 border border-primary/10 group-hover:border-primary/30 transition-colors" />
        {isString ? (
          icon
        ) : (
          (() => {
            const Icon = icon
            return <Icon className="h-10 w-10 text-primary" />
          })()
        )}
      </div>
      <h3 className="mb-4 font-heading text-3xl font-bold italic tracking-tight text-white">{title}</h3>
      {description && (
        <p className="mb-10 max-w-sm font-sans text-sm font-medium leading-relaxed tracking-wide text-zinc-500">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="rounded-none bg-primary px-10 py-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-1 shadow-xl shadow-primary/20"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
