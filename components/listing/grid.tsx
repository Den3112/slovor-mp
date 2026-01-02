import type { Listing } from '@/lib/supabase/queries'
import { ListingCard } from './card'
import { EmptyState } from '@/components/ui/empty-state'

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
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="duration-500 animate-in fade-in zoom-in-95"
        >
          <ListingCard listing={listing} featured={featured} />
        </div>
      ))}
    </div>
  )
}
