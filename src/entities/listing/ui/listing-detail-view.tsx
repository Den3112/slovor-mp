'use client'

import { useEffect } from 'react'
import { StructuredData } from '@/widgets/structured-data'
import { ImageGallery } from '@/entities/listing/ui/image-gallery'
import { MobileImageGallery } from '@/entities/listing/ui/mobile-image-gallery'
import { Container } from '@/shared/ui/container'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'
import { useTranslation } from '@/shared/lib/i18n'
import type { Listing } from '@/shared/lib/types/database'
import {
  getLocalizedTitle,
  getLocalizedDescription,
} from '@/shared/lib/utils/listing-utils'
import { getLocalizedCategoryName } from '@/shared/lib/utils/category-i18n'
import { useRecentlyViewed } from '../hooks'
import { RecentlyViewed } from '@/entities/listing/ui/recently-viewed'
import { ListingDetailsGrid } from '@/entities/listing/ui/details/listing-attributes'
import { ListingSidebar } from '@/entities/listing/ui/details/listing-sidebar'
import { ListingDescription } from '@/entities/listing/ui/details/listing-description'
import { Button } from '@/shared/ui/button'
import { PriceDisplay } from '@/shared/ui/price-display'
import { trackEvent } from '@/shared/lib/utils/analytics'
import { type ReactNode } from 'react'
import dynamic from 'next/dynamic'

const RelatedListings = dynamic(
  () =>
    import('@/entities/listing/ui/related-listings').then(
      (mod) => mod.RelatedListings
    ),
  {
    loading: () => (
      <div className="bg-muted/20 h-[400px] w-full animate-pulse rounded-2xl" />
    ),
  }
)

interface ListingDetailViewProps {
  listing: Listing
  checkoutSlot?: ReactNode
}

export function ListingDetailView({
  listing,
  checkoutSlot,
}: ListingDetailViewProps) {
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
    trackEvent('listing_view', {
      listing_id: listing.id,
      category: listing.category?.slug,
    })
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
          <div className="space-y-12 lg:col-span-8">
            {/* Image Gallery */}
            <div className="hidden md:block">
              <div className="border-border overflow-hidden rounded-4xl border">
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

            <div className="space-y-12">
              <ListingDescription description={displayDescription} />
              <ListingDetailsGrid listing={listing} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <ListingSidebar listing={listing} checkoutSlot={checkoutSlot} />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <RelatedListings
            categoryId={listing.category_id ?? undefined}
            currentListingId={listing.id}
          />
        </div>

        <div className="mt-20">
          <RecentlyViewed />
        </div>
      </Container>

      {/* Mobile Sticky Action Bar - Adjusted bottom to clear global BottomNavBar */}
      <div className="fixed right-0 bottom-0 left-0 z-40 flex flex-col md:hidden">
        {/* Added safe area padding and increased margin to clear bottom nav */}
        <div className="bg-card border-border shadow-card mb-(--bottom-nav-height,72px) border-t p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-primary/60 text-[10px] font-black tracking-[0.2em] uppercase">
                {t('common:price')}
              </span>
              <PriceDisplay
                amount={listing.price}
                baseCurrency={listing.currency}
                className="text-foreground text-2xl font-black tracking-tight"
              />
            </div>
            <Button
              className="h-14 flex-1 rounded-xl text-lg font-black tracking-tight shadow-md transition-all active:scale-95"
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
