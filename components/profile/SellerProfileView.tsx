'use client'

import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ListingCard } from '@/components/listing/card'
import { SellerRating } from '@/components/profile/SellerRating'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import Image from 'next/image'
import {
    ArrowLeft,
    MapPin,
    Calendar,
    ShieldCheck,
    Star,
    MessageCircle,
    User,
} from 'lucide-react'
import type { Profile } from '@/lib/types/database'
import type { Listing } from '@/lib/api'

interface SellerProfileViewProps {
    seller: Profile
    listings: Listing[]
    variant?: 'public' | 'dashboard'
}

export function SellerProfileView({ seller, listings, variant = 'public' }: SellerProfileViewProps) {
    const { t, locale } = useTranslation()

    // Calculate member since date
    const memberSince = new Date(seller.created_at).toLocaleDateString(locale === 'sk' ? 'sk-SK' : locale === 'cs' ? 'cs-CZ' : 'en-US', {
        month: 'long',
        year: 'numeric',
    })

    const Wrapper = variant === 'public' ? Container : 'div'
    const wrapperProps = variant === 'public' ? {} : { className: "w-full" }

    return (
        <div className={variant === 'public' ? "min-h-screen pb-20" : "pb-12"}>
            {/* Breadcrumbs / Back button - Only for public */}
            {variant === 'public' && (
                <Container className="py-6 pt-24 md:pt-32">
                    <Link
                        href="/listings"
                        className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        {t.common.backToSearch}
                    </Link>
                </Container>
            )}

            <Wrapper {...wrapperProps}>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Seller Profile Card (Left) */}
                    <div className="lg:col-span-4">
                        <div className={variant === 'public' ? "sticky top-28 space-y-6" : "space-y-6"}>
                            {/* Main Profile Card - Avant-Garde Redesign */}
                            <div className="relative overflow-hidden rounded-[3rem] border border-white/20 bg-background/60 backdrop-blur-3xl shadow-2xl dark:border-white/5 dark:bg-black/40">
                                {/* Decorative Gradient Blurs */}
                                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
                                <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/20 blur-[100px] pointer-events-none" />

                                <div className="relative p-8 px-6 sm:px-10">
                                    {/* Avatar with Glow */}
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative mb-8 group">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-purple-500 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                                            <div className="relative">
                                                {seller.avatar_url ? (
                                                    <Image
                                                        src={seller.avatar_url}
                                                        alt={seller.display_name ?? seller.username ?? ''}
                                                        width={128}
                                                        height={128}
                                                        unoptimized
                                                        className="h-32 w-32 rounded-full border-[6px] border-background object-cover shadow-2xl relative z-10"
                                                    />
                                                ) : (
                                                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-background bg-muted relative z-10">
                                                        <User className="h-12 w-12 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                                {seller.verified && (
                                                    <div className="absolute -bottom-1 -right-1 z-20 rounded-full bg-background p-1.5 shadow-lg">
                                                        <div className="rounded-full bg-blue-500 p-1.5">
                                                            <ShieldCheck className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Name & Badge */}
                                        <div className="space-y-1 mb-6">
                                            <h1 className="font-heading text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                                {seller.display_name ?? seller.username}
                                            </h1>
                                            {seller.verified && (
                                                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1">
                                                    <ShieldCheck className="h-3 w-3 text-blue-500" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                                                        {t.trust.verified}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bio */}
                                        {seller.bio && (
                                            <p className="mb-8 text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto font-medium">
                                                {seller.bio}
                                            </p>
                                        )}

                                        {/* Stats - Minimalist Row */}
                                        <div className="grid grid-cols-2 gap-8 w-full border-t border-border/40 py-8">
                                            <div className="text-center group cursor-default">
                                                <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 transition-all group-hover:scale-110">
                                                    {listings.length}
                                                </p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                                                    {t.seller.activeListings}
                                                </p>
                                            </div>
                                            <div className="text-center group cursor-default">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 transition-all group-hover:scale-110">
                                                        —
                                                    </span>
                                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500 mb-1" />
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                                                    {t.seller.rating}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Meta Info - Clustered */}
                                        <div className="w-full flex flex-col gap-3 text-sm">
                                            {seller.location && (
                                                <div className="flex items-center justify-center gap-2 text-muted-foreground p-2 rounded-xl bg-muted/30">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    <span className="font-semibold text-foreground">{seller.location}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground mt-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span className="font-medium text-xs opacity-70" suppressHydrationWarning>
                                                    Joined {memberSince}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {variant === 'public' ? (
                                <Button
                                    size="lg"
                                    className="h-16 w-full rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
                                >
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    {t.seller.contactSeller}
                                </Button>
                            ) : (
                                <Link href="/profile/settings" className="block">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-14 w-full rounded-2xl text-lg font-bold border-2"
                                    >
                                        Edit Profile
                                    </Button>
                                </Link>
                            )}

                            {/* Safety info only on public */}
                            {variant === 'public' && (
                                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6">
                                    <div className="flex gap-4">
                                        <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                {t.trust.safetyTitle}
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-muted-foreground">
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
                        <div className="space-y-8 lg:col-span-8">
                            <div>
                                <h2 className="mb-2 font-heading text-3xl font-black italic tracking-tight">
                                    {t.seller.listings}
                                </h2>
                                <div className="h-1.5 w-20 rounded-full bg-primary" />
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
