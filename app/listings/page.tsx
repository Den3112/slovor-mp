'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ListingGrid } from '@/components/listing/grid'
import { ListingFilters } from '@/components/listing/filters'
import { ErrorState } from '@/components/ui/error-state'
import { ListingGridSkeleton } from '@/components/ui/loading-skeleton'
import { listingsApi, type Listing } from '@/lib/supabase/queries'

function ListingsContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      setError(null)
      
      const result = await listingsApi.getAll({
        category: searchParams.get('category') || undefined,
        search: searchParams.get('search') || undefined,
        limit: 50,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setListings(result.data)
      }
      
      setLoading(false)
    }

    fetchListings()
  }, [searchParams])

  const searchQuery = searchParams.get('search')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {searchQuery ? `Search results for "${searchQuery}"` : 'All Listings'}
        </h1>
        <p className="text-gray-600">
          {loading ? 'Loading...' : `${listings.length} listings found`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ListingFilters />
        </aside>

        <main className="lg:col-span-3">
          {loading ? (
            <ListingGridSkeleton />
          ) : error ? (
            <ErrorState message={error} />
          ) : (
            <ListingGrid listings={listings} />
          )}
        </main>
      </div>
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingGridSkeleton />}>
      <ListingsContent />
    </Suspense>
  )
}
