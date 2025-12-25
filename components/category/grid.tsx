'use client'

import Link from 'next/link'
import type { Category } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n'
import { CategoryIcon } from './CategoryIcon'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const { t, locale } = useTranslation()

  const getCategoryName = (cat: Category) => {
    if (locale === 'sk') return cat.name_sk || cat.name
    if (locale === 'cs') return cat.name_cs || cat.name
    if (locale === 'en') return cat.name_en || cat.name
    return (t.categories as Record<string, string>)[cat.slug] || cat.name
  }

  // Deduplicate categories by localized name to prevent "Clothing" and "Móda" appearing together
  // while keeping the ones that have subcategories if possible.
  const uniqueCategories = categories.reduce((acc: Category[], current) => {
    const currentName = getCategoryName(current).toLowerCase()
    const isDuplicate = acc.find(item => getCategoryName(item).toLowerCase() === currentName)

    if (!isDuplicate) {
      acc.push(current)
    } else if (!isDuplicate.subcategories?.length && current.subcategories?.length) {
      // If current is "better" (has subcategories), replace the existing one
      const index = acc.findIndex(item => getCategoryName(item).toLowerCase() === currentName)
      acc[index] = current
    }
    return acc
  }, [])

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {uniqueCategories.map((category) => (
        <div key={category.id} className="flex flex-col gap-4 group h-full">
          <Link
            href={`/categories/${category.slug}`}
            className="relative flex flex-col items-center justify-center rounded-[2.5rem] bg-white border border-gray-100 p-10 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 overflow-hidden h-full"
          >
            {/* Background Decorative Element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

            {category.icon && (
              <div className="mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                <CategoryIcon slug={category.slug} className="w-16 h-16 text-blue-600" />
              </div>
            )}

            <h3 className="text-center text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {getCategoryName(category)}
            </h3>

            {category.listing_count !== undefined && (
              <span className="px-4 py-1.5 bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                {category.listing_count} {t.common.listings}
              </span>
            )}
          </Link>

          {/* Subcategories Premium Mini-List */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4">
              {category.subcategories.slice(0, 4).map(sub => (
                <Link
                  key={sub.id}
                  href={`/categories/${sub.slug}`}
                  className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-gray-100 transition-all"
                >
                  {getCategoryName(sub)}
                </Link>
              ))}
              {category.subcategories.length > 4 && (
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:underline px-2 py-1.5"
                >
                  +{category.subcategories.length - 4} More
                </Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
