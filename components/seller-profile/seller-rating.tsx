'use client'

import { useState, useEffect } from 'react'
import { Star, User } from 'lucide-react'
import { reviewsApi, type SellerRating as SellerRatingData } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface SellerRatingProps {
  sellerId: string
  showReviewForm?: boolean
}

export function SellerRating({
  sellerId,
  showReviewForm = true,
}: SellerRatingProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [ratingData, setRatingData] = useState<SellerRatingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    loadRating()
    if (user) {
      checkIfReviewed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId, user])

  const loadRating = async () => {
    setIsLoading(true)
    const { data } = await reviewsApi.getForSeller(sellerId)
    if (data) {
      setRatingData(data)
    }
    setIsLoading(false)
  }

  const checkIfReviewed = async () => {
    if (!user) return
    const { data } = await reviewsApi.hasReviewed(sellerId, user.id)
    if (data !== null) {
      setHasReviewed(data)
    }
  }

  const handleSubmitReview = async () => {
    if (!user || newRating === 0) return

    setIsSubmitting(true)
    setSubmitMessage(null)

    const { error } = await reviewsApi.create({
      recipient_id: sellerId,
      author_id: user.id,
      rating: newRating,
      comment: comment.trim() || undefined,
    })

    if (error) {
      setSubmitMessage({ type: 'error', text: error })
    } else {
      setSubmitMessage({ type: 'success', text: t('reviews.thankYou') })
      setShowForm(false)
      setNewRating(0)
      setComment('')
      setHasReviewed(true)
      loadRating()
    }

    setIsSubmitting(false)
  }

  const canReview = user && user.id !== sellerId && !hasReviewed

  if (isLoading) {
    return (
      <div className="bg-muted/30 animate-pulse space-y-4 rounded-xl p-6">
        <div className="bg-muted h-6 w-32 rounded" />
        <div className="bg-muted h-4 w-48 rounded" />
      </div>
    )
  }

  return (
    <div className="border-border/60 bg-card space-y-6 rounded-xl border p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{t('reviews.title')}</h3>
        {canReview && showReviewForm && !showForm && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowForm(true)}
            className="rounded-xl"
          >
            {t('reviews.writeReview')}
          </Button>
        )}
      </div>

      {/* Average Rating */}
      {ratingData && ratingData.totalReviews > 0 ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-5 w-5',
                  star <= Math.round(ratingData.averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <span className="text-2xl font-black">
            {ratingData.averageRating}
          </span>
          <span className="text-muted-foreground text-sm">
            {t('reviews.basedOn')} {ratingData.totalReviews}{' '}
            {t('reviews.reviewsCount')}
          </span>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">{t('reviews.noReviews')}</p>
      )}

      {/* Submit Message */}
      {submitMessage && (
        <div
          className={cn(
            'rounded-xl px-4 py-2 text-sm font-medium',
            submitMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-destructive/10 text-destructive'
          )}
        >
          {submitMessage.text}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="bg-muted/20 space-y-4 rounded-xl p-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {t('reviews.yourRating')}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      star <= (hoverRating || newRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t('reviews.yourComment')}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="..."
              className="border-input bg-muted/30 focus:border-primary/50 focus:ring-primary/20 w-full resize-none rounded-xl border px-4 py-3 text-sm transition-all outline-none focus:ring-1"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmitReview}
              disabled={newRating === 0 || isSubmitting}
              className="rounded-xl"
            >
              {isSubmitting ? '...' : t('reviews.submitReview')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowForm(false)}
              className="rounded-xl"
            >
              {t('common.back')}
            </Button>
          </div>
        </div>
      )}

      {/* Already reviewed message */}
      {hasReviewed && !showForm && (
        <p className="text-muted-foreground text-sm">
          {t('reviews.alreadyReviewed')}
        </p>
      )}

      {/* Reviews List */}
      {ratingData && ratingData.reviews.length > 0 && (
        <div className="border-border/50 space-y-4 border-t pt-4">
          {ratingData.reviews.slice(0, 5).map((review) => (
            <div key={review.id} className="flex gap-3">
              <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                {review.author?.avatar_url ? (
                  <Image
                    src={review.author.avatar_url}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="text-muted-foreground h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {review.author?.display_name || 'User'}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-3 w-3',
                          star <= review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30'
                        )}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {review.comment}
                  </p>
                )}
                <p
                  className="text-muted-foreground/60 mt-1 text-xs"
                  suppressHydrationWarning
                >
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
