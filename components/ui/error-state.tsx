// Error State Component
// Explicit error handling (Principle #5)

interface ErrorStateProps {
  error: Error
  retry?: () => void
}

export function ErrorState({ error, retry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        {retry && (
          <button
            onClick={retry}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
