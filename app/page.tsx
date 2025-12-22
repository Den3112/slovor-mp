// Main homepage - Server Component

import { HomeView } from '@/components/home/HomeView'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'

export const revalidate = 60

export default async function HomePage() {
  const [categoriesRes, listingsRes] = await Promise.all([
    categoriesApi.getAll(),
    listingsApi.getFeatured(6),
  ])

  return (
    <HomeView
      categories={categoriesRes.data || []}
      categoriesError={categoriesRes.error}
      featuredListings={listingsRes.data || []}
      featuredError={listingsRes.error}
    />
  )
}
