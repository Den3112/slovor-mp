'use client'
// Category grid component
// Display categories as clickable cards

import Link from 'next/link'
import type { Category } from '@/lib/types/database'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No categories available
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <span className="text-4xl mb-2">{category.icon || '📦'}</span>
          <span className="text-sm font-medium text-gray-900 text-center">
            {category.name}
          </span>
          {category.listings_count !== undefined && (
            <span className="text-xs text-gray-500 mt-1">
              {category.listings_count} listings
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
