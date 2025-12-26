// Category Card Component
// Principle #1: Small component
// Principle #6: Use proper icons from Lucide

import Link from 'next/link'
import type { Category } from '@/lib/supabase/queries'
import * as LucideIcons from 'lucide-react'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Get Lucide icon by name
  const IconComponent = category.icon_name 
    ? (LucideIcons as Record<string, LucideIcons.LucideIcon>)[category.icon_name] || LucideIcons.Package
    : LucideIcons.Package

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <IconComponent className="w-6 h-6 text-blue-600" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          {category.listing_count !== undefined && (
            <p className="text-sm text-gray-600">
              {category.listing_count} listings
            </p>
          )}
        </div>

        {/* Arrow */}
        <LucideIcons.ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>
    </Link>
  )
}
