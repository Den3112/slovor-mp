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
  const [ratingData, setRatingData] = useState<{ averageRating: number; totalReviews: number } | null>(null)

  useEffect(() => {
    import('@/lib/api').then(({ reviewsApi }) => {
      reviewsApi.getForSeller(seller.id).then(({ data }) => {
        if (data) setRatingData(data)
      })
    })
  }, [seller.id])

  // Calculate member since date
  const memberSince = new Date(seller.created_at).toLocaleDateString(
    locale === 'sk' ? 'sk-SK' : locale === 'cs' ? 'cs-CZ' : 'en-US',
    {
      month: 'long',
      year: 'numeric',
    }
  )

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
    <div className={variant === 'public' ? 'min-h-screen bg-background pb-20' : 'pb-12'}>
      {/* Breadcrumbs / Back button - Only for public */}
      {variant === 'public' && (
        <Container className="py-6 pt-24 md:pt-32">
          <Link
            href="/listings"
            className="group text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-bold transition-all"
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
            <div className={variant === 'public' ? 'sticky top-32 space-y-6' : 'space-y-6'}>
              {/* Main Profile Card - Solid Redesign */}
              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 space-y-8">
                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      {seller.avatar_url ? (
                        <Image
                          src={seller.avatar_url}
                          alt={seller.display_name ?? seller.username ?? ''}
                          width={120}
                          height={120}
                          unoptimized
                          className="h-28 w-28 rounded-xl border border-border object-cover shadow-sm"
                        />
                      ) : (
                        <div className="bg-muted flex h-28 w-28 items-center justify-center rounded-xl border border-border">
                          <User className="text-muted-foreground/30 h-10 w-10" />
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
                      <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic leading-tight">
                        {seller.display_name ?? seller.username}
                      </h1>
                      {seller.verified && (
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1">
                          <ShieldCheck className="h-3 w-3 text-blue-500" />
                          <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">
                            {t('trust.verified')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {seller.bio && (
                      <p className="text-muted-foreground mt-6 text-sm font-medium leading-relaxed italic">
                        {seller.bio}
                      </p>
                    )}

                    {/* Stats - Solid Row */}
                    <div className="grid w-full grid-cols-2 gap-4 pt-8 mt-8 border-t border-border">
                      <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/50">
                        <p className="text-2xl font-black text-foreground">
                          {listings.length}
                        </p>
                        <p className="text-muted-foreground mt-1 text-[9px] font-black tracking-widest uppercase opacity-60">
                          {t('seller.activeListings')}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/50">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-2xl font-black text-foreground">
                            {ratingData?.averageRating || '—'}
                          </span>
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        </div>
                        <p className="text-muted-foreground mt-1 text-[9px] font-black tracking-widest uppercase opacity-60">
                          {t('seller.rating')}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="w-full space-y-3 pt-6">
                      {seller.location && (
                        <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest bg-muted/20 py-3 rounded-lg border border-border/40">
                          <MapPin className="text-primary h-3.5 w-3.5" />
                          <span className="text-foreground">
                            {seller.location}
                          </span>
                        </div>
                      )}
                      <div className="text-muted-foreground flex items-center justify-center gap-2 pt-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                          {t('seller.memberSince')} {memberSince}
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
                  className="w-full rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20"
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
                    variant="outline"
                    size="xl"
                    className="w-full rounded-xl border border-border font-black uppercase tracking-widest hover:bg-muted"
                  >
                    Edit Profile
                  </Button>
                </Link>
              )}

              {/* Safety info - Solid style */}
              {variant === 'public' && (
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20">
                      <ShieldCheck className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-black uppercase tracking-tight italic">
                        {t('trust.safetyTitle')}
                      </p>
                      <p className="text-muted-foreground mt-2 text-xs font-medium leading-relaxed">
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
            <div className="space-y-10 lg:col-span-8">
              <div className="flex items-center justify-between border-b border-border pb-6">
                <h2 className="text-2xl font-black tracking-tight italic uppercase">
                  {t('seller.listings')}
                </h2>
                <span className="bg-muted text-muted-foreground rounded-lg px-3 py-1 text-[10px] font-black tracking-widest uppercase border border-border">
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
