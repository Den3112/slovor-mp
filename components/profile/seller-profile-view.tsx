'use client'

import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ListingCard } from '@/components/listing/card'
import { SellerRating } from '@/components/profile/seller-rating'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import {
    ArrowLeft,
    ShieldCheck,
    MessageCircle,
    Loader2,
} from 'lucide-react'
import { SellerProfileCard } from './details/seller-profile-card'
import type { Profile } from '@/lib/types/database'
import type { Listing } from '@/lib/api'
import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { messagesApi } from '@/lib/api/messages'
import { toast } from 'sonner'
import { useState } from 'react'

interface SellerProfileViewProps {
    seller: Profile
    listings: Listing[]
    variant?: 'public' | 'dashboard'
}

export function SellerProfileView({ seller, listings, variant = 'public' }: SellerProfileViewProps) {
    const { t } = useTranslation()
    const { user } = useAuth()
    const router = useRouter()
    const [isContacting, setIsContacting] = useState(false)



    const Wrapper = variant === 'public' ? Container : 'div'
    const wrapperProps = variant === 'public' ? {} : { className: "w-full" }

    const handleContact = async () => {
        if (!user) {
            router.push(`/auth/login?redirect=/seller/${seller.id}`)
            return
        }

        if (user.id === seller.id) {
            toast.error("You cannot message yourself")
            return
        }

        // For seller profile, we need a listing context for the conversation if possible.
        // However, the current API `getOrCreateConversation` requires a listing ID.
        // If we initiate from profile, we might not have a specific listing.
        // But checking `messages.ts` (step 807), `listing_id` IS required in DB schema probably.
        // Let's check `d:/slovor-mp/lib/api/messages.ts` again.
        // Schema: listing_id is required.
        // Hmmm. If we contact from seller profile, usually we want to ask about a specific item or just general?
        // If general, we might need a "General" conversation or just pick the first active listing?
        // Or maybe redirect to their first listing?
        // For now, I will try to use the first active listing if available, or error out saying "Select a listing to contact".

        if (listings.length === 0) {
            toast.error("This seller has no active listings to inquire about.")
            return
        }

        // Use the most recent listing as context
        const contextListing = listings[0]

        if (!contextListing) return

        setIsContacting(true)
        try {
            const { data, error } = await messagesApi.getOrCreateConversation(
                contextListing.id,
                user.id,
                seller.id
            )

            if (error) throw new Error(error)

            if (data) {
                router.push(`/messages/${data.id}`)
            }
        } catch (error) {
            console.error('Failed to start conversation:', error)
            toast.error("Failed to start conversation")
        } finally {
            setIsContacting(false)
        }
    }

    return (
        <div className={variant === 'public' ? "min-h-screen pb-20" : "pb-12"}>
            {/* Breadcrumbs / Back button - Only for public */}
            {variant === 'public' && (
                <Container className="py-6 pt-24 md:pt-36">
                    <Link
                        href="/listings"
                        className="group inline-flex items-center gap-3 border-2 border-primary/20 bg-background/50 px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest text-zinc-500 transition-all hover:border-primary hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        {t.common.backToSearch}
                    </Link>
                </Container>
            )}

            <Wrapper {...wrapperProps}>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Seller Profile Card (Left) */}
                    <div className="lg:col-span-4">
                        <div className={variant === 'public' ? "sticky top-32 space-y-8" : "space-y-8"}>
                            {/* Main Profile Card - Avant-Garde Redesign */}
                            <SellerProfileCard seller={seller} listingCount={listings.length} />

                            {/* Actions */}
                            {variant === 'public' ? (
                                <Button
                                    size="lg"
                                    className="h-16 w-full rounded-none font-sans text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30"
                                    onClick={handleContact}
                                    disabled={isContacting}
                                >
                                    {isContacting ? (
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                    ) : (
                                        <MessageCircle className="mr-3 h-5 w-5" />
                                    )}
                                    {t.seller.contactSeller}
                                </Button>
                            ) : (
                                <Link href="/profile/settings" className="block">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-16 w-full rounded-none border-2 border-primary/20 bg-background font-sans text-xs font-bold uppercase tracking-[0.2em] transition-all hover:border-primary active:scale-95"
                                    >
                                        Edit Profile
                                    </Button>
                                </Link>
                            )}

                            {/* Safety info only on public */}
                            {variant === 'public' && (
                                <div className="border-2 border-primary/10 bg-zinc-950 p-8 shadow-xl">
                                    <div className="flex gap-6">
                                        <ShieldCheck className="h-8 w-8 shrink-0 text-primary" />
                                        <div>
                                            <p className="font-sans text-xs font-bold uppercase tracking-widest text-white">
                                                {t.trust.safetyTitle}
                                            </p>
                                            <p className="mt-2 font-sans text-[10px] font-medium leading-relaxed tracking-wide text-zinc-500">
                                                {t.trust.safetyTip1}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Seller Reviews */}
                            <SellerRating sellerId={seller.id} />
                        </div>
                    </div>

                    {/* Seller Listings (Right) - Only show in public mode */}
                    {variant === 'public' && (
                        <div className="space-y-12 lg:col-span-8">
                            <div>
                                <h2 className="mb-4 font-heading text-5xl font-bold italic tracking-tight text-white">
                                    {t.seller.listings}
                                </h2>
                                <div className="h-2 w-24 bg-primary" />
                            </div>

                            {listings.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                    {listings.map((listing) => (
                                        <ListingCard key={listing.id} listing={listing} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon="📦"
                                    title={t.seller.noListings}
                                    description={t.seller.noListingsDescription}
                                />
                            )}
                        </div>
                    )}
                </div>
            </Wrapper>
        </div>
    )
}
