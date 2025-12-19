// Category Page
// Server Component with dynamic route (Principle #4)

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

  // Fetch category and listings in parallel
  const [categoryRes, listingsRes] = await Promise.all([
    categoriesApi.getBySlug(params.slug),
    listingsApi.getAll(page, 12, { categoryId: params.slug }),
  ])

  // Handle errors (Principle #5)
  if (categoryRes.error) {
    if (categoryRes.error.message.includes('not found')) {
      notFound()
    }
    return <ErrorState error={categoryRes.error} />
  }
  if (listingsRes.error) {
    return <ErrorState error={listingsRes.error} />
  }

  const category = categoryRes.data
  const { items: listings, total } = listingsRes.data

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          {category.icon && <span className="text-5xl">{category.icon}</span>}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            {category.description && (
              <p className="mt-1 text-base text-gray-600">{category.description}</p>
            )}
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          {total} listing{total !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Listings */}
      <ListingGrid listings={listings} />
    </div>
  )
}
