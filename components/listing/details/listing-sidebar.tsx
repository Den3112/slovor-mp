'use client'

import {
    Eye,
    Share2,
    Heart,
    ShieldCheck,
    Flag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { ListingOwnerActions } from '@/components/listing/shared'
import type { Listing } from '@/lib/types/database'
import { PriceDisplay } from '@/components/ui/price-display'
import { SellerInfoCard } from './seller-info'
import { useListingActions } from '@/lib/hooks/use-listing-actions'
import { ListingActionButtons } from '@/components/listing/shared'
import { getLocalizedTitle } from '@/lib/utils/listing-utils'

interface ListingSidebarProps {
    listing: Listing
}

export function ListingSidebar({ listing }: ListingSidebarProps) {
    const { t, locale } = useTranslation()
    const seller = listing.user
    const displayTitle = getLocalizedTitle(listing, locale)

    const {
        handleContact,
        handleCall,
        handleShare,
        isContacting,
        showPhone
    } = useListingActions(listing)

    return (
        <div className="sticky top-28 space-y-8 border-2 border-primary/20 bg-zinc-950 p-6 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)] md:p-10">
            <div className="space-y-4 pb-8 border-b-2 border-primary/10">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">
                    {t.common.price}
                </span>

                {!listing.is_active && (
                    <div className="mb-6 border-2 border-amber-500/30 bg-amber-500/5 p-6 animate-pulse">
                        <h4 className="flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-widest text-amber-500">
                            <ShieldCheck className="h-5 w-5" />
                            Listing Inactive
                        </h4>
                        <p className="mt-2 font-sans text-[10px] font-medium leading-relaxed tracking-wide text-amber-500/70">
                            This listing is currently hidden from public search results.
                        </p>
                    </div>
                )}

                <PriceDisplay
                    amount={listing.price}
                    baseCurrency={listing.currency}
                    className="block font-heading text-6xl font-black tracking-tighter text-white"
                    showOriginal
                />
            </div>

            {seller && <SellerInfoCard seller={seller} />}

            <div className="space-y-6 pt-2">
                <h3 className="font-heading text-3xl font-bold leading-tight text-white italic">
                    {displayTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-6 font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        {listing.views} {t.common.views}
                    </div>
                    <div className="h-4 w-px bg-primary/20" />
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span>{t.trust.verified}</span>
                    </div>
                </div>
            </div>

            <ListingActionButtons
                seller={seller}
                isContacting={isContacting}
                showPhone={showPhone}
                onContact={handleContact}
                onCall={handleCall}
            />

            <ListingOwnerActions
                listingId={listing.id}
                ownerId={listing.user_id}
                className="h-16 w-full gap-3 border-2 border-primary/20 bg-zinc-950 font-sans text-xs font-bold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary/5 hover:border-primary"
            />

            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="ghost"
                    size="lg"
                    className="h-16 gap-3 rounded-none border-2 border-primary/10 bg-zinc-900 font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:bg-primary/5 hover:text-white hover:border-primary/40"
                >
                    <Heart className="h-5 w-5" /> {t.listing.saveListing}
                </Button>
                <Button
                    variant="ghost"
                    size="lg"
                    className="h-16 gap-3 rounded-none border-2 border-primary/10 bg-zinc-900 font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:bg-primary/5 hover:text-white hover:border-primary/40"
                    onClick={handleShare}
                >
                    <Share2 className="h-5 w-5" /> {t.listing.shareListing}
                </Button>
            </div>

            <div className="flex justify-center pt-2">
                <Button variant="ghost" size="sm" className="rounded-none font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-destructive/60 hover:text-destructive hover:bg-destructive/5 gap-2">
                    <Flag className="h-4 w-4" />
                    {t.listing.reportListing}
                </Button>
            </div>
        </div>
    )
}
