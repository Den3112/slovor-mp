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
import { useState, useEffect } from 'react'

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
  const { t, locale } = useTranslation(['seller', 'common', 'listing', 'trust'])
  const { user } = useAuth()
  const router = useRouter()
  const [isContacting, setIsContacting] = useState(false)
  const [ratingData, setRatingData] = useState<{
    averageRating: number
    totalReviews: number
  } | null>(null)

  useEffect(() => {
    import('@/lib/api').then(({ reviewsApi }) => {
      reviewsApi.getForSeller(seller.id).then(({ data }) => {
        if (data) setRatingData(data)
      })
    })
  }, [seller.id])

  // Calculate member since date
  const memberSince = new Date(seller.created_at).toLocaleDateString(
    locale === 'sk'
      ? 'sk-SK'
      : locale === 'cs'
        ? 'cs-CZ'
        : locale === 'ru'
          ? 'ru-RU'
          : 'en-US',
    {
      month: 'long',
      year: 'numeric',
    }
  )

  const Wrapper = variant === 'public' ? Container : 'div'
  const wrapperProps = variant === 'public' ? {} : { className: 'w-full' }

  const handleContact = async () => {
    if (!user) {
      router.push(`/${locale}/auth/login?redirect=/seller/${seller.id}`)
      return
    }

    if (user.id === seller.id) {
      toast.error('You cannot message yourself')
      return
    }

    if (listings.length === 0) {
      toast.error('This seller has no active listings to inquire about.')
      return
    }

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
        router.push(`/${locale}/messages/${data.id}`)
      }
    } catch (error) {
      console.error('Failed to start conversation:', error)
      toast.error('Failed to start conversation')
    } finally {
      setIsContacting(false)
    }
  }

  return (
    <div
      className={
        variant === 'public' ? 'bg-background min-h-screen pb-20' : 'pb-12'
      }
    >
      {/* Breadcrumbs / Back button - Only for public */}
      {variant === 'public' && (
        <Container className="py-6 pt-24 md:pt-32">
          <Link
            href={`/${locale}/listings`}
            className="group text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-bold transition-all"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t('common:backToSearch')}
          </Link>
        </Container>
      )}

      <Wrapper {...wrapperProps}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Seller Profile Card (Left) */}
          <div className="lg:col-span-4">
            <div
              className={
                variant === 'public' ? 'sticky top-32 space-y-6' : 'space-y-6'
              }
            >
              {/* Main Profile Card - Solid Redesign */}
              <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
                <div className="space-y-8 p-8">
                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      {seller.avatar_url ? (
                        <Image
                          src={seller.avatar_url}
                          alt={seller.display_name ?? seller.username ?? ''}
                          width={112}
                          height={112}
                          unoptimized
                          className="border-border h-24 w-24 rounded-xl border object-cover shadow-sm sm:h-28 sm:w-28"
                        />
                      ) : (
                        <div className="bg-muted border-border flex h-24 w-24 items-center justify-center rounded-xl border sm:h-28 sm:w-28">
                          <User className="text-muted-foreground/30 h-8 w-8 sm:h-10 sm:w-10" />
                        </div>
                      )}
                      {seller.verified && (
                        <div className="absolute -right-2 -bottom-2 rounded-lg bg-blue-500 p-1.5 text-white shadow-lg shadow-blue-500/20">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    {/* Name & Badge */}
                    <div className="space-y-3">
                      <h1 className="text-foreground text-xl leading-tight font-bold tracking-tight uppercase sm:text-2xl">
                        {seller.display_name ?? seller.username}
                      </h1>
                      {seller.verified && (
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1">
                          <ShieldCheck className="h-3 w-3 text-blue-500" />
                          <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">
                            {t('trust:verified')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {seller.bio && (
                      <p className="text-muted-foreground mt-6 text-sm leading-relaxed font-medium">
                        {seller.bio}
                      </p>
                    )}

                    {/* Stats - Solid Row */}
                    <div className="border-border mt-8 grid w-full grid-cols-2 gap-4 border-t pt-8">
                      <div className="bg-muted/30 border-border/50 rounded-xl border p-4 text-center">
                        <p className="text-foreground text-2xl font-bold">
                          {listings.length}
                        </p>
                        <p className="text-muted-foreground mt-1 text-[9px] font-bold tracking-widest uppercase opacity-60">
                          {t('seller:activeListings')}
                        </p>
                      </div>
                      <div className="bg-muted/30 border-border/50 rounded-xl border p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-foreground text-2xl font-bold">
                            {ratingData?.averageRating || '—'}
                          </span>
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        </div>
                        <p className="text-muted-foreground mt-1 text-[9px] font-bold tracking-widest uppercase opacity-60">
                          {t('seller:rating')}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="w-full space-y-3 pt-6">
                      {seller.location && (
                        <div className="text-muted-foreground bg-muted/20 border-border/40 flex items-center justify-center gap-2 rounded-lg border py-3 text-xs font-bold tracking-widest uppercase">
                          <MapPin className="text-primary h-3.5 w-3.5" />
                          <span className="text-foreground">
                            {seller.location}
                          </span>
                        </div>
                      )}
                      <div className="text-muted-foreground flex items-center justify-center gap-2 pt-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">
                          {t('seller:memberSince')} {memberSince}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {variant === 'public' ? (
                <Button
                  size="xl"
                  className="shadow-primary/20 w-full rounded-xl font-bold tracking-widest uppercase shadow-lg"
                  onClick={handleContact}
                  disabled={isContacting}
                >
                  {isContacting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <MessageCircle className="mr-2 h-5 w-5" />
                  )}
                  {t('seller:contactSeller')}
                </Button>
              ) : (
                <Link href={`/${locale}/dashboard/settings`} className="block">
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-border hover:bg-muted w-full rounded-xl border font-bold tracking-widest uppercase"
                  >
                    Edit Profile
                  </Button>
                </Link>
              )}

              {/* Safety info - Solid style */}
              {variant === 'public' && (
                <div className="bg-card border-border rounded-xl border p-8 shadow-sm">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 border-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                      <ShieldCheck className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-bold tracking-tight uppercase">
                        {t('trust:safetyTitle')}
                      </p>
                      <p className="text-muted-foreground mt-2 text-xs leading-relaxed font-medium">
                        {t('trust:safetyTip1')}
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
            <div className="space-y-10 lg:col-span-8">
              <div className="border-border flex items-center justify-between border-b pb-6">
                <h2 className="text-2xl font-bold tracking-tight uppercase">
                  {t('seller:listings')}
                </h2>
                <span className="bg-muted text-muted-foreground border-border rounded-lg border px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                  {listings.length} items
                </span>
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
                  title={t('seller:noListings')}
                  description={t('seller:noListingsDescription')}
                />
              )}
            </div>
          )}
        </div>
      </Wrapper>
    </div>
  )
}
