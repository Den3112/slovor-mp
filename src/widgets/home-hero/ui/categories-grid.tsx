'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import { Container } from '@/shared/ui/container'
import { CategoryIcon } from '@/entities/category'
import { useTranslation } from '@/shared/lib/i18n'
import type { Category } from '@/shared/lib/types/database'
import { getLocalizedCategoryName } from '@/shared/lib/utils/category-i18n'

interface CategoriesGridProps {
  categories: Category[]
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  const { t, i18n } = useTranslation(['home', 'common'])
  const locale = i18n.language

  // Top 10 main categories
  const mainCategories = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .slice(0, 9)

  return (
    <section className="bg-background py-16 md:py-24">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-heading mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              {t('home:categoriesGrid')}
            </h2>
            <p className="text-muted-foreground text-lg font-medium opacity-70">
              {t('home:categoriesSubtitle')}
            </p>
          </div>
          <Link
            href={`/${locale}/categories`}
            className="group text-primary inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-all hover:opacity-80"
          >
            {t('common:viewAll')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {mainCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <Link
                href={`/${locale}/categories/${category.slug}`}
                prefetch={true}
                className="card-pro group border-border/40 relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-4xl p-6 text-center shadow-lg sm:p-8 md:p-10"
              >
                {/* Hover Glow */}
                <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <CategoryIcon
                    slug={category.slug}
                    className="ease-out-expo h-10 w-10 transition-transform duration-500 group-hover:scale-125 sm:h-12 sm:w-12 md:h-14 md:w-14"
                  />
                </div>

                <div className="relative z-10 space-y-2">
                  <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-xs font-bold tracking-widest uppercase transition-colors sm:text-sm">
                    {getLocalizedCategoryName(category, locale, t)}
                  </h3>
                  <div className="flex items-center justify-center">
                    <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                      {category.listing_count || 0} {t('common:ads', 'Ads')}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* "View All" Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href={`/${locale}/categories`}
              className="card-pro group border-primary/20 bg-primary/5 relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-4xl p-6 text-center shadow-lg transition-all active:scale-[0.98] sm:p-8 md:p-10"
            >
              <div className="bg-primary/90 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="bg-primary group-hover:text-primary relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl transition-all duration-500 group-hover:bg-white sm:h-20 sm:w-20">
                <LayoutGrid className="h-8 w-8 transition-transform duration-500 group-hover:rotate-12 sm:h-10 sm:w-10" />
              </div>
              <div className="relative z-10 space-y-2 px-1">
                <h3 className="line-clamp-1 text-xs font-bold tracking-widest uppercase transition-colors group-hover:text-white sm:text-sm">
                  {t('common:viewAll')}
                </h3>
                <p className="text-primary/60 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors group-hover:text-white/80">
                  +20 {t('home:categoriesGrid')}
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
