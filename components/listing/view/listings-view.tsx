'use client'

import { useRef, useEffect, useState } from 'react'
import { ListingFilters } from '@/components/listing/filters'
import type { Listing } from '@/lib/api'
import { type ListingFilterOptions } from '@/lib/api/listings'
import { Container } from '@/components/ui/container'
import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useListingsPagination } from '@/lib/hooks/use-listings-pagination'
import { ListingHeader } from './listing-header'
import { MobileFilterDrawer } from './mobile-filter-drawer'
import { ListingsGrid } from './listings-grid'

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
  const [filterOpen, setFilterOpen] = useState(false)

  const {
    listings,
    loading,
    hasMore,
    loadMore
  } = useListingsPagination({
    initialListings,
    totalCount,
    filters
  })

  // Infinite Scroll Observer
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
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
  }, [hasMore, loadMore, loading])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20 pb-20">
      <ListingHeader
        searchQuery={searchQuery}
        totalCount={totalCount}
        filters={filters}
      />

      <Container>
        <MobileFilterDrawer
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          totalCount={totalCount}
          t={t}
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden space-y-8 lg:col-span-3 lg:block">
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

          <ListingsGrid
            listings={listings}
            loading={loading}
            hasMore={hasMore}
            error={error}
            t={t}
            observerTarget={observerTarget}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      </Container>
    </div>
  )
}
