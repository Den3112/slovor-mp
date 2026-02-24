import { Container } from '@/components/ui/container'

export default function BlogLoading() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-20 md:pt-32">
      <Container>
        {/* Header Skeleton */}
        <div className="mb-16 text-center">
          <div className="bg-muted mx-auto mb-6 h-10 w-40 animate-pulse rounded-xl" />
          <div className="bg-muted mx-auto mb-6 h-16 w-3/4 animate-pulse rounded-xl md:h-24" />
          <div className="bg-muted mx-auto h-6 w-1/2 animate-pulse rounded-xl" />
        </div>

        {/* Featured Post Skeleton */}
        <div className="bg-muted mb-20 aspect-video w-full animate-pulse rounded-xl md:aspect-[21/9]" />

        {/* Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-card border-border overflow-hidden rounded-xl border p-0 shadow-sm"
            >
              <div className="bg-muted aspect-video w-full animate-pulse" />
              <div className="space-y-4 p-8">
                <div className="bg-muted h-6 w-20 animate-pulse rounded-xl" />
                <div className="bg-muted h-10 w-full animate-pulse rounded-xl" />
                <div className="bg-muted h-16 w-full animate-pulse rounded-xl" />
                <div className="flex justify-between pt-6">
                  <div className="bg-muted h-4 w-24 animate-pulse rounded-xl" />
                  <div className="bg-muted h-4 w-24 animate-pulse rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
