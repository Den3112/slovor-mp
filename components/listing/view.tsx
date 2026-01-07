'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ListingCard } from './card'
import { ListingFilters } from './filters'
import type { Listing } from '@/lib/api'
import { listingsApi, type ListingFilterOptions } from '@/lib/api/listings'
import { Container } from '@/components/ui/container'

import { Search, SlidersHorizontal, PackageSearch, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'

const ITEMS_PER_PAGE = 12

interface Props {
  initialListings: Listing[]
  totalCount: number
  error: string | null
  searchQuery?: string
  filters?: ListingFilterOptions
}

export function ListingsView({
  initialListings,
  totalCount,
  error,
  searchQuery,
  filters,
}: Props) {
  const { t } = useTranslation()
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const hasMore = listings.length < totalCount

  /* Infinite Scroll Logic */
  const observerTarget = useRef(null)
  const loadingRef = useRef(false)
  const resetRef = useRef(0)

  const loadMore = useCallback(async () => {
    // Use ref for immediate blocking to prevent race conditions
    if (loadingRef.current || !hasMore) return

    loadingRef.current = true
    setLoading(true)
    const currentResetId = resetRef.current

    try {
      const nextPage = page + 1
      const result = await listingsApi.getAll({
        ...filters,
        page: nextPage,
        limit: ITEMS_PER_PAGE,
      })

      // Check if filters changed while we were fetching
      if (currentResetId !== resetRef.current) return

      if (result.data && result.data.length > 0) {
        setListings((prev) => {
          // Double check resetId inside setter just in case, though closure var is safe enough usually
          // But to be super safe:
          if (currentResetId !== resetRef.current) return prev

          // Filter out any potential duplicates by ID to prevent key errors
          const existingIds = new Set(prev.map(l => l.id))
          const newUnique = result.data!.filter(l => !existingIds.has(l.id))
          return [...prev, ...newUnique]
        })
        setPage(nextPage)
      } else {
        // If data is empty but we thought we had more (hasMore was true),
        // it means we reached the end.
        // Logic for hasMore relies on listings.length, which will update on next render.
        // We can force a check or just let the next render handle it if totalCount is accurate.
      }
    } catch (err) {
      console.error('Failed to load more listings:', err)
    } finally {
      // Only reset loading state if we are still in the same context
      if (currentResetId === resetRef.current) {
        loadingRef.current = false
        setLoading(false)
      }
    }
  }, [hasMore, page, filters]) // removed 'loading' dependency to avoid effect cycling

  // Reset state when initialListings changes (e.g. filters applied)
  useEffect(() => {
    resetRef.current += 1 // Invalidate any in-flight requests
    setListings(initialListings)
    setPage(1)
    setLoading(false)
    loadingRef.current = false
  }, [initialListings])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loadingRef.current) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    const currentTarget = observerTarget.current

    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loadMore]) // dependencies stable

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
              <span className="font-black text-foreground">{totalCount}</span>
              {totalCount === 1
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
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
                  >
                    {listings.map((listing, idx) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          // Animate based on position in current page/batch roughly
                          // Cap delay to prevent long waits for deep items
                          delay: Math.min(idx % ITEMS_PER_PAGE, 10) * 0.05
                        }}
                      >
                        <ListingCard listing={listing} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Infinite Scroll Loader & Sentinel */}
                  <div ref={observerTarget} className="flex justify-center py-8">
                    {loading && (
                      <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm font-medium text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.common.loading || 'Loading more...'}
                      </div>
                    )}
                  </div>

                  {/* All loaded indicator */}
                  {!hasMore && listings.length > ITEMS_PER_PAGE && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-sm text-muted-foreground"
                    >
                      {t.common.allLoaded || 'All listings loaded'} ✓
                    </motion.p>
                  )}
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </Container>
    </div>
  )
}
