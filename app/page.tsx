// Main homepage - Server Component

import { CategoryGrid } from '@/components/category/grid'
import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { SearchBar } from '@/components/ui/search-bar'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'
import Link from 'next/link'

export const revalidate = 60

export default async function HomePage() {
  const [categoriesRes, listingsRes] = await Promise.all([
    categoriesApi.getAll(),
    listingsApi.getFeatured(6),
  ])

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Find Everything You Need
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Buy and sell electronics, vehicles, real estate, and more
            </p>
          </div>
          <SearchBar />
          <div className="text-center mt-6">
            <p className="text-blue-100">Popular: Electronics, Vehicles, Real Estate, Jobs</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse Categories</h2>
            <p className="text-gray-600 mt-2">Find what you're looking for</p>
          </div>
          <Link 
            href="/listings" 
            className="hidden md:block text-blue-600 hover:text-blue-700 font-semibold text-lg"
          >
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
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Listings</h2>
            <p className="text-gray-600 mt-2">Hand-picked deals just for you</p>
          </div>
          <Link 
            href="/listings" 
            className="hidden md:block text-blue-600 hover:text-blue-700 font-semibold text-lg"
          >
            View All →
          </Link>
        </div>
        {listingsRes.error ? (
          <ErrorState message={listingsRes.error} />
        ) : (
          <ListingGrid listings={listingsRes.data} featured />
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Post your ad and reach thousands of potential buyers
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
            Post Your Ad Now
          </button>
        </div>
      </section>
    </div>
  )
}
