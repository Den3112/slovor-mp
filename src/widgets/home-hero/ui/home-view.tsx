'use client'

import { Hero } from './hero'
import { CategoriesGrid } from './categories-grid'
import { RegionsSection } from './regions-section'
import { HowItWorks } from './how-it-works'
import { HomeCTA } from './home-cta'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/shared/ui/container'
import { useTranslation } from '@/shared/lib/i18n'
import type { Category, Listing } from '@/shared/lib/types/database'
import { ListingCard } from '@/entities/listing'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface HomeViewProps {
  categories: Category[]
  categoriesError?: string | null
  featuredListings?: Listing[]
  recentListings?: Listing[]
  lang?: string
}

export function HomeView({
  categories,
  categoriesError = null,
  featuredListings = [],
  recentListings = [],
}: HomeViewProps) {
  const { t, locale } = useTranslation(['home', 'common'])

  return (
    <div className="flex flex-col scroll-smooth">
      <Hero />

      {categoriesError ? (
        <Container className="py-20">
          <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-2xl border p-12 text-center font-bold">
            {categoriesError}
          </div>
        </Container>
      ) : categories.length === 0 ? (
        <Container className="py-20">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="animate-shimmer bg-muted/20 h-40 rounded-2xl"
              />
            ))}
          </div>
        </Container>
      ) : (
        <CategoriesGrid categories={categories} />
      )}

      <RegionsSection />

      {/* Featured Listings Section (VIP) */}
      <section className="bg-muted/10 border-border/40 border-y py-24">
        <Container>
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-8 lg:mb-20">
            <div className="max-w-2xl">
              <span className="badge-pill bg-primary/10 text-primary border-primary/20 mb-4">
                VIP / Featured
              </span>
              <h2 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {t('home:featuredListings')}
              </h2>
            </div>
            <Link
              href={`/${locale}/listings?isFeatured=true`}
              className="group text-primary inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-all hover:opacity-80"
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} featured />
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Recent Listings Section */}
      <section className="bg-background py-24">
        <Container>
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-8 lg:mb-20">
            <div className="max-w-2xl">
              <span className="badge-pill bg-muted/40 text-muted-foreground border-border mb-4">
                {t('home:recent.badge') || 'Fresh Arrivals'}
              </span>
              <h2 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {t('home:recent.title') || 'Latest Listings'}
              </h2>
            </div>
            <Link
              href={`/${locale}/listings`}
              className="group text-primary inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-all hover:opacity-80"
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </motion.div>
        </Container>
      </section>
      <HowItWorks />

      <HomeCTA />
    </div>
  )
}
