// HomePage - Main landing page displaying categories and featured listings
// Route: / (root)
// Related: HomeView (client component), categoriesApi
// Principle #2: Server Component with explicit data fetching
// Principle #4: No magic - clear data flow from API to component

import { HomeView } from '@/components/home/home-view'
import { FeaturedListings } from '@/components/listing/featured'
import { createClient } from '@/lib/supabase/server'

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
  console.log('>>> RENDER HOMEPAGE <<<');
  const supabase = await createClient()
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')

  return (
    <HomeView
      categories={categories || []}
      categoriesError={error?.message || null}
    >
      <FeaturedListings />
    </HomeView>
  )
}
