// Home Page - Server Component
// Follows Principle #4: Server Components by default for data fetching
// Follows Principle #7: Avoid global state

import { CategoryGrid } from '@/components/category/grid'
import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { getMainCategories, getCategoriesWithCounts } from '@/lib/supabase/categories'
import { listingsApi } from '@/lib/supabase/queries'

export default async function HomePage() {
  console.log('[HomePage] Starting data fetch...')
  
  // Fetch categories with counts
  const categoriesResult = await getCategoriesWithCounts()
  console.log('[HomePage] Categories result:', categoriesResult)
  
  // Fetch featured listings
  const listingsResult = await listingsApi.getFeatured()
  console.log('[HomePage] Listings result:', listingsResult)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find Everything You Need
          </h1>
          <p className="text-xl mb-8">
            Buy and sell electronics, vehicles, real estate, and more
          </p>

          {/* Search Bar */}
          <form
            action="/listings"
            method="GET"
            className="max-w-2xl mx-auto"
          >
            <div className="flex gap-2">
              <input
                type="text"
                name="search"
                placeholder="Search for products, services..."
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm">
            Popular: Electronics, Vehicles, Real Estate, Jobs
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Browse Categories
            </h2>
            <a
              href="/listings"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </a>
          </div>

          {categoriesResult.error ? (
            <ErrorState message={categoriesResult.error} />
          ) : (
            <CategoryGrid categories={categoriesResult.data} />
          )}
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Listings
            </h2>
            <a
              href="/listings"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </a>
          </div>

          {listingsResult.error ? (
            <ErrorState message={listingsResult.error} />
          ) : (
            <ListingGrid listings={listingsResult.data} />
          )}
        </div>
      </section>
    </div>
  )
}
