'use client'

import { ListingCard } from './card'
import { ListingFilters } from './filters'
import type { Listing } from '@/lib/api'
import { Container } from '@/components/ui/container'
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'

interface Props {
  listings: Listing[]
  error: string | null
  searchQuery?: string
}

export function ListingsView({ listings, error, searchQuery }: Props) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative mb-12 overflow-hidden border-b border-border/50 bg-card/30 pb-12 pt-24 md:pb-20 md:pt-40">
        {/* Decorative Orbs */}
        <div className="absolute right-0 top-0 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-500/5 blur-[100px]" />

        <Container>
          <div className="relative z-10 flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
              <Search className="h-3.5 w-3.5" />
              Explorer
            </div>
            <h1 className="font-heading text-5xl font-black uppercase italic tracking-tighter text-foreground md:text-7xl">
              {searchQuery
                ? `${t.common.search}: ${searchQuery}`
                : t.common.allListings}
            </h1>
            <p className="flex items-center gap-3 text-xl font-medium text-muted-foreground">
              <span className="font-black text-foreground">
                {listings.length}
              </span>
              {listings.length === 1
                ? t.common.listings.slice(0, -1)
                : t.common.listings}{' '}
              {t.common.found}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Filters Sidebar */}
          <aside className="space-y-8 lg:col-span-3">
            <div className="sticky top-28">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-black italic tracking-tight">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  {t.filters.title}
                </h2>
              </div>
              <div className="shadow-premium rounded-[2rem] border border-border bg-card p-6">
                <ListingFilters />
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-[2.5rem] border border-destructive/10 bg-destructive/5 p-12 text-center text-destructive"
                >
                  <p className="mb-2 text-xl font-black italic">
                    Error Loading Marketplace
                  </p>
                  <p className="font-medium opacity-70">{error}</p>
                </motion.div>
              ) : listings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-border/60 bg-muted/20 p-8 py-32 text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
                    <PackageSearch className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="mb-3 font-heading text-2xl font-black italic text-foreground">
                    {t.common.noResults}
                  </p>
                  <p className="max-w-sm font-medium text-muted-foreground">
                    {t.common.tryDifferentFilters}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
                >
                  {listings.map((listing, idx) => (
                    <motion.div
                      key={listing.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ListingCard listing={listing} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </Container>
    </div>
  )
}
