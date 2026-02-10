'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { CategoryIcon } from '@/components/category/category-icon'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

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
                className="group border-border bg-card hover:border-primary/40 shadow-card flex flex-col items-center justify-center gap-3 rounded-3xl border p-4 text-center transition-all hover:-translate-y-1 active:scale-[0.98] sm:p-6 md:p-8"
              >
                <div
                  className={cn(
                    'group-hover:bg-primary group-hover:text-primary-foreground ring-muted/30 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ring-4 transition-all duration-300 sm:h-20 sm:w-20',
                    category.color || 'bg-muted'
                  )}
                >
                  <CategoryIcon
                    slug={category.slug}
                    className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
                  />
                </div>
                <div className="space-y-1 px-1">
                  <h3 className="group-hover:text-primary line-clamp-1 text-[10px] font-bold tracking-tight uppercase transition-colors sm:text-xs">
                    {getLocalizedCategoryName(category, locale, t)}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className="bg-muted h-4 border-0 px-1.5 text-[10px] font-bold tracking-widest uppercase sm:h-5"
                    >
                      {category.listing_count || 0}
                    </Badge>
                    <span className="text-muted-foreground/40 hidden text-[9px] font-bold tracking-widest uppercase sm:inline">
                      Ads
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
              className="group border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 flex flex-col items-center justify-center gap-4 rounded-3xl border p-4 text-center transition-all hover:-translate-y-1 active:scale-[0.98] sm:p-6 md:p-8"
            >
              <div className="bg-primary shadow-primary/20 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg transition-all duration-300 sm:h-20 sm:w-20">
                <LayoutGrid className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <div className="space-y-1 px-1">
                <h3 className="text-primary line-clamp-1 text-[10px] font-bold tracking-tight uppercase sm:text-xs">
                  {t('common:viewAll')}
                </h3>
                <p className="text-primary/60 text-[9px] font-bold tracking-widest uppercase">
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
