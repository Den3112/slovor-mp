'use client'

import { useEffect, useState } from 'react'
import { reviewsApi, type SellerRating, type Review } from '@/lib/api'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Star,
  User,
  Loader2,
  Award,
  MessageCircle,
  CornerDownRight,
  Send,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface UserReviewsViewProps {
  userId: string
}

export function UserReviewsView({ userId }: UserReviewsViewProps) {
  const { t } = useTranslation(['common', 'reviews', 'dashboard'])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  const [ratingData, setRatingData] = useState<SellerRating | null>(null)
  const [givenReviews, setGivenReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadReviews() {
      if (!userId) return

      try {
        const [receivedRes, givenRes] = await Promise.all([
          reviewsApi.getForSeller(userId),
          reviewsApi.getByAuthor(userId),
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
  }, [userId])

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return
    setIsSubmitting(true)

    try {
      const { data, error } = await reviewsApi.reply(reviewId, replyText)
      if (error) throw new Error(error)

      if (data && ratingData) {
        setRatingData({
          ...ratingData,
          reviews: ratingData.reviews.map((r) =>
            r.id === reviewId
              ? {
                ...r,
                seller_reply: data.seller_reply,
                seller_reply_at: data.seller_reply_at,
              }
              : r
          ),
        })
      }

      toast.success(t('reviews:replySent'))
      setReplyingTo(null)
      setReplyText('')
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  const reviews =
    activeTab === 'received' ? ratingData?.reviews || [] : givenReviews

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Premium Header */}
      <div className="bg-linear-to-br from-card to-background border-border relative overflow-hidden rounded-2xl border p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
              {t('reviews:title')}
            </h1>
            <p className="text-muted-foreground/70 text-[10px] font-bold tracking-[0.2em] uppercase">
              {t('reviews:manageReputation')}
            </p>
          </div>
          <div className="bg-primary/10 text-primary border-primary/20 shadow-primary/10 flex h-14 w-14 items-center justify-center rounded-xl border shadow-lg ring-4 ring-primary/5">
            <Award className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Tabs and Summary Row */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="bg-muted border-border/60 flex h-fit w-fit items-center gap-2 rounded-xl border p-1.5">
            <Button
              onClick={() => setActiveTab('received')}
              variant="ghost"
              className={cn(
                'rounded-lg px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-transparent',
                activeTab === 'received'
                  ? 'bg-background text-primary ring-border/50 hover:bg-background shadow-sm ring-1'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {t('reviews:received')}
            </Button>
            <Button
              onClick={() => setActiveTab('given')}
              variant="ghost"
              className={cn(
                'rounded-lg px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-transparent',
                activeTab === 'given'
                  ? 'bg-background text-primary ring-border/50 hover:bg-background shadow-sm ring-1'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {t('reviews:given')}
            </Button>
          </div>

          {activeTab === 'received' && (
            <div className="flex flex-1 flex-wrap gap-4">
              <div className="border-border/50 bg-card/60 hover:bg-card hover:border-primary/20 hover:shadow-primary/5 min-w-[200px] flex-1 rounded-xl border p-5 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 shadow-lg shadow-amber-500/5">
                    <Star className="h-6 w-6 fill-amber-500/10 text-amber-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                      {t('reviews:rating')}
                    </p>
                    <p className="text-2xl font-bold tabular-nums tracking-tight">
                      {ratingData?.averageRating || 0}
                      <span className="text-muted-foreground/60 ml-1 text-sm font-bold">
                        /5.0
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-border/50 bg-card/60 hover:bg-card hover:border-primary/20 hover:shadow-primary/5 min-w-[200px] flex-1 rounded-xl border p-5 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 ring-primary/20 shadow-primary/5 flex h-12 w-12 items-center justify-center rounded-xl ring-1 shadow-lg">
                    <MessageCircle className="text-primary h-6 w-6" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                      {t('reviews:totalReviews')}
                    </p>
                    <p className="text-2xl font-bold tabular-nums tracking-tight">
                      {ratingData?.totalReviews || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <AnimatePresence mode="wait">
          {reviews.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-5"
            >
              {reviews.map((review) => {
                const userDisplay =
                  activeTab === 'received'
                    ? review.author
                    : (review as any).recipient
                return (
                  <div
                    key={review.id}
                    className="group border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 relative rounded-xl border p-6 transition-all duration-300"
                  >
                    <div className="flex flex-col gap-6 sm:flex-row">
                      <div className="border-border/40 bg-muted/50 relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
                        {userDisplay?.avatar_url ? (
                          <Image
                            src={userDisplay.avatar_url}
                            alt={userDisplay.display_name || ''}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <User className="text-muted-foreground/20 h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-1.5">
                            <p className="text-foreground text-lg leading-none font-bold tracking-tight">
                              {userDisplay?.display_name ||
                                t('reviews:anonymous')}
                            </p>
                            <div className="text-muted-foreground/60 flex flex-wrap items-center gap-3 text-[10px] font-bold tracking-widest uppercase">
                              <span>
                                {isMounted
                                  ? new Date(
                                    review.created_at
                                  ).toLocaleDateString()
                                  : '...'}
                              </span>
                              {review.listing && (
                                <>
                                  <span className="opacity-30">•</span>
                                  <Link
                                    href={`/listings/${review.listing.id}`}
                                    className="text-primary/80 hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4"
                                  >
                                    {review.listing.title}
                                  </Link>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="bg-muted/30 border-border/40 flex w-fit gap-0.5 rounded-lg border p-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'h-4 w-4 transition-all',
                                  star <= review.rating
                                    ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                    : 'text-muted-foreground/10'
                                )}
                              />
                            ))}
                          </div>
                        </div>

                        {review.comment && (
                          <div className="bg-muted/10 border-border/20 group-hover:bg-muted/30 relative rounded-xl border p-5 transition-all">
                            <p className="text-foreground/80 text-sm leading-relaxed font-medium">
                              &ldquo;{review.comment}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Seller Reply */}
                        {review.seller_reply && (
                          <div className="bg-primary/5 border-primary/10 mt-4 ml-6 flex gap-4 rounded-xl border p-5">
                            <CornerDownRight className="text-primary mt-1 h-4 w-4 shrink-0 opacity-50" />
                            <div className="space-y-2">
                              <p className="text-primary text-[10px] font-bold tracking-widest uppercase opacity-80">
                                {t('dashboard:reviews.yourReply')}
                              </p>
                              <p className="text-foreground/80 text-sm font-medium leading-relaxed">
                                &ldquo;{review.seller_reply}&rdquo;
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Reply Action */}
                        {activeTab === 'received' && !review.seller_reply && (
                          <div className="mt-5 flex justify-end">
                            {replyingTo === review.id ? (
                              <div className="w-full space-y-4 rounded-xl border border-dashed border-primary/20 bg-primary/5 p-4">
                                <Textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder={t('reviews:writeReply')}
                                  className="resize-none bg-background border-primary/20 focus:border-primary/50"
                                />
                                <div className="flex justify-end gap-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setReplyingTo(null)
                                      setReplyText('')
                                    }}
                                    className="rounded-lg text-[10px] font-bold tracking-widest uppercase"
                                  >
                                    {t('common:cancel')}
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleReplySubmit(review.id)}
                                    disabled={isSubmitting || !replyText.trim()}
                                    className="rounded-lg text-[10px] font-bold tracking-widest uppercase shadow-md shadow-primary/20"
                                  >
                                    {isSubmitting ? (
                                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                    ) : (
                                      <Send className="mr-2 h-3 w-3" />
                                    )}
                                    {t('reviews:sendReply')}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReplyingTo(review.id)}
                                className="hover:bg-primary/5 hover:text-primary hover:border-primary/20 rounded-lg border-border/60 text-[10px] font-bold tracking-widest uppercase transition-all"
                              >
                                {t('reviews:reply')}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-border/50 bg-background flex flex-col items-center justify-center rounded-2xl border p-16 text-center shadow-xs"
            >
              <EmptyState
                title={t('reviews:noReviews')}
                description={t('reviews:noReviewsDesc')}
                actionLabel={t('reviews:backToListings')}
                actionHref="/listings"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
