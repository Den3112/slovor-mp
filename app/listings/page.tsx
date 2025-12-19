// All Listings Page - Server Component
// Follows Principle #4: Server Components by default
// Follows Principle #7: No global state

import { Suspense } from 'react'
import { ListingGrid } from '@/components/listing/grid'
import { ListingFilters } from '@/components/listing/filters'
import { ErrorState } from '@/components/ui/error-state'
import { listingsApi } from '@/lib/supabase/queries'

interface ListingsPageProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    priceMin?: string
    priceMax?: string
  }
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  // Principle #3: One responsibility - centralized data fetching
  const result = await listingsApi.getAll({
    category: searchParams.category,
    search: searchParams.search,
    limit: 50,
  })

  const searchQuery = searchParams.search

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {searchQuery ? `Search results for "${searchQuery}"` : 'All Listings'}
        </h1>
        <p className="text-gray-600">
          {result.data ? `${result.data.length} listings found` : 'Loading...'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          {/* Suspense boundary for client component with useSearchParams */}
          <Suspense fallback={<div className="h-64 bg-gray-100 rounded-lg animate-pulse" />}>
            <ListingFilters />
          </Suspense>
        </aside>

        <main className="lg:col-span-3">
          {/* Principle #5: Errors are part of design */}
          {result.error ? (
            <ErrorState message={result.error} />
          ) : (
            <ListingGrid listings={result.data} />
          )}
        </main>
      </div>
    </div>
  )
}
