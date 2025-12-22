// Skeleton Loader Component
// Principle #1: Small, reusable component

export function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-[4/3] rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLoader key={i} />
      ))}
    </div>
  )
}
