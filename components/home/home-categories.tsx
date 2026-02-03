'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { CategoryIcon } from '@/components/category/category-icon'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'

interface HomeCategoriesProps {
  categories: Category[]
}

export function HomeCategories({ categories }: HomeCategoriesProps) {
  const { t, i18n } = useTranslation(['home', 'common'])
  const locale = i18n.language

  // Take top 8 main categories
  const mainCategories = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .slice(0, 8)

  return (
    <section className="bg-card/10 py-12 md:py-20 lg:py-24">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-4 md:mb-16 md:flex-row md:items-end md:gap-8 lg:mb-20">
          <div className="max-w-2xl">
            <span className="text-primary mb-3 block text-3xs font-black tracking-widest uppercase md:mb-4 md:text-2xs">
              {t('common:exploreMarketplace')}
            </span>
            <h2 className="font-heading mb-4 text-3xl leading-none font-black tracking-tighter italic sm:text-4xl md:mb-6 md:text-5xl lg:text-7xl">
              {t('categoriesTitle')}
            </h2>
            <p className="text-muted-foreground max-w-md text-base font-medium opacity-70 md:max-w-lg md:text-xl">
              {t('categoriesSubtitle')}
            </p>
          </div>
          <Link
            href="/categories"
            className="group border-border/50 bg-muted/50 text-foreground hover:border-primary/30 hover:text-primary inline-flex w-fit items-center gap-2 rounded-xl border px-5 py-3 text-xs font-black tracking-widest uppercase transition-all md:gap-3 md:px-8 md:py-4 md:text-sm"
          >
            {t('common:viewAll')}
            <ArrowRight className="text-primary h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {mainCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary/50 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <CategoryIcon
                    slug={category.slug}
                    className="h-6 w-6"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold tracking-tight text-sm">
                    {getLocalizedCategoryName(category, locale, t)}
                  </h3>
                  {category.listing_count !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      {category.listing_count} {t('common:listings')}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
