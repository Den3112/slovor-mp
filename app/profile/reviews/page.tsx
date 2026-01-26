'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { reviewsApi, type SellerRating } from '@/lib/api'
import { EmptyState } from '@/components/ui/empty-state'
import { Star, User, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

import { useTranslation } from '@/lib/i18n'

export default function ReviewsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [ratingData, setRatingData] = useState<SellerRating | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadReviews() {
      if (!user) return

      try {
        console.log('Fetching reviews for user:', user.id)
        const { data, error } = await reviewsApi.getForSeller(user.id)
        console.log('Reviews API response:', { data, error })
        if (data) {
          setRatingData(data)
        }
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

  const reviews = ratingData?.reviews || []

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="from-background/80 via-background/60 to-background/40 group relative flex flex-col gap-4 overflow-hidden rounded-5xl border border-white/10 bg-linear-to-br p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-amber-500/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
          <h1 className="font-heading text-foreground mb-2 text-4xl font-black tracking-tight md:text-5xl">
            {t.reviews.title}
          </h1>
          <p className="text-muted-foreground max-w-lg text-base leading-relaxed font-medium md:text-lg">
            {t.reviews.manageReputation}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border-border/50 bg-card rounded-4xl border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
              <Star className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-bold">
                {t.reviews.rating}
              </p>
              <p className="font-heading text-2xl font-black">
                {ratingData?.averageRating || 0}
                <span className="text-muted-foreground text-sm font-medium">
                  /5.0
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-border/50 bg-card rounded-4xl border p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
              <User className="text-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-bold">
                {t.reviews.totalReviews}
              </p>
              <p className="font-heading text-2xl font-black">
                {ratingData?.totalReviews || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group border-border/50 bg-card hover:border-primary/20 hover:shadow-primary/5 relative overflow-hidden rounded-4xl border p-6 transition-all hover:shadow-lg"
            >
              <div className="flex gap-4">
                <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                  {review.buyer?.avatar_url ? (
                    <Image
                      src={review.buyer.avatar_url}
                      alt={review.buyer.display_name || ''}
                      width={48}
                      height={48}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-muted-foreground h-6 w-6" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-bold">
                        {review.buyer?.display_name || t.reviews.anonymous}
                      </p>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                        {review.listing && (
                          <>
                            <span>•</span>
                            <span className="text-primary font-medium">
                              {review.listing.title}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-4 w-4',
                            star <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground/20'
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {review.comment && (
                    <div className="bg-muted/30 relative rounded-2xl p-4">
                      <p className="text-foreground/80 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title={t.reviews.noReviews}
          description={t.reviews.noReviewsDesc}
          actionLabel={t.reviews.backToListings}
          actionHref="/listings"
        />
      )}
    </div>
  )
}
