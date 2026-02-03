'use client'

import { Hero } from './hero'
import { HomeCategories } from './home-categories'
import { Features } from './features'
import { HomeCTA } from './home-cta'
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
  const { t } = useTranslation(['home', 'common'])

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Hero />

      {!categoriesError ? (
        <HomeCategories categories={categories} />
      ) : (
        <Container className="py-20">
          <div className="border-destructive/10 bg-destructive/5 text-destructive rounded-xl border p-12 text-center font-bold">
            {categoriesError}
          </div>
        </Container>
      )}

      {/* Featured Listings Section */}
      <section className="border-border/40 bg-muted/20 border-y py-24">
        <Container>
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-1 text-[10px] font-black tracking-widest text-orange-600 uppercase">
                <Flame className="h-3.5 w-3.5 fill-orange-600/20" />
                Trending Now
              </span>
              <h2 className="font-heading mb-4 text-4xl font-black tracking-tight italic md:text-5xl">
                {t('featuredListings')}
              </h2>
              <p className="text-muted-foreground text-lg font-medium">
                Hand-picked selection of premium items recently published.
              </p>
            </div>
            <Link
              href={`/${useTranslation('common').i18n.language}/listings`}
              className="group text-primary hover:text-primary/80 inline-flex items-center gap-2 text-lg font-bold transition-colors"
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
