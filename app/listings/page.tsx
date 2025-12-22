import { ListingsView } from '@/components/listing/ListingsView'
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
  const params = await searchParams
  // Principle #3: One responsibility - centralized data fetching
  const result = await listingsApi.getAll({
    categorySlug: params.category,
    search: params.search,
    limit: 50,
  })

  return (
    <ListingsView
      listings={result.data || []}
      error={result.error}
      searchQuery={searchParams.search}
    />
  )
}
