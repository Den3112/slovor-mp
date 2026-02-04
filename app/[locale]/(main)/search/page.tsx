import { Suspense } from 'react'
import { SearchLayout } from '@/components/search/search-layout'
import { SearchFilters } from '@/components/search/search-filters'
import { listingsApi } from '@/lib/api'
import { Container } from '@/components/ui/container'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchResultsView } from '@/components/search/search-results-view'
import { SearchHeader } from '@/components/search/search-header'

// Fetch data on the server
async function SearchResults({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const { q, category, minPrice, maxPrice, condition, location, sort, page, ...rest } =
    searchParams
  const itemsPerPage = 12

  // Extract dynamic attributes (prefixed with attr_)
  const attributes: Record<string, string> = {}
  Object.entries(rest).forEach(([key, value]) => {
    if (key.startsWith('attr_') && typeof value === 'string') {
      attributes[key.replace('attr_', '')] = value
    }
  })

  const filterOptions = {
    page: Number(page) || 1,
    limit: itemsPerPage,
    search: q,
    categorySlug: category,
    priceMin: minPrice ? Number(minPrice) : undefined,
    priceMax: maxPrice ? Number(maxPrice) : undefined,
    condition: condition as 'new' | 'used',
    location,
    sort,
    attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
  }

  const [{ data: listings }, { data: total }] = await Promise.all([
    listingsApi.getAll(filterOptions),
    listingsApi.getCount(filterOptions),
  ])

  const items = listings || []
  const totalCount = total || 0

  return (
    <SearchResultsView
      listings={items}
      totalCount={totalCount}
      itemsPerPage={itemsPerPage}
    />
  )
}

function SearchLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ''

  return (
    <Container className="min-h-screen bg-background pb-12">
      {/* Header Section */}
      <SearchHeader query={query} />

      <SearchLayout sidebar={<SearchFilters />}>
        <Suspense fallback={<SearchLoading />}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </SearchLayout>
    </Container>
  )
}
