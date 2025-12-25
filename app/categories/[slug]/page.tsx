import { notFound } from 'next/navigation'
import { ErrorState } from '@/components/ui/error-state'
import { CategoryView } from '@/components/category/CategoryView'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'

/**
 * ISR for category pages
 * 
 * WHY 120 SECONDS (2 minutes):
 * - Categories change less frequently than listings
 * - Longer cache time = better performance
 * - Still fresh enough for most use cases
 */
export const revalidate = 120

/**
 * Static Params Generation
 * 
 * WHAT IT DOES:
 * - Pre-renders all category pages at build time
 * - Generates /categories/electronics, /categories/fashion, etc.
 * - Improves SEO (pages indexed faster)
 * - Better Core Web Vitals scores
 * 
 * HOW IT WORKS:
 * 1. At build time, fetches all categories from DB
 * 2. Creates static HTML for each category
 * 3. Combined with ISR, updates every 120 seconds
 */
export async function generateStaticParams() {
  const categoriesRes = await categoriesApi.getAll()
  
  if (!categoriesRes.data) {
    return []
  }
  
  return categoriesRes.data.map((category) => ({
    slug: category.slug,
  }))
}

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    sort?: string
    priceMin?: string
    priceMax?: string
    location?: string
    page?: string
  }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])

  // Pagination settings
  const ITEMS_PER_PAGE = 20
  const currentPage = Number(query.page) || 1
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  // First get the category by slug
  const categoryRes = await categoriesApi.getBySlug(slug)

  if (categoryRes.error) {
    return <ErrorState message={categoryRes.error} />
  }

  if (!categoryRes.data) {
    notFound()
  }

  // Build filter options
  const filterOptions = {
    categoryId: categoryRes.data.id,
    sort: query.sort,
    priceMin: query.priceMin ? parseInt(query.priceMin) : undefined,
    priceMax: query.priceMax ? parseInt(query.priceMax) : undefined,
    location: query.location,
  }

  // Get listings with pagination
  const listingsRes = await listingsApi.getAll({
    ...filterOptions,
    limit: ITEMS_PER_PAGE,
    offset,
  })

  // Get total count for pagination
  const countRes = await listingsApi.getCount(filterOptions)

  return (
    <CategoryView
      category={categoryRes.data}
      listings={listingsRes.data || []}
      listingsError={listingsRes.error}
      totalCount={countRes.data || 0}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  )
}
