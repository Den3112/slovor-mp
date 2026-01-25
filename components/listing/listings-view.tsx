// Listings View Component
// Principle #1: Separate View from Logic

import type { Listing } from '@/lib/api'
import { ListingCard } from './card'
import { EmptyState } from '@/components/ui/empty-state'

interface ListingsViewProps {
  listings: Listing[]
  error?: string
  emptyMessage?: string
}

export function ListingsView({
  listings,
  error,
  emptyMessage = 'No listings found',
}: ListingsViewProps) {
  // Error State
  if (error) {
    return (
      <EmptyState icon="⚠️" title="Something went wrong" description={error} />
    )
  }

  // Empty State
  if (listings.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={emptyMessage}
        description="Try adjusting your filters or search query."
      />
    )
  }

  // Listings Grid
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
