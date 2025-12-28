'use client'

import { ListingCard } from './card'
import { ListingFilters } from './filters'
import type { Listing } from '@/lib/supabase/queries'
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
      <div className="bg-card/30 border-b border-border/50 mb-12 py-12 md:py-20 overflow-hidden relative">
        {/* Decorative Orbs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <Container>
          <div className="flex flex-col gap-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase w-fit">
              <Search className="w-3.5 h-3.5" />
              Explorer
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground italic font-heading">
              {searchQuery ? `Search: ${searchQuery}` : t.common.allListings}
            </h1>
            <p className="text-xl font-medium text-muted-foreground flex items-center gap-3">
              <span className="text-foreground font-black">{listings.length}</span>
              {listings.length === 1 ? t.common.listings.slice(0, -1) : t.common.listings} found in Slovakia
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2 italic">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  {t.filters.title}
                </h2>
              </div>
              <div className="p-6 rounded-[2rem] bg-card border border-border shadow-premium">
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
                  className="p-12 bg-destructive/5 text-destructive rounded-[2.5rem] border border-destructive/10 text-center"
                >
                  <p className="text-xl font-black mb-2 italic">Error Loading Marketplace</p>
                  <p className="font-medium opacity-70">{error}</p>
                </motion.div>
              ) : listings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-32 flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-[3rem] border border-dashed border-border/60"
                >
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                    <PackageSearch className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-black text-foreground mb-3 font-heading italic">{t.common.noResults}</p>
                  <p className="text-muted-foreground font-medium max-w-sm">{t.common.tryDifferentFilters}</p>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
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
