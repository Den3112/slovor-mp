'use client'

import { useEffect } from 'react'
import { StructuredData } from '@/components/layout/structured-data'
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

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayTitle,
    description: displayDescription,
    image: listing.images || [],
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: listing.currency || 'EUR',
      availability:
        listing.status === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/${locale}/listings/${listing.id}`,
    },
  }

  const { addItem } = useRecentlyViewed()

  useEffect(() => {
    addItem(listing)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id])

  return (
    <div className="bg-background min-h-screen pb-32">
      <StructuredData locale={locale} extraSchema={productSchema} />
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

      {/* Mobile Sticky Action Bar - Adjusted bottom to clear global BottomNavBar */}
      <div className="fixed right-0 bottom-0 left-0 z-40 flex flex-col md:hidden">
        {/* Added safe area padding and increased margin to clear bottom nav */}
        <div className="bg-background mb-[var(--bottom-nav-height,72px)] border-t p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                {t('common:price')}
              </span>
              <PriceDisplay
                amount={listing.price}
                baseCurrency={listing.currency}
                className="text-foreground text-2xl font-bold tracking-tight"
              />
            </div>
            <Button
              className="shadow-primary/20 h-14 flex-1 rounded-xl text-lg font-bold shadow-lg"
              onClick={() => {
                const sidebarButton = document.querySelector(
                  '[data-action="contact"]'
                ) as HTMLButtonElement
                if (sidebarButton) sidebarButton.click()
              }}
            >
              {t('common:contactSeller')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
