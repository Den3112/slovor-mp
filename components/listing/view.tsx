'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Listing } from '@/lib/api'
import { listingsApi, type ListingFilterOptions } from '@/lib/api/listings'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import { AnimatePresence } from 'framer-motion'

const ITEMS_PER_PAGE = 12

interface Props {
  initialListings: Listing[]
  totalCount: number
  error: string | null
  searchQuery?: string
  filters?: ListingFilterOptions
}

// Sub-components
import { ListingsHeader } from './view-components/listings-header'
import { FilterDrawer } from './view-components/filter-drawer'
import { FiltersSidebar } from './view-components/filters-sidebar'
import { ListingsGrid } from './view-components/listings-grid'

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
  const [filterOpen, setFilterOpen] = useState(false)

  const hasMore = listings.length < totalCount

  /* Infinite Scroll Logic */
  const observerTarget = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  const resetRef = useRef(0)

  const loadMore = useCallback(async () => {
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

      if (currentResetId !== resetRef.current) return

      if (result.data && result.data.length > 0) {
        setListings((prev) => {
          if (currentResetId !== resetRef.current) return prev
          const existingIds = new Set(prev.map((l) => l.id))
          const newUnique = (result.data || []).filter(
            (l) => !existingIds.has(l.id)
          )
          return [...prev, ...newUnique]
        })
        setPage(nextPage)
      }
    } catch (err) {
      console.error('Failed to load more listings:', err)
    } finally {
      if (currentResetId === resetRef.current) {
        loadingRef.current = false
        setLoading(false)
      }
    }
  }, [hasMore, page, filters])

  useEffect(() => {
    resetRef.current += 1
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
    if (currentTarget) observer.observe(currentTarget)

    return () => {
      if (currentTarget) observer.unobserve(currentTarget)
    }
  }, [hasMore, loadMore])

  return (
    <div className="from-background via-background/95 to-muted/20 min-h-screen bg-gradient-to-b pb-20">
      <ListingsHeader
        t={t}
        searchQuery={searchQuery}
        totalCount={totalCount}
        filters={filters}
      />

      <Container>
        <FilterDrawer
          open={filterOpen}
          onOpenChange={setFilterOpen}
          t={t}
          totalCount={totalCount}
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <FiltersSidebar t={t} />

          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <ListingsGrid
                listings={listings}
                loading={loading}
                error={error}
                hasMore={hasMore}
                observerTarget={observerTarget}
                t={t}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </AnimatePresence>
          </main>
        </div>
      </Container>
    </div>
  )
}
