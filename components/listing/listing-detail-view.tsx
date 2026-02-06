'use client'

import { useEffect } from 'react'
import { ImageGallery } from '@/components/listing/image-gallery'
import { MobileImageGallery } from '@/components/listing/mobile-image-gallery'
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
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/ui/price-display'

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
    <div className="bg-background min-h-screen pb-32">
      <Container className="pt-24 md:pt-32">
        <div className="mb-6 md:mb-8">
          <Breadcrumbs
            items={[
              { label: t('allListings'), href: `/${locale}/listings` },
              ...(listing.category
                ? [
                  {
                    label: getLocalizedCategoryName(
                      listing.category,
                      locale,
                      t
                    ),
                    href: `/${locale}/categories/${listing.category.slug}`,
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
            {/* Image Gallery */}
            <div className="hidden md:block">
              <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
                <ImageGallery
                  images={listing.images || []}
                  title={displayTitle}
                />
              </div>
            </div>

            <div className="md:hidden">
              <MobileImageGallery
                images={listing.images || []}
                alt={displayTitle}
              />
            </div>

            <div className="space-y-8">
              <ListingDescription description={displayDescription} />
              <ListingDetailsGrid listing={listing} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <ListingSidebar listing={listing} />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <RecentlyViewed />
        </div>
      </Container>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed right-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 z-40 md:hidden">
        <div className="bg-background/80 border-border border-t p-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                {t('common:price')}
              </span>
              <PriceDisplay
                amount={listing.price}
                baseCurrency={listing.currency}
                className="text-foreground text-2xl font-bold tracking-tight"
              />
            </div>
            <Button
              className="h-14 flex-1 rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
              onClick={() => {
                const sidebarButton = document.querySelector('[data-action="contact"]') as HTMLButtonElement
                if (sidebarButton) sidebarButton.click()
              }}
            >
              Contact Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
