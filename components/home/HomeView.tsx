'use client'

import { Hero } from './Hero'
import { HomeCategories } from './HomeCategories'
import { Features } from './Features'
import { HomeCTA } from './HomeCTA'
import { Flame, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface HomeViewProps {
  categories: Category[]
  categoriesError: string | null
  children?: React.ReactNode
}

export function HomeView({
  categories,
  categoriesError,
  children,
}: HomeViewProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Hero />

      {!categoriesError ? (
        <HomeCategories categories={categories} />
      ) : (
        <Container className="py-20">
          <div className="rounded-[2rem] border border-destructive/10 bg-destructive/5 p-12 text-center font-bold text-destructive">
            {categoriesError}
          </div>
        </Container>
      )}

      {/* Featured Listings Section */}
      <section className="border-y border-border/40 bg-muted/20 py-24">
        <Container>
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600">
                <Flame className="h-3.5 w-3.5 fill-orange-600/20" />
                Trending Now
              </span>
              <h2 className="mb-4 font-heading text-4xl font-black italic tracking-tight md:text-5xl">
                {t.home.featuredListings}
              </h2>
              <p className="text-lg font-medium text-muted-foreground">
                Hand-picked selection of premium items recently published.
              </p>
            </div>
            <Link
              href="/listings"
              className="group inline-flex items-center gap-2 text-lg font-bold text-primary transition-colors hover:text-primary/80"
            >
              Explore All{' '}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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

      <Features />

      <HomeCTA />
    </div>
  )
}
