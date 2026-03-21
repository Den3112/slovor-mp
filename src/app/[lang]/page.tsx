import { HomeView } from '@/components/home/home-view'
import { listingsApi, categoriesApi } from '@/lib/api'
import type { Listing, Category } from '@/lib/types/database'

export const revalidate = 3600 // Revalidate home page every hour

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang = 'sk' } = await params
  console.log(`[Page] Rendering Home for lang: ${lang}`)

  let featuredListings: Listing[] = []
  let recentListings: Listing[] = []
  let categories: Category[] = []

  try {
    // Fetch data for the home page sections
    const [featuredResult, recentResult, categoriesResult] = await Promise.all([
      listingsApi.getAll({ limit: 4, isFeatured: true }),
      listingsApi.getAll({ limit: 8 }),
      categoriesApi.getAll(),
    ])

    featuredListings = featuredResult.data || []
    recentListings = recentResult.data || []
    categories = categoriesResult.data || []

    if (categoriesResult.error) {
      console.error('[Page] Error fetching categories:', categoriesResult.error)
    }
  } catch (error) {
    console.error('[Page] Fatal error fetching data for home page:', error)
  }

  return (
    <HomeView
      categories={categories}
      recentListings={recentListings}
      featuredListings={featuredListings}
      lang={lang}
    />
  )
}
