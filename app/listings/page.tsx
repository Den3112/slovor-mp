// Listings Page
// Server Component with search params (Principle #4)

import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { listingsApi } from '@/lib/supabase/queries'

interface ListingsPageProps {
  searchParams: {
    search?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    location?: string
    page?: string
  }
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const page = Number(searchParams.page) || 1
  const filters = {
    search: searchParams.search,
    categoryId: searchParams.category,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    location: searchParams.location,
  }

  const result = await listingsApi.getAll(page, 12, filters)

  // Handle errors (Principle #5)
  if (result.error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState error={result.error} />
      </div>
    )
  }

  const { items: listings, total } = result.data

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {searchParams.search ? `Search results for "${searchParams.search}"` : 'All Listings'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {total} listing{total !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Listings */}
      <ListingGrid listings={listings} />
    </div>
  )
}
