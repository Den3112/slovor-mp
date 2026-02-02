'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, Heart, Share2, Flag } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/ui/price-display'
import { ReportDialog } from '@/components/ui/report-dialog'
import { ListingActionButtons } from '@/components/listing/shared/listing-action-buttons'
import { ListingOwnerActions } from '@/components/listing/listing-owner-actions'
import { SellerInfoCard } from './seller-info'
import { useAuth } from '@/components/providers/auth-provider'
import { messagesApi } from '@/lib/api/messages'
import type { Listing } from '@/lib/types/database'
import { getLocalizedTitle } from '@/lib/utils/listing-utils'

interface ListingSidebarProps {
    listing: Listing
}

export function ListingSidebar({ listing }: ListingSidebarProps) {
    const { t, i18n } = useTranslation('common')
    const { user } = useAuth()
    const router = useRouter()

    const locale = i18n.language
    const seller = listing.user
    const displayTitle = getLocalizedTitle(listing, locale)

    const [isContacting, setIsContacting] = useState(false)
    const [showPhone, setShowPhone] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)

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
                router.push(`/messages/${data.id}`)
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
        <div className="sticky top-28 space-y-8 rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="space-y-3 border-b border-border pb-6">
                <span className="text-primary/80 text-[10px] font-black tracking-[0.2em] uppercase">
                    {t('price')}
                </span>

                {listing.status !== 'active' && (
                    <div className="mb-4 animate-pulse rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                        <h4 className="flex items-center gap-2 font-bold text-amber-600">
                            <ShieldCheck className="h-5 w-5" />
                            Listing Inactive
                        </h4>
                        <p className="mt-1 text-xs font-medium text-amber-600/80">
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

            {seller && <SellerInfoCard seller={seller} />}

            <div className="space-y-4 pt-2">
                <h3 className="font-heading text-xl font-black italic">
                    {displayTitle}
                </h3>
                <div className="text-muted-foreground flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        {listing.views_count} {t('views')}
                    </div>
                    <div className="bg-border h-1 w-1 rounded-full" />
                    {listing.user?.verified && (
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            {t('trust.verified')}
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
                    />
                )}
            </div>

            <div className="space-y-3 pt-4">
                <ListingOwnerActions
                    listingId={listing.id}
                    ownerId={listing.user_id}
                    className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50 h-14 w-full gap-2 rounded-xl border-2 font-black uppercase tracking-widest text-xs"
                />

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="ghost"
                        size="lg"
                        className="text-muted-foreground hover:text-foreground h-14 gap-2 rounded-xl font-black uppercase tracking-widest text-[10px]"
                    >
                        <Heart className="h-5 w-5" /> {t('listing.saveListing')}
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="text-muted-foreground hover:text-foreground h-14 gap-2 rounded-xl font-black uppercase tracking-widest text-[10px]"
                    >
                        <Share2 className="h-5 w-5" /> {t('listing.shareListing')}
                    </Button>
                </div>

                <div className="flex justify-center pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReportModal(true)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                    >
                        <Flag className="h-4 w-4" />
                        {t('listing.reportListing')}
                    </Button>
                </div>

                <ReportDialog
                    listingId={listing.id}
                    userId={listing.user_id}
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                />
            </div>
        </div>
    )
}
