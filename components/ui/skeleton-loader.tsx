// Skeleton Loader Components
// Principle #1: Small, reusable components

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse border border-border/50 rounded-2xl overflow-hidden bg-card">
      <div className="bg-muted aspect-[4/3]" />
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-1/4" />
          <div className="h-5 bg-muted rounded w-3/4" />
        </div>
        <div className="h-8 bg-muted rounded w-1/2" />
        <div className="pt-4 border-t border-border/50 flex justify-between">
          <div className="h-3 bg-muted rounded w-1/3" />
          <div className="h-3 bg-muted rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="animate-pulse border border-border/50 rounded-2xl p-6 bg-card">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-muted rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>
      </div>
    </div>
  )
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  )
}
