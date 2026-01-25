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
  const { t, locale } = useTranslation()

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
            <span className="text-primary mb-3 block text-[9px] font-black tracking-[0.2em] uppercase md:mb-4 md:text-[10px] md:tracking-[0.3em]">
              {t.common.exploreMarketplace}
            </span>
            <h2 className="font-heading mb-4 text-3xl leading-none font-black tracking-tighter italic sm:text-4xl md:mb-6 md:text-5xl lg:text-7xl">
              {t.home.categoriesTitle}
            </h2>
            <p className="text-muted-foreground max-w-md text-base font-medium opacity-70 md:max-w-lg md:text-xl">
              {t.home.categories.subtitle}
            </p>
          </div>
          <Link
            href="/categories"
            className="group border-border/50 bg-muted/50 text-foreground hover:border-primary/30 hover:text-primary inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-xs font-black tracking-widest uppercase transition-all md:gap-3 md:px-8 md:py-4 md:text-sm"
          >
            {t.common.viewAll}
            <ArrowRight className="text-primary h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:gap-8">
          {mainCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group border-border/40 bg-card/50 md:hover:border-primary/30 relative block aspect-square overflow-hidden rounded-2xl border shadow-sm backdrop-blur-sm transition-all duration-500 active:scale-[0.98] sm:rounded-[2rem] md:rounded-[2.5rem] md:hover:shadow-2xl"
              >
                <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-indigo-500/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:rounded-[2rem] md:rounded-[2.5rem]" />

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center md:p-8">
                  <div className="bg-muted/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-primary/30 md:group-hover:shadow-primary/40 mb-3 flex h-14 w-14 items-center justify-center rounded-xl shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:rotate-[10deg] group-hover:shadow-lg sm:h-16 sm:w-16 sm:rounded-2xl md:mb-6 md:h-20 md:w-20 md:rounded-3xl md:group-hover:scale-110 md:group-hover:rotate-[15deg] md:group-hover:shadow-xl">
                    <CategoryIcon
                      slug={category.slug}
                      className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
                    />
                  </div>
                  <h3 className="text-foreground group-hover:text-primary text-sm font-black tracking-tight transition-colors sm:text-base md:text-lg lg:text-xl">
                    {getLocalizedCategoryName(category, locale, t)}
                  </h3>
                  {category.listing_count !== undefined && (
                    <div className="bg-muted/50 group-hover:bg-primary/5 mt-2 rounded-full px-2.5 py-1 transition-colors md:mt-3 md:px-3">
                      <p className="text-muted-foreground group-hover:text-primary text-[9px] font-black tracking-[0.1em] uppercase md:text-[10px]">
                        {category.listing_count} {t.common.listings}
                      </p>
                    </div>
                  )}
                </div>

                {/* Decorative Element - Hidden on mobile */}
                <div className="bg-primary/5 group-hover:bg-primary/10 absolute -top-8 -left-8 hidden h-24 w-24 rounded-full blur-[30px] transition-colors duration-700 md:block md:h-32 md:w-32 md:blur-[40px]" />
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
