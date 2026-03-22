'use client'

import Link from 'next/link'
import type { Category } from '@/lib/types/database'
import { useTranslation } from '@/lib/i18n'
import { CategoryIcon } from './category-icon'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface CategoryCardProps {
  category: Category
  idx?: number
}

/**
 * Premium Category Card Component
 * Features: Soft Tints, Glassmorphism, Smooth Micro-animations
 */
export function CategoryCard({ category, idx = 0 }: CategoryCardProps) {
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language

  const name = getLocalizedCategoryName(category, locale, t)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.5, ease: 'easeOut' }}
      className="group h-full"
    >
      <Link
        href={`/${locale}/categories/${category.slug}`}
        className="hover:shadow-primary/5 group/card border-border/40 bg-card hover:border-primary/40 relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
      >
        {/* Dynamic Glow Background */}
        <div className="bg-primary/5 absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl transition-transform duration-1000 group-hover/card:scale-150" />
        <div className="bg-primary/5 absolute -bottom-12 -left-12 h-40 w-40 rounded-full blur-3xl transition-transform duration-1000 group-hover/card:scale-150" />

        {/* Hover Action Indicator */}
        <div className="bg-primary/10 absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full opacity-0 blur-sm transition-all duration-500 group-hover/card:opacity-100 group-hover/card:blur-0">
          <ArrowUpRight className="text-primary h-5 w-5" />
        </div>

        {/* Icon with Animation */}
        <div className="relative mb-6 transition-all duration-500 group-hover/card:scale-110 group-hover/card:rotate-3">
          <CategoryIcon
            slug={category.slug}
            iconName={category.icon_name}
            size="lg"
            className="shadow-primary/10 shadow-lg"
          />
        </div>

        {/* Category Name */}
        <h3 className="text-foreground group-hover/card:text-primary z-10 text-center text-xl font-black tracking-tight transition-colors duration-300">
          {name}
        </h3>

        {/* Listing Count Badge */}
        {(category.listing_count !== undefined ||
          category.listings_count !== undefined) && (
          <div className="bg-muted/40 text-muted-foreground group-hover/card:bg-primary/10 group-hover/card:text-primary z-10 mt-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300">
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
            {t('common:listings', {
              count: category.listing_count ?? category.listings_count ?? 0,
            })}
          </div>
        )}

        {/* Bottom Decorative Bar */}
        <div className="bg-primary absolute inset-x-0 bottom-0 h-1 translate-y-full transition-transform duration-500 group-hover/card:translate-y-0" />
      </Link>
    </motion.div>
  )
}
