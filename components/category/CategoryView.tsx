'use client'

import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { Filters } from '@/components/category/Filters'
import { Pagination } from '@/components/category/Pagination'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import type { Category, Listing } from '@/lib/types/database'

interface CategoryViewProps {
  category: Category
  listings: Listing[]
  listingsError: string | null
  totalCount: number
  itemsPerPage: number
}

// ... imports

export function CategoryView({
  category,
  listings,
  listingsError,
  totalCount,
  itemsPerPage,
}: CategoryViewProps) {
  const { t, locale } = useTranslation()
  const categoryName = getLocalizedCategoryName(category, locale, t)

  return (
    <div className="container mx-auto min-h-screen overflow-x-hidden px-4 pb-12 pt-28 md:pt-32">
      <Breadcrumbs
        items={[
          { label: t.common.categories, href: '/listings' },
          { label: categoryName },
        ]}
      />

      <div className="fade-in-up mb-12 mt-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {category.icon && (
            <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] border border-border/50 bg-card text-6xl shadow-lg shadow-black/5">
              {category.icon}
            </div>
          )}
          <div>
            <h1 className="mb-4 font-heading text-4xl font-black tracking-tighter text-foreground md:text-6xl">
              {categoryName}
            </h1>
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="rounded-xl border-0 bg-primary/10 px-3 py-1 text-sm font-black uppercase tracking-wider text-primary"
              >
                {totalCount} {t.common.listings} {t.common.found}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Filters />

      {/* Listings or Error */}
      {listingsError ? (
        <ErrorState message={listingsError} />
      ) : listings.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-4 text-xl text-muted-foreground">
            {t.common.noListings || 'No listings found'}
          </p>
          <p className="text-muted-foreground">
            {t.common.tryDifferentFilters || 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <>
          <ListingGrid listings={listings} />
          <Pagination totalItems={totalCount} itemsPerPage={itemsPerPage} />
        </>
      )}
    </div>
  )
}
