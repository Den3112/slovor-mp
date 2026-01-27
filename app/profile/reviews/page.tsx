'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { reviewsApi, type SellerRating, type Review } from '@/lib/api'
import { EmptyState } from '@/components/ui/empty-state'
import { Star, User, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

import { useTranslation } from '@/lib/i18n'

export default function ReviewsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [ratingData, setRatingData] = useState<SellerRating | null>(null)
  const [givenReviews, setGivenReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received')

  useEffect(() => {
    async function loadReviews() {
      if (!user) return

      try {
        const [receivedRes, givenRes] = await Promise.all([
          reviewsApi.getForSeller(user.id),
          reviewsApi.getByAuthor(user.id)
        ])

        if (receivedRes.data) setRatingData(receivedRes.data)
        if (givenRes.data) setGivenReviews(givenRes.data)
      } catch (error) {
        console.error('Failed to load reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadReviews()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  const reviews = activeTab === 'received' ? (ratingData?.reviews || []) : givenReviews

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="from-background/80 via-background/60 to-background/40 group relative flex flex-col gap-4 overflow-hidden rounded-5xl border border-white/10 bg-linear-to-br p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-amber-500/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
          <h1 className="font-heading text-foreground mb-2 text-4xl font-black tracking-tight md:text-5xl italic">
            {t('reviews.title')}
          </h1>
          <p className="text-muted-foreground max-w-lg text-base leading-relaxed font-medium md:text-lg">
            {t('reviews.manageReputation')}
          </p>
        </div>
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 shadow-2xl shadow-amber-500/20">
          <Star className="h-10 w-10 fill-current" />
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-1.5 w-fit">
        <button
          onClick={() => setActiveTab('received')}
          className={cn(
            "rounded-xl px-6 py-2.5 text-sm font-black uppercase tracking-widest transition-all",
            activeTab === 'received' ? "bg-card text-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t('reviews.received')}
        </button>
        <button
          onClick={() => setActiveTab('given')}
          className={cn(
            "rounded-xl px-6 py-2.5 text-sm font-black uppercase tracking-widest transition-all",
            activeTab === 'given' ? "bg-card text-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t('reviews.given')}
        </button>
      </div>

      {activeTab === 'received' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border-border/50 bg-card rounded-4xl border p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                <Star className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                  {t('reviews.rating')}
                </p>
                <p className="font-heading text-2xl font-black">
                  {ratingData?.averageRating || 0}
                  <span className="text-muted-foreground text-sm font-medium">/5.0</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-border/50 bg-card rounded-4xl border p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                <User className="text-primary h-6 w-6" />
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                  {t('reviews.totalReviews')}
                </p>
                <p className="font-heading text-2xl font-black">
                  {ratingData?.totalReviews || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => {
            const userDisplay = activeTab === 'received' ? review.author : (review as any).recipient
            return (
              <div
                key={review.id}
                className="group border-border/50 bg-card hover:border-primary/20 hover:shadow-primary/5 relative overflow-hidden rounded-4xl border p-6 transition-all hover:shadow-xl"
              >
                <div className="flex gap-6">
                  <div className="bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl shadow-inner">
                    {userDisplay?.avatar_url ? (
                      <Image
                        src={userDisplay.avatar_url}
                        alt={userDisplay.display_name || ''}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted-foreground/10">
                        <User className="text-muted-foreground/40 h-7 w-7" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-foreground font-black text-lg">
                          {userDisplay?.display_name || t('reviews.anonymous')}
                        </p>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                          <span>{new Date(review.created_at).toLocaleDateString()}</span>
                          {review.listing && (
                            <>
                              <span className="opacity-30">•</span>
                              <span className="text-primary font-bold">{review.listing.title}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 bg-amber-500/5 p-1.5 rounded-xl w-fit">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              'h-4 w-4 transition-all',
                              star <= review.rating
                                ? 'fill-amber-400 text-amber-400 group-hover:scale-110'
                                : 'text-muted-foreground/20'
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {review.comment && (
                      <div className="bg-muted/30 relative rounded-2xl p-5 border border-transparent group-hover:bg-muted/50 group-hover:border-border/50 transition-all">
                        <p className="text-foreground/80 text-sm italic font-medium leading-relaxed">
                          &quot;{review.comment}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title={t('reviews.noReviews')}
          description={t('reviews.noReviewsDesc')}
          actionLabel={t('reviews.backToListings')}
          actionHref="/listings"
        />
      )}
    </div>
  )
}
