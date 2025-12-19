// All listings page - Server Component
// Server Component with search params (Principle #4)

import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { listingsApi } from '@/lib/supabase/queries'

interface ListingsPageProps {
  searchParams: {
    category?: string
    search?: string
    page?: string
  }
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const page = Number(searchParams.page) || 1

  // Fetch listings with filters (Principle #5)
  const listingsRes = await listingsApi.getAll({
    category: searchParams.category,
    search: searchParams.search,
    limit: 12,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Listings</h1>
        {searchParams.search && (
          <p className="text-gray-600">
            Search results for: {searchParams.search}
          </p>
        )}
      </div>

      {listingsRes.error ? (
        <ErrorState message={listingsRes.error} />
      ) : (
        <ListingGrid listings={listingsRes.data} />
      )}
    </div>
  )
}
