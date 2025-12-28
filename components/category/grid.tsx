'use client'

import Link from 'next/link'
import type { Category } from '@/lib/types/database'
import { useTranslation } from '@/lib/i18n'
import { CategoryIcon } from './CategoryIcon'
import { getUniqueCategories, getCategoryName } from '@/lib/utils/category-helpers'
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
          <div className="flex flex-col gap-4 group h-full">
            <Link
              href={`/categories/${category.slug}`}
              className="relative flex flex-col items-center justify-center rounded-[2.5rem] bg-card border border-border/50 p-10 shadow-sm hover:shadow-premium hover:border-primary/50 transition-all duration-500 overflow-hidden h-full group/card"
            >
              {/* Decorative Pattern */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover/card:scale-150 transition-transform duration-700" />

              <div className="absolute top-6 right-6 opacity-0 group-hover/card:opacity-100 transition-opacity">
                <ArrowUpRight className="w-5 h-5 text-primary" />
              </div>

              {category.icon_name && (
                <div className="mb-6 bg-muted/50 p-6 rounded-3xl group-hover/card:bg-primary group-hover/card:text-primary-foreground group-hover/card:rotate-6 group-hover/card:scale-110 transition-all duration-500">
                  <CategoryIcon slug={category.slug} className="w-12 h-12" />
                </div>
              )}

              <h3 className="text-center text-xl font-black text-foreground group-hover/card:text-primary transition-colors tracking-tight">
                {getCategoryName(category, locale, t)}
              </h3>

              {category.listing_count !== undefined && (
                <span className="mt-3 px-4 py-1.5 bg-muted/50 text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-full group-hover/card:bg-primary/10 group-hover/card:text-primary transition-all">
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
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 px-3 py-1.5 rounded-xl border border-border/50 transition-all"
                  >
                    {getCategoryName(sub, locale, t)}
                  </Link>
                ))}
                {category.subcategories.length > 4 && (
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline px-2 py-1.5"
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
