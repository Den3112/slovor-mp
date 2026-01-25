// Skeleton Loader Components
// Principle #1: Small, reusable components

export function ListingCardSkeleton() {
  return (
    <div className="border-border/50 bg-card animate-pulse overflow-hidden rounded-2xl border">
      <div className="bg-muted aspect-[4/3]" />
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="bg-muted h-3 w-1/4 rounded" />
          <div className="bg-muted h-5 w-3/4 rounded" />
        </div>
        <div className="bg-muted h-8 w-1/2 rounded" />
        <div className="border-border/50 flex justify-between border-t pt-4">
          <div className="bg-muted h-3 w-1/3 rounded" />
          <div className="bg-muted h-3 w-1/4 rounded" />
        </div>
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="border-border/50 bg-card animate-pulse rounded-2xl border p-6">
      <div className="flex items-center gap-4">
        <div className="bg-muted h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="bg-muted h-5 w-2/3 rounded" />
          <div className="bg-muted h-4 w-1/3 rounded" />
        </div>
      </div>
    </div>
  )
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  )
}
