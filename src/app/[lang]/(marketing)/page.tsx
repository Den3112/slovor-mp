import { HomeView } from '@/widgets/home-hero'
import { listingsApi, categoriesApi } from '@/shared/lib/api'
import { createClient } from '@/shared/lib/supabase/server'

export const revalidate = 3600

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang = 'sk' } = await params
  const supabase = await createClient()

  const [featuredResult, recentResult, categoriesResult] = await Promise.all([
    listingsApi.getAll(supabase, { limit: 4, isFeatured: true }),
    listingsApi.getAll(supabase, { limit: 8 }),
    categoriesApi.getAll(supabase),
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
