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
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-7xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
