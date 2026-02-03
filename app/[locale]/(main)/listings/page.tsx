// All Listings Page - Server Component
// Shows all listings with search and filters

import { listingsApi, categoriesApi } from '@/lib/api'
import { ListingsView } from '@/components/listing/view'

export const revalidate = 60

const ITEMS_PER_PAGE = 12

interface Props {
  searchParams: {
    search?: string
    category?: string
    priceMin?: string
    priceMax?: string
    condition?: string
    location?: string
    sort?: string
  }
}

export default async function ListingsPage({ searchParams }: Props) {
  const params = searchParams

  const filterOptions = {
    search: params.search,
    categoryId: params.category,
    priceMin: params.priceMin ? parseInt(params.priceMin) : undefined,
    priceMax: params.priceMax ? parseInt(params.priceMax) : undefined,
    condition: params.condition as 'new' | 'used' | undefined,
    location: params.location,
    sort: params.sort,
  }

  // Fetch listings, total count and categories in parallel
  const [listingsResult, countResult, categoriesResult] = await Promise.all([
    listingsApi.getAll({ ...filterOptions, limit: ITEMS_PER_PAGE }),
    listingsApi.getCount(filterOptions),
    categoriesApi.getAll(),
  ])

  return (
    <ListingsView
      initialListings={listingsResult.data || []}
      totalCount={countResult.data || 0}
      categories={categoriesResult.data || []}
      error={listingsResult.error || categoriesResult.error}
      searchQuery={params.search}
      filters={filterOptions}
    />
  )
}
