import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ErrorState } from '@/shared/ui/error-state'
import { CategoryView } from '@/entities/category'
import { categoriesApi, listingsApi } from '@/shared/lib/api'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>
}): Promise<Metadata> {
  const { slug, lang } = await params
  if (process.env.SKIP_ENV_VALIDATION === '1') {
    return { title: 'Slovor Marketplace' }
  }
  const supabase = createStaticClient()
  const { data: category } = await categoriesApi.getBySlug(slug, supabase)

  if (!category) {
    return {
      title: 'Category Not Found | Slovor',
    }
  }

  const browseTexts: Record<string, string> = {
    en: 'View',
    sk: 'Zobraziť',
    cs: 'Zobrazit',
  }

  const findTexts: Record<string, string> = {
    en: 'Find the best deals in Slovakia.',
    sk: 'Nájdite najlepšie ponuky na Slovensku.',
    cs: 'Najděte nejlepší nabídky na Slovensku.',
  }

  const browse = browseTexts[lang] || browseTexts.en
  const find = findTexts[lang] || findTexts.en

  return {
    title: `${category.name} | Slovor Marketplace`,
    description: `${browse} ${category.name} on Slovor. ${find}`,
    openGraph: {
      title: `${category.name} | Slovor Marketplace`,
      description: `${browse} ${category.name} on Slovor. ${find}`,
      images: ['/og-image.png'],
    },
  }
}

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
import { createClient, createStaticClient } from '@/shared/lib/supabase/server'

export async function generateStaticParams() {
  if (process.env.SKIP_ENV_VALIDATION === '1') {
    return []
  }
  const supabase = createStaticClient()
  const categoriesRes = await categoriesApi.getAll(supabase)

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

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params
  const query = await searchParams

  if (process.env.SKIP_ENV_VALIDATION === '1') {
    return <div className="py-20 text-center">Building...</div>
  }

  const supabase = await createClient()

  // Pagination settings
  const ITEMS_PER_PAGE = 20
  const currentPage = Number(query.page) || 1
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  // First get the category by slug
  const categoryRes = await categoriesApi.getBySlug(slug, supabase)

  if (categoryRes.error) {
    return <ErrorState message={categoryRes.error} />
  }

  if (!categoryRes.data) {
    notFound()
  }

  // Build filter options
  const filterOptions = {
    categoryId: categoryRes.data?.id,
    sort: query.sort,
    priceMin: query.priceMin ? parseInt(query.priceMin) : undefined,
    priceMax: query.priceMax ? parseInt(query.priceMax) : undefined,
    location: query.location,
  }

  // Get listings with pagination
  const listingsRes = await listingsApi.getAll(
    {
      ...filterOptions,
      limit: ITEMS_PER_PAGE,
      offset,
    },
    supabase
  )

  // Get total count for pagination
  const countRes = await listingsApi.getCount(filterOptions, supabase)

  return (
    <Suspense
      fallback={
        <div className="animate-pulse py-20 text-center">
          Loading category...
        </div>
      }
    >
      <CategoryView
        category={categoryRes.data}
        listings={listingsRes.data || []}
        listingsError={listingsRes.error}
        totalCount={countRes.data || 0}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </Suspense>
  )
}
