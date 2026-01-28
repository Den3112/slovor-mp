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
    <div className="from-background via-background/95 to-background min-h-screen bg-linear-to-b pb-10">
      <Container className="relative z-10 py-6 pt-24 md:pt-32">
        <div className="mt-0 md:mt-8">
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
      </Container>

      <Container>
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-12">
          <div className="space-y-8 md:space-y-12 lg:col-span-8">
            <div className="bg-card/50 group relative overflow-hidden rounded-4xl border border-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl md:rounded-5xl">
              <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/20 to-transparent" />
              <ImageGallery
                images={listing.images || []}
                title={displayTitle}
              />
            </div>

            <div className="space-y-10">
              <ListingDescription description={displayDescription} />
              <ListingDetailsGrid listing={listing} />
            </div>
          </div>

          <div className="space-y-8 lg:col-span-4">
            <ListingSidebar listing={listing} />
          </div>
        </div>

        <div className="mt-8">
          <RecentlyViewed />
        </div>
      </Container>
    </div>
  )
}
