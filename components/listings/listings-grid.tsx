'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Inbox, Loader2 } from 'lucide-react'
import { ListingCard, ListingCardSkeleton } from './listing-card'
import { useListingsSearch } from '@/hooks/use-listings-search'
import { useInView } from 'react-intersection-observer'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function ListingsGrid() {
  const {
    listings,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount,
  } = useListingsSearch()

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-muted/30 flex flex-col items-center justify-center space-y-4 rounded-4xl border border-dashed py-24 text-center"
      >
        <div className="bg-background rounded-full p-6 shadow-sm">
          <Inbox className="text-muted-foreground/40 h-12 w-12" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Nenašli sme žiadne inzeráty</h3>
          <p className="text-muted-foreground mx-auto max-w-xs">
            Skúste zmeniť filtre alebo vyhľadávané slovo pre lepšie výsledky.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Zobrazených{' '}
          <span className="text-foreground font-bold">{listings.length}</span> z{' '}
          <span className="text-foreground font-bold">{totalCount}</span>{' '}
          inzerátov
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {listings.map((listing, index) => (
            <motion.div key={listing.id} variants={item} layout>
              <ListingCard listing={listing} isPriority={index < 4} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite Scroll Trigger */}
      <div
        ref={ref}
        className="flex w-full flex-col items-center justify-center space-y-4 py-12"
      >
        {hasNextPage ? (
          <>
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted-foreground animate-pulse text-sm font-medium">
              Načítavam ďalšie inzeráty...
            </p>
          </>
        ) : (
          listings.length > 0 && (
            <div className="flex w-full items-center space-x-4">
              <div className="bg-muted h-px flex-1" />
              <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
                To je všetko
              </p>
              <div className="bg-muted h-px flex-1" />
            </div>
          )
        )}
      </div>
    </div>
  )
}
