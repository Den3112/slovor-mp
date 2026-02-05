'use client'

import { Hero } from './hero'
import { CategoriesGrid } from './categories-grid'
import { RegionsSection } from './regions-section'
import { HowItWorks } from './how-it-works'
import { HomeCTA } from './home-cta'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface HomeViewProps {
  categories: Category[]
  categoriesError: string | null
  children?: React.ReactNode
  recentListings?: React.ReactNode
}

export function HomeView({
  categories,
  categoriesError,
  children,
  recentListings,
}: HomeViewProps) {
  const { t } = useTranslation(['home', 'common'])

  return (
    <div className="flex flex-col scroll-smooth">
      <Hero />

      {!categoriesError ? (
        <CategoriesGrid categories={categories} />
      ) : (
        <Container className="py-20">
          <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-2xl border p-12 text-center font-bold">
            {categoriesError}
          </div>
        </Container>
      )}

      <RegionsSection />

      {/* Featured Listings Section (VIP) */}
      <section className="bg-muted/10 border-y border-border/40 py-24">
        <Container>
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-8 lg:mb-20">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded bg-primary/10 px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-primary uppercase border border-primary/20">
                VIP / Featured
              </span>
              <h2 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {t('home:featuredListings')}
              </h2>
            </div>
            <Link
              href="/listings?isFeatured=true"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-all hover:opacity-80"
            >
              {t('common:viewAll')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {children}
          </motion.div>
        </Container>
      </section>

      {/* Recent Listings Section */}
      <section className="bg-background py-24">
        <Container>
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-8 lg:mb-20">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded bg-muted/40 px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase border border-border">
                {t('home:recent.badge') || 'Fresh Arrivals'}
              </span>
              <h2 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {t('home:recent.title') || 'Latest Listings'}
              </h2>
            </div>
            <Link
              href="/listings"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-all hover:opacity-80"
            >
              {t('common:viewAll')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {recentListings}
          </motion.div>
        </Container>
      </section>
      <HowItWorks />

      <HomeCTA />
    </div>
  )
}
