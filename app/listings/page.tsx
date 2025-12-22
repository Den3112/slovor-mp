import { ListingsView } from '@/components/listing/ListingsView'
import { listingsApi } from '@/lib/supabase/queries'
import { Pagination } from '@/components/ui/pagination'
import { ErrorBoundary } from '@/components/ui/error-boundary'

interface ListingsPageProps {
  searchParams: {
    category?: string
    search?: string
    sort?: string
    priceMin?: string
    priceMax?: string
    condition?: string
    location?: string
    page?: string
  }
}

const ITEMS_PER_PAGE = 50

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1')
  
  // Fetch all matching listings to get total count
  const allResult = await listingsApi.getAll({
    categorySlug: params.category,
    search: params.search,
    sort: params.sort,
    priceMin: params.priceMin ? parseInt(params.priceMin) : undefined,
    priceMax: params.priceMax ? parseInt(params.priceMax) : undefined,
    condition: params.condition as 'new' | 'used' | undefined,
    location: params.location,
  })

  const totalItems = allResult.data?.length || 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  
  // Get paginated results
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedListings = allResult.data?.slice(startIndex, endIndex) || []

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <ListingsView
          listings={paginatedListings}
          error={allResult.error}
          searchQuery={params.search}
        />
        
        {totalItems > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
