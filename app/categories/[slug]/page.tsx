import { notFound } from 'next/navigation'
import { ErrorState } from '@/components/ui/error-state'
import { CategoryView } from '@/components/category/CategoryView'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  // First get the category by slug
  const categoryRes = await categoriesApi.getBySlug(slug)

  if (categoryRes.error) {
    return <ErrorState message={categoryRes.error} />
  }

  if (!categoryRes.data) {
    notFound()
  }

  // Now get listings by category ID
  const listingsRes = await listingsApi.getAll({ categoryId: categoryRes.data.id, limit: 50 })

  return (
    <CategoryView
      category={categoryRes.data}
      listings={listingsRes.data || []}
      listingsError={listingsRes.error}
    />
  )
}
