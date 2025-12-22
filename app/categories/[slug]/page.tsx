import { notFound } from 'next/navigation'
import { ErrorState } from '@/components/ui/error-state'
import { CategoryView } from '@/components/category/CategoryView'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
    priceMin?: string
    priceMax?: string
    location?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])

  // First get the category by slug
  const categoryRes = await categoriesApi.getBySlug(slug)

  if (categoryRes.error) {
    return <ErrorState message={categoryRes.error} />
  }

  if (!categoryRes.data) {
    notFound()
  }

  // Now get listings by category ID, with filters
  const listingsRes = await listingsApi.getAll({
    categoryId: categoryRes.data.id,
    sort: query.sort,
    priceMin: query.priceMin ? parseInt(query.priceMin) : undefined,
    priceMax: query.priceMax ? parseInt(query.priceMax) : undefined,
    location: query.location,
    limit: 50
  })

  return (
    <CategoryView
      category={categoryRes.data}
      listings={listingsRes.data || []}
      listingsError={listingsRes.error}
    />
  )
}
