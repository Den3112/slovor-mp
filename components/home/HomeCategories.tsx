'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { CategoryIcon } from '@/components/category/CategoryIcon'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { getCategoryName } from '@/lib/utils/category-helpers'

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
    <section className="bg-card/10 py-24">
      <Container>
        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Explore Marketplace
            </span>
            <h2 className="mb-6 font-heading text-5xl font-black italic leading-none tracking-tighter md:text-7xl">
              {t.home.categoriesTitle}
            </h2>
            <p className="max-w-lg text-xl font-medium text-muted-foreground opacity-70">
              {t.home.categories.subtitle}
            </p>
          </div>
          <Link
            href="/categories"
            className="group flex items-center gap-3 rounded-full border border-border/50 bg-muted/50 px-8 py-4 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:border-primary/30 hover:text-primary"
          >
            {t.common.viewAll}
            <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {mainCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group relative block aspect-square overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/50 shadow-sm backdrop-blur-sm transition-all duration-700 hover:border-primary/30 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-indigo-500/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/40 shadow-sm transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-xl group-hover:shadow-primary/40">
                    <CategoryIcon slug={category.slug} className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-foreground transition-colors group-hover:text-primary md:text-xl">
                    {getCategoryName(category, locale, t)}
                  </h3>
                  {category.listing_count !== undefined && (
                    <div className="mt-3 rounded-full bg-muted/50 px-3 py-1 transition-colors group-hover:bg-primary/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground group-hover:text-primary">
                        {category.listing_count} {t.common.listings}
                      </p>
                    </div>
                  )}
                </div>

                {/* Modern Decorative Element */}
                <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-[40px] transition-colors duration-700 group-hover:bg-primary/10" />
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
