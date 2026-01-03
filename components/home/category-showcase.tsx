'use client'

// CategoryShowcase - Displays featured categories grid on homepage
// Used in: HomePage
// Principle #1: Small, focused component
// Principle #2: Receives data via props

import Link from 'next/link'
import { getCategoryIcon } from '@/lib/constants/category-icons'
import type { Category } from '@/lib/api'

interface Props {
  categories: Category[]
}

export function CategoryShowcase({ categories }: Props) {
  const featured = categories.slice(0, 8)

  return (
    <section className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Explore Categories
          </h2>
          <p className="mt-2 text-gray-600">
            Browse through our popular categories
          </p>
        </div>
        <Link
          href="/categories"
          className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {featured.map((category) => {
          const IconComponent = getCategoryIcon(category.slug)

          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                  {category.name}
                </h3>
                {category.listing_count !== undefined && (
                  <p className="mt-1 text-sm text-gray-500">
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
