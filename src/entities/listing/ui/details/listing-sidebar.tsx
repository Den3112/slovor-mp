'use client'
 
import { supabase } from '@/shared/lib/supabase/client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, Heart, Share2, Flag } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'
import { PriceDisplay } from '@/shared/ui/price-display'
import { ReportDialog } from '@/shared/ui/report-dialog'
import { ListingActionButtons } from '@/entities/listing/ui/shared/listing-action-buttons'
import { ListingOwnerActions } from '@/entities/listing/ui/listing-owner-actions'
import { SellerInfoCard } from './seller-info'
import { SafetyTips } from './safety-tips'
import { useAuth } from '@/app/providers/auth-provider'
import { messagesApi } from '@/entities/message/api'
import type { Listing } from '@/shared/lib/types/database'
import { getLocalizedTitle } from '@/shared/lib/utils/listing-utils'
import { trackEvent } from '@/shared/lib/utils/analytics'
import { type ReactNode } from 'react'

interface ListingSidebarProps {
  listing: Listing
  checkoutSlot?: ReactNode
}

export function ListingSidebar({ listing, checkoutSlot }: ListingSidebarProps) {
  const { t, i18n } = useTranslation('common')
  const { user } = useAuth()
  const router = useRouter()

  const locale = i18n.language
  const seller = listing.user
  const displayTitle = getLocalizedTitle(listing, locale)

  const [isContacting, setIsContacting] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [, setIsCheckoutOpen] = useState(false)

  const handleContact = async () => {
    if (!user) {
      router.push(`/${locale}/login?redirect=/listings/${listing.id}`)
      return
    }

    if (user.id === listing.user_id) {
      toast.error('You cannot message yourself')
      return
    }

    setIsContacting(true)
    trackEvent('listing_contact_click', {
      listing_id: listing.id,
      category: listing.category?.slug,
    })
    try {
      const { data, error } = await messagesApi.getOrCreateConversation(
        supabase,
        listing.id,
        user.id,
        listing.user_id
      )

      if (error) throw new Error(error)

      if (data) {
        router.push(`/${locale}/dashboard/messages/${data.id}`)
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

  const handleBuy = () => {
    if (!user) {
      router.push(`/${locale}/login?redirect=/listings/${listing.id}`)
      return
    }

    if (user.id === listing.user_id) {
      toast.error('You cannot buy your own listing')
      return
    }

    setIsCheckoutOpen(true)
  }

  return (
    <div className="bg-card border-border shadow-card sticky top-28 space-y-8 rounded-4xl border p-6 md:p-8">
      <div className="border-border/40 space-y-3 border-b pb-6">
        <span className="text-primary/60 text-[10px] font-black tracking-[0.3em] uppercase">
          {t('price')}
        </span>

        {listing.status !== 'active' && (
          <div className="mb-4 animate-pulse rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
            <h4 className="flex items-center gap-2 font-black tracking-tight text-amber-600 uppercase">
              <ShieldCheck className="h-5 w-5" />
              Listing Inactive
            </h4>
            <p className="mt-1 text-[11px] leading-relaxed font-bold text-amber-600/80">
              This listing is currently hidden from public search results.
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

      {seller && (
        <div className="bg-primary/5 -mx-4 rounded-2xl p-4 md:mx-0">
          <SellerInfoCard seller={seller} />
        </div>
      )}

      <div className="space-y-4 pt-2">
        <h1 className="font-heading text-xl leading-tight font-black tracking-tight">
          {displayTitle}
        </h1>
        <div className="text-muted-foreground flex items-center gap-4 text-[10px] font-black tracking-widest uppercase opacity-60">
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            {listing.views_count} {t('views')}
          </div>
          <div className="bg-primary/20 h-1 w-1 rounded-full" />
          {listing.user?.verified && (
            <div className="flex items-center gap-1.5 text-emerald-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t('trust:verified')}
            </div>
          )}
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
            onBuy={handleBuy}
          />
        )}
      </div>

      <div className="space-y-3 pt-4">
        <ListingOwnerActions
          listingId={listing.id}
          ownerId={listing.user_id}
          className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50 h-14 w-full gap-2 rounded-xl border-2 text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
        />

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-14 gap-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
          >
            <Heart className="h-4 w-4" /> {t('listing:saveListing')}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-14 gap-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
          >
            <Share2 className="h-4 w-4" /> {t('listing:shareListing')}
          </Button>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReportModal(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 font-bold tracking-tight opacity-50 transition-opacity hover:opacity-100"
          >
            <Flag className="h-3.5 w-3.5" />
            {t('listing:reportListing')}
          </Button>
        </div>

        <div className="pt-6">
          <SafetyTips />
        </div>

        <ReportDialog
          listingId={listing.id}
          userId={listing.user_id}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />

        {checkoutSlot}
      </div>
    </div>
  )
}
