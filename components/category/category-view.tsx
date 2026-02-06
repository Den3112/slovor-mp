'use client'

import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Filters } from '@/components/category/filters'
import { Pagination } from '@/components/category/pagination'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import type { Category, Listing } from '@/lib/types/database'
import { CategoryIcon } from '@/components/category/category-icon'

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
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language
  const categoryName = getLocalizedCategoryName(category, locale, t)

  return (
    <div className="container mx-auto min-h-screen overflow-x-hidden px-4 pt-24 pb-12 md:pt-32">
      <Breadcrumbs
        items={[
          { label: t('common:categories'), href: '/listings' },
          { label: categoryName },
        ]}
      />

      <div className="fade-in-up mt-8 mb-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="border-border/60 bg-card shadow-sm flex h-24 w-24 items-center justify-center rounded-xl border md:h-32 md:w-32">
            <CategoryIcon
              slug={category.slug}
              className="text-primary animate-float h-12 w-12 transition-all duration-700 md:h-16 md:w-16"
            />
          </div>
          <div className="space-y-3">
            <h1 className="font-heading text-foreground text-4xl font-bold tracking-tighter  md:text-7xl">
              {categoryName}
            </h1>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold tracking-widest text-primary uppercase">
                <div className="h-2 w-2 animate-pulse rounded-sm bg-primary" />
                {totalCount} {t('common:listings')} {t('common:found')}
              </div>
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
          <p className="text-muted-foreground mb-4 text-xl">
            {t('common:noListings') || 'No listings found'}
          </p>
          <p className="text-muted-foreground">
            {t('common:tryDifferentFilters') || 'Try adjusting your filters'}
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
