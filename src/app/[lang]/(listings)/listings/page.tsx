// All Listings Page - Server Component
// Shows all listings with search and filters

import { listingsApi, categoriesApi } from '@/shared/lib/api'
import { ListingsView } from '@/widgets/listings-catalog'

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

  // Extract and group dynamic attributes (attr_*)
  const attributes: Record<string, any> = {}
  Object.entries(params).forEach(([key, value]) => {
    if (key.startsWith('attr_')) {
      const attrKey = key.replace('attr_', '')
      if (attrKey.endsWith('_min')) {
        const coreKey = attrKey.replace('_min', '')
        attributes[coreKey] = { ...attributes[coreKey], min: value }
      } else if (attrKey.endsWith('_max')) {
        const coreKey = attrKey.replace('_max', '')
        attributes[coreKey] = { ...attributes[coreKey], max: value }
      } else {
        attributes[attrKey] = value
      }
    }
  })

  const filterOptions = {
    search: params.search,
    categoryId: params.category,
    priceMin: params.priceMin ? parseInt(params.priceMin) : undefined,
    priceMax: params.priceMax ? parseInt(params.priceMax) : undefined,
    condition: params.condition as 'new' | 'used' | undefined,
    location: params.location,
    sort: params.sort,
    attributes,
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
