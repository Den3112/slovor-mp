// Main homepage - Server Component
// Server Component with explicit data fetching (Principle #4, #5)

import { CategoryGrid } from '@/components/category/grid'
import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'
import Link from 'next/link'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  // Parallel data fetching (Principle #5: Graceful Error Handling)
  const [categoriesRes, listingsRes] = await Promise.all([
    categoriesApi.getAll(),
    listingsApi.getFeatured(6),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Link href="/categories" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        {categoriesRes.error ? (
          <ErrorState message={categoriesRes.error} />
        ) : (
          <CategoryGrid categories={categoriesRes.data} />
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Listings</h2>
          <Link href="/listings" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        {listingsRes.error ? (
          <ErrorState message={listingsRes.error} />
        ) : (
          <ListingGrid listings={listingsRes.data} />
        )}
      </section>
    </div>
  )
}
