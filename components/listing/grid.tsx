// Listing Grid Component
// Simple composition (Principle #1)

import type { Listing } from '@/lib/types/database'
import { ListingCard } from './card'

interface ListingGridProps {
  listings: Listing[]
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-500">No listings found</p>
          <p className="mt-1 text-sm text-gray-400">Try adjusting your filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
