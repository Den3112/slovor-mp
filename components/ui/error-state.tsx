'use client'

// Error State Component
// Displays error messages to users

interface ErrorStateProps {
  error: string
  retry?: () => void
}

export function ErrorState({ error, retry }: ErrorStateProps) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <div className="mb-4 text-red-600">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Something went wrong</h3>
      <p className="mb-4 text-sm text-gray-600">{error}</p>
      {retry && (
        <button
          onClick={retry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
