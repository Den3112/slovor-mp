// Listings View Component
// Principle #1: Separate View from Logic

import type { Listing } from '@/lib/supabase/queries'
import { ListingCard } from './card'

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
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  // Empty State
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    )
  }

  // Listings Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
