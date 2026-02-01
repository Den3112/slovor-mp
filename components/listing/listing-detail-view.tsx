'use client'

import { useEffect } from 'react'
import { ImageGallery } from '@/components/listing/image-gallery'
import { Container } from '@/components/ui/container'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/types/database'
import {
  getLocalizedTitle,
  getLocalizedDescription,
} from '@/lib/utils/listing-utils'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'
import { RecentlyViewed } from '@/components/listing/recently-viewed'
import { ListingDetailsGrid } from './details/listing-attributes'
import { ListingSidebar } from './details/listing-sidebar'
import { ListingDescription } from './details/listing-description'

interface ListingDetailViewProps {
  listing: Listing
}

export function ListingDetailView({ listing }: ListingDetailViewProps) {
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language

  const displayTitle = getLocalizedTitle(listing, locale)
  const displayDescription = getLocalizedDescription(listing, locale)

  const { addItem } = useRecentlyViewed()

  useEffect(() => {
    addItem(listing)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id])

  return (
    <div className="bg-background min-h-screen pb-12">
      <Container className="pt-24 md:pt-32">
        <div className="mb-6 md:mb-8">
          <Breadcrumbs
            items={[
              { label: t('allListings'), href: '/listings' },
              ...(listing.category
                ? [
                  {
                    label: getLocalizedCategoryName(
                      listing.category,
                      locale,
                      t
                    ),
                    href: `/categories/${listing.category.slug}`,
                  },
                ]
                : []),
              { label: displayTitle },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-8">
            {/* Image Gallery - Solid Clean Style */}
            <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
              <ImageGallery
                images={listing.images || []}
                title={displayTitle}
              />
            </div>

            <div className="space-y-8">
              <ListingDescription description={displayDescription} />
              <ListingDetailsGrid listing={listing} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <ListingSidebar listing={listing} />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <RecentlyViewed />
        </div>
      </Container>
    </div>
  )
}
