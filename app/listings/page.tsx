// All Listings Page - Server Component
// Shows all listings with search and filters

import { listingsApi } from '@/lib/supabase/queries'
import { ListingsView } from '@/components/listing/view'

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
  // Next.js 15+ requires await for searchParams
  const params = await searchParams
  
  const result = await listingsApi.getAll({
    search: params.search,
    categoryId: params.category,
    priceMin: params.priceMin ? parseInt(params.priceMin) : undefined,
    priceMax: params.priceMax ? parseInt(params.priceMax) : undefined,
    condition: params.condition as 'new' | 'used' | undefined,
    location: params.location,
    sort: params.sort,
  })

  return (
    <ListingsView
      listings={result.data || []}
      error={result.error}
      searchQuery={params.search}
    />
  )
}
