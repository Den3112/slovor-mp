'use client'

import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ListingCard } from '@/components/listing/card'
import { SellerRating } from '@/components/seller-profile/seller-rating'
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
  Loader2,
} from 'lucide-react'
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

export function SellerProfileView({
  seller,
  listings,
  variant = 'public',
}: SellerProfileViewProps) {
  const { t, locale } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const [isContacting, setIsContacting] = useState(false)

  // Calculate member since date
  const memberSince = new Date(seller.created_at).toLocaleDateString(
    locale === 'sk' ? 'sk-SK' : locale === 'cs' ? 'cs-CZ' : 'en-US',
    {
      month: 'long',
      year: 'numeric',
    }
  )

  const [ratingData, setRatingData] = useState<{ averageRating: number; totalReviews: number } | null>(null)

  useState(() => {
    import('@/lib/api').then(({ reviewsApi }) => {
      reviewsApi.getForSeller(seller.id).then(({ data }) => {
        if (data) setRatingData(data)
      })
    })
  })

  const Wrapper = variant === 'public' ? Container : 'div'
  const wrapperProps = variant === 'public' ? {} : { className: 'w-full' }

  const handleContact = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/seller/${seller.id}`)
      return
    }

    if (user.id === seller.id) {
      toast.error('You cannot message yourself')
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
      toast.error('This seller has no active listings to inquire about.')
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
      toast.error('Failed to start conversation')
    } finally {
      setIsContacting(false)
    }
  }

  return (
    <div className={variant === 'public' ? 'min-h-screen pb-20' : 'pb-12'}>
      {/* Breadcrumbs / Back button - Only for public */}
      {variant === 'public' && (
        <Container className="py-6 pt-24 md:pt-32">
          <Link
            href="/listings"
            className="group text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-bold transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t('common.backToSearch')}
          </Link>
        </Container>
      )}

      <Wrapper {...wrapperProps}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Seller Profile Card (Left) */}
          <div className="lg:col-span-4">
            <div
              className={
                variant === 'public' ? 'sticky top-28 space-y-6' : 'space-y-6'
              }
            >
              {/* Main Profile Card - Avant-Garde Redesign */}
              <div className="bg-background/60 relative overflow-hidden rounded-[3rem] border border-white/20 shadow-2xl backdrop-blur-3xl dark:border-white/5 dark:bg-black/40">
                {/* Decorative Gradient Blurs */}
                <div className="bg-primary/20 pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full blur-[100px]" />
                <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/20 blur-[100px]" />

                <div className="relative p-8 px-6 sm:px-10">
                  {/* Avatar with Glow */}
                  <div className="flex flex-col items-center text-center">
                    <div className="group relative mb-8">
                      <div className="from-primary absolute inset-0 rounded-full bg-linear-to-tr to-purple-500 opacity-40 blur-2xl transition-opacity duration-700 group-hover:opacity-60" />
                      <div className="relative">
                        {seller.avatar_url ? (
                          <Image
                            src={seller.avatar_url}
                            alt={seller.display_name ?? seller.username ?? ''}
                            width={128}
                            height={128}
                            unoptimized
                            className="border-background relative z-10 h-32 w-32 rounded-full border-[6px] object-cover shadow-2xl"
                          />
                        ) : (
                          <div className="border-background bg-muted relative z-10 flex h-32 w-32 items-center justify-center rounded-full border-[6px]">
                            <User className="text-muted-foreground/50 h-12 w-12" />
                          </div>
                        )}
                        {seller.verified && (
                          <div className="bg-background absolute -right-1 -bottom-1 z-20 rounded-full p-1.5 shadow-lg">
                            <div className="rounded-full bg-blue-500 p-1.5">
                              <ShieldCheck className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name & Badge */}
                    <div className="mb-6 space-y-1">
                      <h1 className="font-heading from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-3xl font-black tracking-tight text-transparent">
                        {seller.display_name ?? seller.username}
                      </h1>
                      {seller.verified && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1">
                          <ShieldCheck className="h-3 w-3 text-blue-500" />
                          <span className="text-[10px] font-bold tracking-wider text-blue-500 uppercase">
                            {t('trust.verified')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {seller.bio && (
                      <p className="text-muted-foreground mx-auto mb-8 max-w-xs text-sm leading-relaxed font-medium">
                        {seller.bio}
                      </p>
                    )}

                    {/* Stats - Minimalist Row */}
                    <div className="border-border/40 grid w-full grid-cols-2 gap-8 border-t py-8">
                      <div className="group cursor-default text-center">
                        <p className="from-foreground to-foreground/50 bg-linear-to-b bg-clip-text text-3xl font-black text-transparent transition-all group-hover:scale-110">
                          {listings.length}
                        </p>
                        <p className="text-muted-foreground/70 mt-1 text-[10px] font-bold tracking-widest uppercase">
                          {t('seller.activeListings')}
                        </p>
                      </div>
                      <div className="group cursor-default text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="from-foreground to-foreground/50 bg-linear-to-b bg-clip-text text-3xl font-black text-transparent transition-all group-hover:scale-110">
                            {ratingData?.averageRating || '—'}
                          </span>
                          <Star className="mb-1 h-4 w-4 fill-amber-500 text-amber-500" />
                        </div>
                        <p className="text-muted-foreground/70 mt-1 text-[10px] font-bold tracking-widest uppercase">
                          {t('seller.rating')}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info - Clustered */}
                    <div className="flex w-full flex-col gap-3 text-sm">
                      {seller.location && (
                        <div className="text-muted-foreground bg-muted/30 flex items-center justify-center gap-2 rounded-xl p-2">
                          <MapPin className="text-primary h-4 w-4" />
                          <span className="text-foreground font-semibold">
                            {seller.location}
                          </span>
                        </div>
                      )}
                      <div className="text-muted-foreground mt-1 flex items-center justify-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span
                          className="text-xs font-medium opacity-70"
                          suppressHydrationWarning
                        >
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
                  className="shadow-primary/20 h-16 w-full rounded-2xl text-lg font-black shadow-xl"
                  onClick={handleContact}
                  disabled={isContacting}
                >
                  {isContacting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <MessageCircle className="mr-2 h-5 w-5" />
                  )}
                  {t('seller.contactSeller')}
                </Button>
              ) : (
                <Link href="/dashboard/settings" className="block">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-full rounded-2xl border-2 text-lg font-bold"
                  >
                    Edit Profile
                  </Button>
                </Link>
              )}

              {/* Safety info only on public */}
              {variant === 'public' && (
                <div className="border-primary/10 bg-primary/5 rounded-2xl border p-6">
                  <div className="flex gap-4">
                    <ShieldCheck className="text-primary h-6 w-6 shrink-0" />
                    <div>
                      <p className="text-foreground text-sm font-bold">
                        {t('trust.safetyTitle')}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs font-medium">
                        {t('trust.safetyTip1')}
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
                <h2 className="font-heading mb-2 text-3xl font-black tracking-tight italic">
                  {t('seller.listings')}
                </h2>
                <div className="bg-primary h-1.5 w-20 rounded-full" />
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
                  title={t('seller.noListings')}
                  description={t('seller.noListingsDescription')}
                />
              )}
            </div>
          )}
        </div>
      </Wrapper>
    </div>
  )
}
