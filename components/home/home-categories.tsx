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
        <div className="mb-12 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end md:gap-12 lg:mb-24">
          <div className="max-w-2xl">
            <span className="mb-4 block font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-primary md:mb-6 md:text-[12px]">
              Explore Marketplace
            </span>
            <h2 className="mb-6 font-heading text-5xl font-bold leading-none tracking-tighter sm:text-6xl md:mb-8 md:text-7xl lg:text-8xl">
              {t.home.categoriesTitle}
            </h2>
            <p className="max-w-md font-sans text-lg font-medium text-muted-foreground md:max-w-lg md:text-xl">
              {t.home.categories.subtitle}
            </p>
          </div>
          <Link
            href="/categories"
            className="group inline-flex w-fit items-center gap-3 border-2 border-primary/20 bg-background px-6 py-4 font-sans text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:bg-primary/5 md:gap-4 md:px-10 md:py-6 md:text-sm"
          >
            {t.common.viewAll}
            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
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
                className="group relative block aspect-square overflow-hidden border-2 border-primary/10 bg-card/50 shadow-sm backdrop-blur-sm transition-all duration-500 active:scale-[0.98] md:hover:border-primary/40 md:hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center md:p-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center bg-muted/40 transition-all duration-500 group-hover:rotate-[5deg] group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-xl sm:h-16 sm:w-16 md:mb-8 md:h-24 md:w-24">
                    <CategoryIcon slug={category.slug} className="h-7 w-7 sm:h-8 sm:w-8 md:h-12 md:w-12" />
                  </div>
                  <h3 className="font-sans text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-base md:text-lg lg:text-2xl">
                    {getLocalizedCategoryName(category, locale, t)}
                  </h3>
                  {category.listing_count !== undefined && (
                    <div className="mt-2 border border-primary/10 bg-muted/50 px-2.5 py-1 transition-colors group-hover:border-primary/20 group-hover:bg-primary/5 md:mt-4 md:px-4 md:py-1.5">
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground group-hover:text-primary md:text-[11px]">
                        {category.listing_count} {t.common.listings}
                      </p>
                    </div>
                  )}
                </div>

                {/* Decorative Element - Hidden on mobile */}
                <div className="absolute -left-8 -top-8 hidden h-24 w-24 rounded-full bg-primary/5 blur-[30px] transition-colors duration-700 group-hover:bg-primary/10 md:block md:h-32 md:w-32 md:blur-[40px]" />
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
