import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container space-y-8 py-10">
      <Skeleton className="h-12 w-full max-w-sm" />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
