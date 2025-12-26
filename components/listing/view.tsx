'use client'

// Listings View Component
// Client component for displaying listings grid with filters

import { ListingCard } from './card'
import { ListingFilters } from './filters'
import type { Listing } from '@/lib/supabase/queries'

interface Props {
  listings: Listing[]
  error: string | null
  searchQuery?: string
}

export function ListingsView({ listings, error, searchQuery }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Listings</h1>
          {searchQuery && (
            <p className="text-gray-600">Searching for: &quot;{searchQuery}&quot;</p>
          )}
          <p className="text-gray-600 mt-1">
            {listings.length} {listings.length === 1 ? 'listing' : 'listings'} found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ListingFilters />
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-semibold">Error loading listings</p>
                <p className="text-red-500 text-sm mt-2">{error}</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">No listings found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
