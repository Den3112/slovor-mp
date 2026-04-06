import { PackageSearch, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListingCard } from '@/entities/listing'
import { ActiveFilters } from './active-filters'
import { useTranslation } from '@/shared/lib/i18n'
import { ListingsGridProps } from './types'

const ITEMS_PER_PAGE = 12

export function ListingsGrid({
  listings,
  error,
  loading,
  hasMore,
  observerTarget,
}: ListingsGridProps) {
  const { t } = useTranslation()

  return (
    <main className="lg:col-span-9">
      <ActiveFilters />
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border-destructive/10 bg-destructive/5 text-destructive rounded-2xl border p-12 text-center"
          >
            <p className="mb-2 text-xl font-bold">
              {t('common:errorLoadingMarketplace') ||
                'Error Loading Marketplace'}
            </p>
            <p className="font-medium opacity-70">{error}</p>
          </motion.div>
        ) : listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card-pro border-border/40 relative flex flex-col items-center justify-center p-8 py-32 text-center shadow-lg"
          >
            <div className="bg-primary/5 shadow-primary/10 flex h-24 w-24 items-center justify-center rounded-[2rem] shadow-xl backdrop-blur-md">
              <PackageSearch className="text-primary h-12 w-12 opacity-40" />
            </div>
            <h3 className="font-heading text-foreground mt-8 mb-3 text-3xl font-black tracking-tight uppercase">
              {t('common:noResults')}
            </h3>
            <p className="text-muted-foreground max-w-xs text-center text-lg font-medium opacity-60">
              {t('common:tryDifferentFilters')}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4"
            >
              {listings.map((listing, idx) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: Math.min(idx % ITEMS_PER_PAGE, 10) * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </motion.div>

            {/* Infinite Scroll Loader & Sentinel */}
            <div ref={observerTarget} className="flex justify-center py-12">
              {loading && (
                <div className="glass-panel text-primary border-primary/20 flex items-center gap-3 rounded-full border bg-white/50 px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase shadow-lg backdrop-blur-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('common:loading') || 'Loading more...'}
                </div>
              )}
            </div>

            {/* All loaded indicator */}
            {!hasMore && listings.length > ITEMS_PER_PAGE && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-4 py-8"
              >
                <div className="bg-border/40 h-px w-12" />
                <p className="text-muted-foreground text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
                  {t('common:allLoaded') || 'All listings loaded'}
                </p>
                <div className="bg-border/40 h-px w-12" />
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
