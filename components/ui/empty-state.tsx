interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

import Link from 'next/link'

export function EmptyState({
  icon = '🔍',
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-4 text-7xl">{icon}</div>
      <h3 className="mb-2 text-2xl font-bold text-gray-900">{title}</h3>
      {description && (
        <p className="mb-6 max-w-md text-center text-gray-500">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
