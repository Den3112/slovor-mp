// Category page - Server Component
// Shows category details and filtered listings

import { notFound } from 'next/navigation'
import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const page = Number(searchParams.page) || 1

  // Parallel data fetching (Principle #5)
  const [categoryRes, listingsRes] = await Promise.all([
    categoriesApi.getBySlug(params.slug),
    listingsApi.getAll({ category: params.slug, limit: 12 }),
  ])

  // Handle errors (Principle #5)
  if (categoryRes.error) {
    return <ErrorState message={categoryRes.error} />
  }

  if (!categoryRes.data) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{categoryRes.data.name}</h1>
        <p className="text-gray-600">
          {categoryRes.data.listing_count || 0} listings
        </p>
      </div>

      {listingsRes.error ? (
        <ErrorState message={listingsRes.error} />
      ) : (
        <ListingGrid listings={listingsRes.data} />
      )}
    </div>
  )
}
