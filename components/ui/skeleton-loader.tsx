// Skeleton Loader Components
// Principle #1: Small, reusable components

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border/50 bg-card">
      <div className="aspect-[4/3] bg-muted" />
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="h-3 w-1/4 rounded bg-muted" />
          <div className="h-5 w-3/4 rounded bg-muted" />
        </div>
        <div className="h-8 w-1/2 rounded bg-muted" />
        <div className="flex justify-between border-t border-border/50 pt-4">
          <div className="h-3 w-1/3 rounded bg-muted" />
          <div className="h-3 w-1/4 rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border/50 bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 rounded bg-muted" />
          <div className="h-4 w-1/3 rounded bg-muted" />
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
