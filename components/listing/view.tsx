'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ListingCard } from './card'
import { ListingFilters } from './filters'
import { ActiveFilters } from './active-filters'
import { SaveSearchButton } from './save-search-button'
import { listingsApi, type ListingFilterOptions } from '@/lib/api/listings'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import type { Listing, Category } from '@/lib/types/database'

import {
  Search,
  SlidersHorizontal,
  PackageSearch,
  Loader2,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'
import { Drawer } from 'vaul'

const ITEMS_PER_PAGE = 12

interface Props {
  initialListings: Listing[]
  totalCount: number
  categories: Category[]
  error: string | null
  searchQuery?: string
  filters?: ListingFilterOptions
}

export function ListingsView({
  initialListings,
  totalCount,
  categories,
  error,
  searchQuery,
  filters,
}: Props) {
  const { t } = useTranslation()
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

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
          const existingIds = new Set(prev.map((l) => l.id))
          const newUnique = (result.data || []).filter(
            (l) => !existingIds.has(l.id)
          )
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
      <div className="relative mb-8 overflow-hidden border-b border-white/5 pt-24 pb-10 md:mb-12 md:pt-32 md:pb-16">
        {/* Decorative elements - Replaced orbs with subtle background */}
        <div className="bg-primary/5 absolute inset-0 z-0" />

        <Container>
          <div className="relative z-10 flex flex-col gap-4 md:gap-8">
            <div className="border-primary/20 bg-primary/10 text-primary inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase">
              <Search className="h-3.5 w-3.5" />
              Explorer
            </div>

            <Breadcrumbs
              items={[
                {
                  label: searchQuery
                    ? `${t('common.search')}: ${searchQuery}`
                    : t('common.allListings'),
                },
              ]}
            />

            <h1 className="font-heading text-foreground max-w-4xl text-5xl font-black tracking-tighter italic md:text-8xl">
              {searchQuery
                ? `${t('common.search')}: ${searchQuery}`
                : t('common.allListings')}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-muted-foreground flex items-center gap-3 text-lg font-medium md:text-2xl">
                <span className="font-heading text-foreground font-black">
                  {totalCount}
                </span>
                {totalCount === 1
                  ? t('common.listings.slice')(0, -1)
                  : t('common.listings')}{' '}
                {t('common.found')}
              </p>
              <div className="bg-border mx-2 hidden h-6 w-px md:block" />
              <SaveSearchButton
                filters={filters || {}}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Mobile Filter Trigger */}
        <div className="mb-6 lg:hidden">
          <Drawer.Root open={filterOpen} onOpenChange={setFilterOpen}>
            <Drawer.Trigger asChild>
              <button className="border-border bg-card flex w-full items-center justify-between rounded-xl border p-4 font-bold shadow-sm transition-all active:scale-[0.98]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="text-primary h-5 w-5" />
                  <span>{t('filters.title')}</span>
                </div>
                <div className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black">
                  +
                </div>
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
              <Drawer.Content className="border-border bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[85vh] flex-col rounded-t-xl border-t outline-none">
                <div className="bg-background border-border/40 shrink-0 rounded-t-xl border-b p-4">
                  <div className="bg-border/60 mx-auto mb-6 h-1.5 w-12 shrink-0 rounded-lg" />
                  <div className="flex items-center justify-between px-2">
                    <Drawer.Title className="text-xl font-black tracking-tight italic">
                      {t('filters.title')}
                    </Drawer.Title>
                    <Drawer.Close asChild>
                      <button className="text-muted-foreground -mr-2 p-2">
                        <X className="h-6 w-6" />
                      </button>
                    </Drawer.Close>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <ListingFilters categories={categories} />
                </div>
                <div className="border-border/40 safe-bottom border-t p-4">
                  <Button
                    className="h-14 w-full rounded-xl text-lg font-bold"
                    onClick={() => setFilterOpen(false)}
                  >
                    Show {totalCount} Listings
                  </Button>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden space-y-8 lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-black tracking-tight italic">
                  <SlidersHorizontal className="text-primary h-5 w-5" />
                  {t('filters.title')}
                </h2>
              </div>
              <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
                <ListingFilters categories={categories} />
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <main className="lg:col-span-9">
            <ActiveFilters />
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-destructive/10 bg-destructive/5 text-destructive rounded-xl border p-12 text-center"
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
                  className="border-border/60 bg-muted/20 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 py-32 text-center"
                >
                  <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-xl border border-border/50">
                    <PackageSearch className="text-muted-foreground/40 h-10 w-10" />
                  </div>
                  <p className="font-heading text-foreground mb-3 text-2xl font-black italic">
                    {t('common.noResults')}
                  </p>
                  <p className="text-muted-foreground max-w-sm font-medium">
                    {t('common.tryDifferentFilters')}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    {listings.map((listing, idx) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          // Animate based on position in current page/batch roughly
                          // Cap delay to prevent long waits for deep items
                          delay: Math.min(idx % ITEMS_PER_PAGE, 10) * 0.05,
                        }}
                      >
                        <ListingCard listing={listing} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Infinite Scroll Loader & Sentinel */}
                  <div
                    ref={observerTarget}
                    className="flex justify-center py-8"
                  >
                    {loading && (
                      <div className="bg-card text-muted-foreground flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-black uppercase tracking-widest shadow-sm">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {t('common.loading') || 'Loading more...'}
                      </div>
                    )}
                  </div>

                  {/* All loaded indicator */}
                  {!hasMore && listings.length > ITEMS_PER_PAGE && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-muted-foreground text-center text-sm"
                    >
                      {t('common.allLoaded') || 'All listings loaded'} ✓
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
