export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse border rounded-lg overflow-hidden">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="animate-pulse border rounded-lg p-6">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
  )
}

export function ListingGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}
