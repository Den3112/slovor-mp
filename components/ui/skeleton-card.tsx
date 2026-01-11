import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm overflow-hidden md:rounded-3xl">
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-2.5 p-4 md:space-y-4 md:p-6">
        {/* Category and views */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />

        {/* Price and location */}
        <div className="flex items-end justify-between pt-1 md:pt-2">
          <Skeleton className="h-7 w-24 md:h-9 md:w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonCardCompact() {
  return (
    <div className="flex gap-4 overflow-hidden rounded-2xl border border-border/40 bg-card p-3">
      {/* Image skeleton */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex items-end justify-between">
          <Skeleton className="h-5 w-16 sm:h-6 sm:w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonCardList({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonCardListCompact({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCardCompact key={i} />
      ))}
    </div>
  )
}
