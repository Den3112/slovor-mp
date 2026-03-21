'use client'

import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ListingCard } from '@/components/features/listing/ui/card'
import { SellerRating } from '@/components/seller-profile/seller-rating'
import { ProfileCard } from '@/components/seller-profile/profile-card'
import { PremiumBackground } from '@/components/ui/premium-background'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import {
  ArrowLeft,
  MessageCircle,
  Loader2,
  Package,
  ShieldCheck,
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
        router.push(`/${locale}/dashboard/messages/${data.id}`)
      }
    } catch (error) {
      console.error('Failed to start conversation:', error)
      toast.error('Failed to start conversation')
    } finally {
      setIsContacting(false)
    }
  }

  return (
    <PremiumBackground
      variant="mesh"
      className={variant === 'public' ? 'pb-20' : 'pb-12'}
    >
      {/* Breadcrumbs / Back button - Only for public */}
      {variant === 'public' && (
        <Container className="animate-in fade-in slide-in-from-left-4 py-6 pt-24 duration-700 md:pt-32">
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 lg:col-span-4">
            <div
              className={
                variant === 'public' ? 'sticky top-32 space-y-6' : 'space-y-6'
              }
            >
              <ProfileCard
                seller={seller}
                listingsCount={listings.length}
                ratingData={ratingData}
                memberSince={memberSince}
              />

              {/* Actions */}
              {variant === 'public' ? (
                <Button
                  size="xl"
                  className="bg-primary text-primary-foreground relative w-full overflow-hidden rounded-xl font-bold tracking-widest uppercase shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                  onClick={handleContact}
                  disabled={isContacting}
                >
                  <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100" />
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
                    className="border-border hover:bg-accent hover:border-primary/20 w-full rounded-xl border font-bold tracking-widest uppercase transition-all"
                  >
                    {t('profile:settings')}
                  </Button>
                </Link>
              )}

              {/* Safety info - Glass style */}
              {variant === 'public' && (
                <div className="bg-card border-border rounded-2xl border p-8 shadow-lg">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 border-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-inner">
                      <ShieldCheck className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-bold tracking-tight uppercase">
                        {t('trust:safetyTitle')}
                      </p>
                      <p className="text-muted-foreground/80 mt-2 text-xs leading-relaxed font-medium">
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
          {variant === 'public' && (listings.length > 0 || true) && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-10 delay-300 duration-700 lg:col-span-8">
              <div className="border-border flex items-center justify-between border-b pb-6">
                <div>
                  <h1 className="text-foreground text-3xl font-black tracking-tight uppercase sm:text-4xl">
                    {t('seller:listings')}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm font-medium">
                    {t('seller:allListingsFrom', {
                      defaultValue: 'All listings from this seller',
                    })}
                  </p>
                </div>
                <div className="bg-primary/5 text-primary border-primary/20 rounded-2xl border px-4 py-2 text-xs font-bold tracking-widest uppercase">
                  {listings.length} items
                </div>
              </div>

              {listings.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {listings.map((listing, index) => (
                    <div
                      key={listing.id}
                      className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                      style={{ animationDelay: `${(index + 2) * 100}ms` }}
                    >
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Package}
                  title={t('seller:noListings')}
                  description={t('seller:noListingsDescription')}
                />
              )}
            </div>
          )}
        </div>
      </Wrapper>
    </PremiumBackground>
  )
}
