'use client'

import { ImageGallery } from '@/components/listing/image-gallery'
import {
    Eye,
    Share2,
    Heart,
    ShieldCheck,
    Flag,
    Phone,
    MessageCircle,
    ArrowLeft,
    Loader2,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import { ListingOwnerActions } from '@/components/listing/listing-owner-actions'
import type { Listing } from '@/lib/types/database'
import { getLocalizedTitle, getLocalizedDescription } from '@/lib/utils/listing-utils'
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
            toast.error("You cannot message yourself")
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
            toast.error("Failed to start conversation")
        } finally {
            setIsContacting(false)
        }
    }

    const handleCall = () => {
        if (!seller?.phone) {
            toast.error("Seller has not provided a phone number")
            return
        }
        setShowPhone(true)
        window.location.href = `tel:${seller.phone}`
    }

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-b from-background via-background/95 to-background">
            <Container className="py-6 pt-24 md:pt-32 relative z-10">
                <Link
                    href="/listings"
                    className="group hidden md:inline-flex items-center gap-2 pl-4 pr-6 py-2 rounded-full bg-background/50 backdrop-blur-md border border-white/10 text-sm font-bold text-muted-foreground transition-all hover:text-primary hover:bg-primary/5 hover:border-primary/20 hover:scale-105 shadow-sm"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    {t.common.backToSearch}
                </Link>

                <div className="mt-0 md:mt-8">
                    <Breadcrumbs
                        items={[
                            { label: t.common.allListings, href: '/listings' },
                            ...(listing.category
                                ? [
                                    {
                                        label: getLocalizedCategoryName(listing.category, locale, t),
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
                        <div className="shadow-2xl shadow-black/20 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-card/50 backdrop-blur-xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
                            <ImageGallery
                                images={listing.images || []}
                                title={displayTitle}
                            />
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="font-heading text-3xl font-black italic tracking-tight">
                                    {t.listing.itemDescription}
                                </h2>
                                <div className="h-1.5 w-20 rounded-full bg-primary" />
                                <p className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-foreground/80">
                                    {displayDescription}
                                </p>
                            </div>

                            <ListingDetailsGrid listing={listing} />
                        </div>
                    </div>

                    <div className="space-y-8 lg:col-span-4">
                        <div className="shadow-2xl shadow-primary/5 sticky top-28 space-y-8 rounded-[2.5rem] border border-white/10 bg-background/80 backdrop-blur-xl p-6 md:p-8">
                            <div className="space-y-3 pb-6 border-b border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
                                    {t.common.price}
                                </span>

                                {!listing.is_active && (
                                    <div className="mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 animate-pulse">
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
                                    className="text-5xl md:text-6xl font-black tracking-tighter text-foreground block"
                                    showOriginal
                                />
                            </div>

                            {seller && <SellerInfoCard seller={seller} />}

                            <div className="space-y-4 pt-2">
                                <h3 className="font-heading text-xl font-black italic">
                                    {displayTitle}
                                </h3>
                                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="h-4 w-4" />
                                        {listing.views} {t.common.views}
                                    </div>
                                    <div className="h-1 w-1 rounded-full bg-border" />
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        {t.trust.verified}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <Button
                                    size="lg"
                                    className="h-16 w-full rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
                                    onClick={handleContact}
                                    disabled={isContacting}
                                >
                                    {isContacting ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                    )}
                                    {t.listing.contactSeller}
                                </Button>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-14 gap-2 rounded-xl font-bold"
                                        onClick={handleCall}
                                    >
                                        <Phone className="h-5 w-5" />
                                        {showPhone ? seller?.phone || t.listing.call : t.listing.call}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-14 gap-2 rounded-xl font-bold"
                                        onClick={handleContact}
                                        disabled={isContacting}
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        {t.listing.message}
                                    </Button>
                                </div>

                                <ListingOwnerActions
                                    listingId={listing.id}
                                    ownerId={listing.user_id}
                                    className="h-14 w-full gap-2 rounded-xl font-bold border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="h-14 gap-2 rounded-xl font-bold text-muted-foreground hover:text-foreground"
                                    >
                                        <Heart className="h-5 w-5" /> {t.listing.saveListing}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="h-14 gap-2 rounded-xl font-bold text-muted-foreground hover:text-foreground"
                                    >
                                        <Share2 className="h-5 w-5" /> {t.listing.shareListing}
                                    </Button>
                                </div>

                                <div className="flex justify-center pt-2">
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2">
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
