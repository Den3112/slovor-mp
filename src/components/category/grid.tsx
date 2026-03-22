'use client'

import type { Category } from '@/lib/types/database'
import { useTranslation } from '@/lib/i18n'
import { CategoryCard } from './category-card'
import { getUniqueCategories } from '@/lib/utils/category-i18n'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language

  // Use the shared helper for consistency
  const uniqueCategories = getUniqueCategories(categories, locale, t)

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {uniqueCategories.map((category, idx) => (
        <CategoryCard key={category.id} category={category} idx={idx} />
      ))}
    </div>
  )
}
