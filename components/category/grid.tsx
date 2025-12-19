// Category Grid - Display all categories in a grid
// Server Component (no state)

import Link from 'next/link'
import type { Category } from '@/lib/types/database'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="flex flex-col items-center p-6 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
        >
          <span className="text-4xl mb-2">{category.icon}</span>
          <span className="text-sm font-medium text-center">
            {category.name_sk}
          </span>
          {category.listings_count !== undefined && (
            <span className="text-xs text-gray-500 mt-1">
              {category.listings_count} ads
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
