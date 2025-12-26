'use client'

// CategoryShowcase - Displays featured categories grid on homepage
// Used in: HomePage
// Principle #1: Small, focused component
// Principle #2: Receives data via props

import Link from 'next/link'
import { getCategoryIcon } from '@/lib/constants/category-icons'
import type { Category } from '@/lib/supabase/queries'

interface Props {
  categories: Category[]
}

export function CategoryShowcase({ categories }: Props) {
  const featured = categories.slice(0, 8)

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Explore Categories</h2>
          <p className="text-gray-600 mt-2">Browse through our popular categories</p>
        </div>
        <Link
          href="/categories"
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {featured.map((category) => {
          const IconComponent = getCategoryIcon(category.slug)

          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                {category.listing_count !== undefined && (
                  <p className="text-sm text-gray-500 mt-1">
                    {category.listing_count} ads
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
