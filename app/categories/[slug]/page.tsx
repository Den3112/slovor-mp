import { notFound } from 'next/navigation'
import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [categoryRes, listingsRes] = await Promise.all([
    categoriesApi.getBySlug(params.slug),
    listingsApi.getAll({ category: params.slug, limit: 50 }),
  ])

  if (categoryRes.error) {
    return <ErrorState message={categoryRes.error} />
  }

  if (!categoryRes.data) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Categories', href: '/listings' },
          { label: categoryRes.data.name },
        ]}
      />

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {categoryRes.data.icon && (
            <span className="text-5xl">{categoryRes.data.icon}</span>
          )}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{categoryRes.data.name}</h1>
            <p className="text-gray-600 mt-2">
              {listingsRes.data?.length || 0} listings available
            </p>
          </div>
        </div>
      </div>

      {listingsRes.error ? (
        <ErrorState message={listingsRes.error} />
      ) : (
        <ListingGrid listings={listingsRes.data} />
      )}
    </div>
  )
}
