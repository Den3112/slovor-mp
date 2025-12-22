'use client'

import Link from 'next/link'
import type { Category } from '@/lib/types/database'
import { useTranslation } from '@/lib/i18n'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { t, locale } = useTranslation()

  const getCategoryName = (cat: Category) => {
    if (locale === 'sk') return cat.name_sk || cat.name
    if (locale === 'cs') return cat.name_cs || cat.name
    if (locale === 'en') return cat.name_en || cat.name
    return t.categories[cat.slug] || cat.name
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-500"
    >
      <div className="flex items-center gap-4">
        {category.icon && (
          <div className="text-4xl">{category.icon}</div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
            {getCategoryName(category)}
          </h3>
          {category.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
