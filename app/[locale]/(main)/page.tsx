// HomePage - Main landing page displaying categories and featured listings
// Route: / (root)
// Related: HomeView (client component), categoriesApi
// Principle #2: Server Component with explicit data fetching
// Principle #4: No magic - clear data flow from API to component

import { HomeView } from '@/components/home/home-view'
import { FeaturedListings } from '@/components/listing/featured'
import { RecentListings } from '@/components/listing/recent'
import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import { categoriesApi } from '@/lib/api/categories'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<string, string> = {
    en: 'Slovor - Premium Marketplace in Slovakia',
    sk: 'Slovor - Prémiový bazár na Slovensku',
    cs: 'Slovor - Premiový bazar na Slovensku',
  }

  const descriptions: Record<string, string> = {
    en: 'Buy and sell electronics, real estate, cars and more. The most advanced marketplace for Slovakia.',
    sk: 'Kupujte a predávajte elektroniku, nehnuteľnosti, autá a viac. Najmodernejší bazár na Slovensku.',
    cs: 'Kupujte a prodávejte elektroniku, nemovitosti, auta a více. Nejmodernější bazar na Slovensku.',
  }

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      type: 'website',
      siteName: 'Slovor',
    },
  }
}

/**
 * Incremental Static Regeneration (ISR)
 * Rebuilds this page every 60 seconds when accessed
 */
export const revalidate = 60

/**
 * Main homepage Server Component
 * Fetches categories with listing counts
 * Passes data to HomeView client component for rendering
 */
export default async function HomePage() {
  const supabase = await createClient()
  const { data: categories, error } = await categoriesApi.getAll(supabase)

  return (
    <HomeView
      categories={categories || []}
      categoriesError={error || null}
      recentListings={<RecentListings />}
    >
      <FeaturedListings />
    </HomeView>
  )
}
