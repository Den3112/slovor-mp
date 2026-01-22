'use client'

import Link from 'next/link'
import type { Category } from '@/lib/types/database'
import { useTranslation } from '@/lib/i18n'
import { CategoryIcon } from './category-icon'
import { getLocalizedCategoryName, getUniqueCategories } from '@/lib/utils/category-i18n'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const { t, locale } = useTranslation()

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
              href={`/categories/${category.slug}`}
              className="hover:shadow-premium group/card relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-border/50 bg-card p-10 shadow-sm transition-all duration-500 hover:border-primary/50"
            >
              {/* Decorative Pattern */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-transform duration-700 group-hover/card:scale-150" />

              <div className="absolute right-6 top-6 opacity-0 transition-opacity group-hover/card:opacity-100">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>

              <div className="mb-6 rounded-3xl bg-muted/50 p-6 transition-all duration-500 group-hover/card:rotate-6 group-hover/card:scale-110 group-hover/card:bg-primary group-hover/card:text-primary-foreground">
                <CategoryIcon slug={category.slug} className="h-12 w-12" />
              </div>

              <h3 className="text-center text-xl font-black tracking-tight text-foreground transition-colors group-hover/card:text-primary">
                {getLocalizedCategoryName(category, locale, t)}
              </h3>

              {category.listing_count !== undefined && (
                <span className="mt-3 rounded-full bg-muted/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all group-hover/card:bg-primary/10 group-hover/card:text-primary">
                  {category.listing_count} {t.common.listings}
                </span>
              )}
            </Link>

            {/* Subcategories Premium Mini-List */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4">
                {category.subcategories.slice(0, 4).map((sub: Category) => (
                  <Link
                    key={sub.id}
                    href={`/categories/${sub.slug}`}
                    className="rounded-xl border border-border/50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
                  >
                    {getLocalizedCategoryName(sub, locale, t)}
                  </Link>
                ))}
                {category.subcategories.length > 4 && (
                  <Link
                    href={`/categories/${category.slug}`}
                    className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
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
