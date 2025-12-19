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
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Buy & Sell Anything
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Discover great deals on electronics, vehicles, real estate and more
        </p>
        <Link 
          href="/listings" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse All Listings
        </Link>
      </section>

      {/* Categories */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
          <Link href="/listings" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        {categoriesRes.error ? (
          <ErrorState message={categoriesRes.error} />
        ) : (
          <CategoryGrid categories={categoriesRes.data} />
        )}
      </section>

      {/* Featured Listings */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
          <Link href="/listings" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
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
