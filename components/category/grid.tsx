'use client'

import Link from 'next/link'
import type { Category } from '@/lib/types/database'
import { useTranslation } from '@/lib/i18n'
import { CategoryIcon } from './category-icon'
import {
  getUniqueCategories,
  getLocalizedCategoryName,
} from '@/lib/utils/category-i18n'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language

  // Use the shared helper for consistency
  const uniqueCategories = getUniqueCategories(categories, locale, t)

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {uniqueCategories.map((category, idx) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <div className="group flex h-full flex-col gap-4">
            <Link
              href={`/${locale}/categories/${category.slug}`}
              className="hover:shadow-premium group/card border-border/50 bg-card hover:border-primary/50 relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border p-10 shadow-sm transition-all duration-500"
            >
              {/* Decorative Pattern */}
              <div className="bg-primary/5 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl transition-transform duration-700 group-hover/card:scale-150" />

              <div className="absolute top-6 right-6 opacity-0 transition-opacity group-hover/card:opacity-100">
                <ArrowUpRight className="text-primary h-5 w-5" />
              </div>

              {category.icon_name && (
                <div className="bg-muted/50 group-hover/card:bg-primary group-hover/card:text-primary-foreground mb-6 rounded-2xl p-6 transition-all duration-500 group-hover/card:scale-110 group-hover/card:rotate-6">
                  <CategoryIcon slug={category.slug} className="h-12 w-12" />
                </div>
              )}

              <h3 className="text-foreground group-hover/card:text-primary text-center text-xl font-bold tracking-tight transition-colors">
                {getLocalizedCategoryName(category, locale, t)}
              </h3>

              {category.listing_count !== undefined && (
                <span className="bg-muted/50 text-muted-foreground group-hover/card:bg-primary/10 group-hover/card:text-primary mt-3 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all">
                  {category.listing_count} {t('common:listings')}
                </span>
              )}
            </Link>

            {/* Subcategories Premium Mini-List */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4">
                {category.subcategories.slice(0, 4).map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/${locale}/categories/${sub.slug}`}
                    className="border-border/50 text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-lg border px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all"
                  >
                    {getLocalizedCategoryName(sub, locale, t)}
                  </Link>
                ))}
                {category.subcategories.length > 4 && (
                  <Link
                    href={`/${locale}/categories/${category.slug}`}
                    className="text-primary px-2 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:underline"
                  >
                    +{category.subcategories.length - 4} More
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
