'use client'

import { ImageGallery } from '@/components/listing/image-gallery'
import { Eye, Share2, Heart, ShieldCheck, Flag } from 'lucide-react'
import { ListingActionButtons } from '@/components/listing/shared/listing-action-buttons'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { useTranslation } from '@/lib/i18n'
import { ListingOwnerActions } from '@/components/listing/listing-owner-actions'
import type { Listing } from '@/lib/types/database'
import {
  getLocalizedTitle,
  getLocalizedDescription,
} from '@/lib/utils/listing-utils'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { PriceDisplay } from '@/components/ui/price-display'
import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'
import { RecentlyViewed } from '@/components/listing/recently-viewed'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { messagesApi } from '@/lib/api/messages'
import { toast } from 'sonner'
import { ListingDetailsGrid } from './details/listing-attributes'
import { SellerInfoCard } from './details/seller-info'

interface ListingDetailViewProps {
  listing: Listing
}

export function ListingDetailView({ listing }: ListingDetailViewProps) {
  const { t, locale } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const seller = listing.user

  const [isContacting, setIsContacting] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  const displayTitle = getLocalizedTitle(listing, locale)
  const displayDescription = getLocalizedDescription(listing, locale)

  const { addItem } = useRecentlyViewed()

  useEffect(() => {
    addItem(listing)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id])

  const handleContact = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/listings/${listing.id}`)
      return
    }

    if (user.id === listing.user_id) {
      toast.error('You cannot message yourself')
      return
    }

    setIsContacting(true)
    try {
      const { data, error } = await messagesApi.getOrCreateConversation(
        listing.id,
        user.id,
        listing.user_id
      )

      if (error) throw new Error(error)

      if (data) {
        router.push(`/profile/messages/${data.id}`)
      }
    } catch (error) {
      console.error('Failed to start conversation:', error)
      toast.error('Failed to start conversation')
    } finally {
      setIsContacting(false)
    }
  }

  const handleCall = () => {
    if (!seller?.phone) {
      toast.error('Seller has not provided a phone number')
      return
    }
    setShowPhone(true)
    window.location.href = `tel:${seller.phone}`
  }

  return (
    <div className="from-background via-background/95 to-background min-h-screen bg-linear-to-b pb-10">
      <Container className="relative z-10 py-6 pt-24 md:pt-32">
        <div className="mt-0 md:mt-8">
          <Breadcrumbs
            items={[
              { label: t.common.allListings, href: '/listings' },
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
              <div className="space-y-4">
                <h2 className="font-heading text-3xl font-black tracking-tight italic">
                  {t.listing.itemDescription}
                </h2>
                <div className="bg-primary h-1.5 w-20 rounded-full" />
                <p className="text-foreground/80 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                  {displayDescription}
                </p>
              </div>

              <ListingDetailsGrid listing={listing} />
            </div>
          </div>

          <div className="space-y-8 lg:col-span-4">
            <div className="shadow-primary/5 bg-background/80 sticky top-28 space-y-8 rounded-5xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="space-y-3 border-b border-white/10 pb-6">
                <span className="text-primary/80 text-[10px] font-black tracking-[0.2em] uppercase">
                  {t.common.price}
                </span>

                {listing.status !== 'active' && (
                  <div className="mb-4 animate-pulse rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <h4 className="flex items-center gap-2 font-bold text-amber-600">
                      <ShieldCheck className="h-5 w-5" />
                      Listing Inactive
                    </h4>
                    <p className="mt-1 text-xs font-medium text-amber-600/80">
                      This listing is currently hidden from public search
                      results.
                    </p>
                  </div>
                )}

                <PriceDisplay
                  amount={listing.price}
                  baseCurrency={listing.currency}
                  className="text-foreground block text-5xl font-black tracking-tighter md:text-6xl"
                  showOriginal
                />
              </div>

              {seller && <SellerInfoCard seller={seller} />}

              <div className="space-y-4 pt-2">
                <h3 className="font-heading text-xl font-black italic">
                  {displayTitle}
                </h3>
                <div className="text-muted-foreground flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    {listing.views_count} {t.common.views}
                  </div>
                  <div className="bg-border h-1 w-1 rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    {t.trust.verified}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                {seller && (
                  <ListingActionButtons
                    seller={seller}
                    isContacting={isContacting}
                    showPhone={showPhone}
                    onContact={handleContact}
                    onCall={handleCall}
                  />
                )}
              </div>

              <div className="space-y-3 pt-4">
                <ListingOwnerActions
                  listingId={listing.id}
                  ownerId={listing.user_id}
                  className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50 h-14 w-full gap-2 rounded-xl border-2 font-bold"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-muted-foreground hover:text-foreground h-14 gap-2 rounded-xl font-bold"
                  >
                    <Heart className="h-5 w-5" /> {t.listing.saveListing}
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-muted-foreground hover:text-foreground h-14 gap-2 rounded-xl font-bold"
                  >
                    <Share2 className="h-5 w-5" /> {t.listing.shareListing}
                  </Button>
                </div>

                <div className="flex justify-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                  >
                    <Flag className="h-4 w-4" />
                    {t.listing.reportListing}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <RecentlyViewed />
        </div>
      </Container>
    </div>
  )
}
