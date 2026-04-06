import type { Listing } from '@/shared/lib/api'
import { ListingCard } from './listing-card'
import { EmptyState } from '@/shared/ui/empty-state'

interface ListingGridProps {
  listings: Listing[]
  featured?: boolean
}

export function ListingGrid({ listings, featured }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No listings found"
        description="Try adjusting your search or filters to find what you're looking for."
        actionLabel="View All Listings"
        actionHref="/listings"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing, index) => {
        const isPriority = index < 4
        if (isPriority) {
          console.debug(`[ListingGrid] Image priority set for index ${index}`)
        }
        return (
          <div
            key={listing.id}
            className="animate-in fade-in zoom-in-95 duration-500"
          >
            <ListingCard
              listing={listing}
              featured={featured}
              priority={isPriority}
            />
          </div>
        )
      })}
    </div>
  )
}
