import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { ListingCard } from '@/components/listing/card'
import { SellerRating } from '@/components/profile/SellerRating'
import { getTranslationServer } from '@/lib/i18n/server'
import Link from 'next/link'
import Image from 'next/image'
import {
    ArrowLeft,
    MapPin,
    Calendar,
    ShieldCheck,
    Star,
    Package,
    MessageCircle,
    User,
} from 'lucide-react'

interface Props {
    params: Promise<{
        id: string
    }>
}

export default async function SellerProfilePage({ params }: Props) {
    const { id } = await params
    const { t } = await getTranslationServer()
    const supabase = await createClient()

    // Fetch seller profile
    const { data: seller, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (profileError) {
        return <ErrorState message={profileError.message} />
    }

    if (!seller) {
        notFound()
    }

    // Fetch seller's active listings
    const { data: rawListings } = await supabase
        .from('listings')
        .select(`
            *,
            seller:users(*),
            category:categories(*)
        `)
        .eq('user_id', id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    const listings = rawListings || []


    // Calculate member since date
    const memberSince = new Date(seller.created_at).toLocaleDateString('sk-SK', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="min-h-screen pb-20">
            {/* Breadcrumbs / Back button */}
            <Container className="py-6 pt-24 md:pt-32">
                <Link
                    href="/listings"
                    className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    {t.common.backToSearch}
                </Link>
            </Container>

            <Container>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Seller Profile Card (Left) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-6">
                            {/* Main Profile Card */}
                            <div className="shadow-premium overflow-hidden rounded-[2.5rem] border border-border/50 bg-card p-8">
                                {/* Avatar */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        {seller.avatar_url ? (
                                            <Image
                                                src={seller.avatar_url}
                                                alt={seller.display_name ?? seller.username}
                                                width={120}
                                                height={120}
                                                unoptimized
                                                className="rounded-full border-4 border-primary/20 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-4 border-primary/20 bg-muted">
                                                <User className="h-16 w-16 text-muted-foreground" />
                                            </div>
                                        )}
                                        {seller.verified && (
                                            <div className="absolute -bottom-2 -right-2 rounded-full bg-emerald-500 p-2 shadow-lg">
                                                <ShieldCheck className="h-5 w-5 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <h1 className="mb-2 font-heading text-2xl font-black">
                                        {seller.display_name ?? seller.username}
                                    </h1>

                                    {/* Verified Badge */}
                                    {seller.verified && (
                                        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            {t.trust.verified}
                                        </span>
                                    )}

                                    {/* Bio */}
                                    {seller.bio && (
                                        <p className="mb-6 text-sm text-muted-foreground">
                                            {seller.bio}
                                        </p>
                                    )}

                                    {/* Stats */}
                                    <div className="mb-6 w-full border-t border-border/50 pt-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-2xl bg-muted/30 p-4 text-center">
                                                <Package className="mx-auto mb-2 h-6 w-6 text-primary" />
                                                <p className="text-2xl font-black">{listings.length}</p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    {t.seller.activeListings}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-muted/30 p-4 text-center">
                                                <Star className="mx-auto mb-2 h-6 w-6 text-amber-500" />
                                                <p className="text-2xl font-black">—</p>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    {t.seller.rating}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="w-full space-y-3 border-t border-border/50 pt-6 text-left">
                                        {seller.location && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                <span className="font-medium">{seller.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            <span className="font-medium">
                                                {t.seller.memberSince} {memberSince}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Button */}
                            <Button
                                size="lg"
                                className="h-16 w-full rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
                            >
                                <MessageCircle className="mr-2 h-5 w-5" />
                                {t.seller.contactSeller}
                            </Button>

                            {/* Safety Tip */}
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

                            {/* Seller Reviews */}
                            <SellerRating sellerId={id} />
                        </div>
                    </div>

                    {/* Seller Listings (Right) */}
                    <div className="space-y-8 lg:col-span-8">
                        <div>
                            <h2 className="mb-2 font-heading text-3xl font-black italic tracking-tight">
                                {t.seller.listings}
                            </h2>
                            <div className="h-1.5 w-20 rounded-full bg-primary" />
                        </div>

                        {listings.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                </div>
            </Container>
        </div>
    )
}
