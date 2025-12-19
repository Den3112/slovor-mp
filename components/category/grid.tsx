import Link from 'next/link'
import type { Category } from '@/lib/supabase/queries'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 hover:border-blue-500 hover:shadow-md transition-all"
        >
          {category.icon && (
            <div className="mb-3 text-3xl">{category.icon}</div>
          )}
          <h3 className="text-center text-sm font-medium text-gray-900 group-hover:text-blue-600">
            {category.name}
          </h3>
          {category.listing_count !== undefined && (
            <p className="mt-1 text-xs text-gray-500">
              {category.listing_count} listings
            </p>
          )}
        </Link>
      ))}
    </div>
  )
}
