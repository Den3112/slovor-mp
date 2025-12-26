// Loading Component
// Simple loading state (Principle #1)

export function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
        <p className="mt-2 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
}
