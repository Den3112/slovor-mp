// Home Page
// Server Component with explicit data fetching (Principle #4, #5)

import { CategoryGrid } from '@/components/category/grid'
import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'
import Link from 'next/link'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  // Fetch data in parallel (Principle #1: Minimize code)
  const [categoriesRes, featuredRes] = await Promise.all([
    categoriesApi.getAll(),
    listingsApi.getFeatured(6),
  ])

  // Handle errors explicitly (Principle #5)
  if (categoriesRes.error) {
    return <ErrorState error={categoriesRes.error} />
  }
  if (featuredRes.error) {
    return <ErrorState error={featuredRes.error} />
  }

  const categories = categoriesRes.data
  const featured = featuredRes.data

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Find anything in Slovakia
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Buy and sell with confidence
        </p>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Browse Categories</h2>
        <CategoryGrid categories={categories} />
      </div>

      {/* Featured Listings */}
      {featured.length > 0 && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
            <Link
              href="/listings"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </div>
          <ListingGrid listings={featured} />
        </div>
      )}
    </div>
  )
}
