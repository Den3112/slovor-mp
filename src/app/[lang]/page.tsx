import { HomeView } from '@/components/home/home-view'
import { listingsApi, categoriesApi } from '@/lib/api'

export const revalidate = 3600

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang = 'sk' } = await params

  const [featuredResult, recentResult, categoriesResult] = await Promise.all([
    listingsApi.getAll({ limit: 4, isFeatured: true }),
    listingsApi.getAll({ limit: 8 }),
    categoriesApi.getAll(),
  ])

  return (
    <HomeView
      categories={categoriesResult.data || []}
      recentListings={recentResult.data || []}
      featuredListings={featuredResult.data || []}
      lang={lang}
    />
  )
}
