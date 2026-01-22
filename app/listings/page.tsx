// All Listings Page - Server Component
// Shows all listings with search and filters

import { listingsApi } from '@/lib/api'
import { ListingsView } from '@/components/listing/view'

export const revalidate = 60

const ITEMS_PER_PAGE = 12

interface Props {
  searchParams: Promise<{
    search?: string
    category?: string
    priceMin?: string
    priceMax?: string
    condition?: string
    location?: string
    sort?: string
  }>
}

export default async function ListingsPage({ searchParams }: Props) {
  const params = await searchParams

  const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)

  const filterOptions = {
    search: params.search,
    ...(params.category ? (isUuid(params.category) ? { categoryId: params.category } : { categorySlug: params.category }) : {}),
    priceMin: params.priceMin ? parseInt(params.priceMin) : undefined,
    priceMax: params.priceMax ? parseInt(params.priceMax) : undefined,
    condition: params.condition as 'new' | 'used' | undefined,
    location: params.location,
    sort: params.sort,
  }

  // Fetch first page and total count in parallel
  const [listingsResult, countResult] = await Promise.all([
    listingsApi.getAll({ ...filterOptions, limit: ITEMS_PER_PAGE }),
    listingsApi.getCount(filterOptions),
  ])

  return (
    <ListingsView
      initialListings={listingsResult.data || []}
      totalCount={countResult.data || 0}
      error={listingsResult.error}
      searchQuery={params.search}
      filters={filterOptions}
    />
  )
}
