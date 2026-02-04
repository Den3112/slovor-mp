'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { reviewsApi, type SellerRating, type Review } from '@/lib/api'
import { EmptyState } from '@/components/ui/empty-state'
import { Star, User, Loader2, Award, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CornerDownRight, Send } from 'lucide-react'

export default function ReviewsPage() {
  const { t } = useTranslation(['common', 'reviews'])
  const { user } = useAuth()
  const [ratingData, setRatingData] = useState<SellerRating | null>(null)
  const [givenReviews, setGivenReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return
    setIsSubmitting(true)

    try {
      const { data, error } = await reviewsApi.reply(reviewId, replyText)
      if (error) throw new Error(error)

      if (data && ratingData) {
        setRatingData({
          ...ratingData,
          reviews: ratingData.reviews.map(r =>
            r.id === reviewId ? { ...r, seller_reply: data.seller_reply, seller_reply_at: data.seller_reply_at } : r
          )
        })
      }

      toast.success(t('reviews:replySent') || 'Reply sent successfully')
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

  const reviews = activeTab === 'received' ? (ratingData?.reviews || []) : givenReviews

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
              {t('reviews:title')}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              {t('reviews:manageReputation')}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Tabs and Summary Row */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex items-center gap-1.5 rounded-xl bg-muted/30 p-1 border border-border/50 w-fit h-fit">
            <button
              onClick={() => setActiveTab('received')}
              className={cn(
                "rounded-lg px-6 py-2 text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'received'
                  ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {t('reviews:received')}
            </button>
            <button
              onClick={() => setActiveTab('given')}
              className={cn(
                "rounded-lg px-6 py-2 text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'given'
                  ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {t('reviews:given')}
            </button>
          </div>

          {activeTab === 'received' && (
            <div className="flex flex-wrap gap-4 flex-1">
              <div className="flex-1 min-w-[200px] rounded-xl border border-border/50 bg-muted/20 p-4 transition-all hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500/10" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                      {t('reviews:rating')}
                    </p>
                    <p className="text-xl font-black tabular-nums">
                      {ratingData?.averageRating || 0}
                      <span className="text-muted-foreground text-xs font-bold ml-1">/5.0</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-[200px] rounded-xl border border-border/50 bg-muted/20 p-4 transition-all hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                      {t('reviews:totalReviews')}
                    </p>
                    <p className="text-xl font-black tabular-nums">
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
              className="grid gap-4"
            >
              {reviews.map((review) => {
                const userDisplay = activeTab === 'received' ? review.author : (review as any).recipient
                return (
                  <div
                    key={review.id}
                    className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/40 bg-muted/50 group-hover:scale-105 transition-transform duration-300">
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
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-3">
                          <div className="space-y-1">
                            <p className="text-foreground font-black text-base leading-none">
                              {userDisplay?.display_name || t('reviews:anonymous')}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                              <span>{new Date(review.created_at).toLocaleDateString()}</span>
                              {review.listing && (
                                <>
                                  <span className="opacity-30">•</span>
                                  <span className="text-primary/70">{review.listing.title}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-0.5 bg-muted/40 p-1.5 rounded-lg w-fit border border-border/50">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'h-3.5 w-3.5 transition-all',
                                  star <= review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-muted-foreground/20'
                                )}
                              />
                            ))}
                          </div>
                        </div>

                        {review.comment && (
                          <div className="relative rounded-xl bg-muted/20 p-4 border border-border/30 group-hover:bg-muted/40 transition-all">
                            <p className="text-foreground/80 text-sm font-medium leading-relaxed italic">
                              &ldquo;{review.comment}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Seller Reply */}
                        {review.seller_reply && (
                          <div className="mt-4 ml-6 flex gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <CornerDownRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Your Reply</p>
                              <p className="text-sm text-foreground/80 font-medium italic">&ldquo;{review.seller_reply}&rdquo;</p>
                            </div>
                          </div>
                        )}

                        {/* Reply Action */}
                        {activeTab === 'received' && !review.seller_reply && (
                          <div className="mt-4 flex justify-end">
                            {replyingTo === review.id ? (
                              <div className="w-full space-y-3">
                                <Textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder={t('reviews:writeReply')}
                                  className="resize-none"
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setReplyingTo(null)
                                      setReplyText('')
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest rounded-xl"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleReplySubmit(review.id)}
                                    disabled={isSubmitting || !replyText.trim()}
                                    className="text-[10px] font-black uppercase tracking-widest rounded-xl"
                                  >
                                    {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Send className="h-3 w-3 mr-2" />}
                                    Send Reply
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReplyingTo(review.id)}
                                className="text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/5 hover:text-primary transition-all"
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
              className="rounded-xl border border-border/50 bg-card p-12 shadow-sm text-center flex flex-col items-center justify-center"
            >
              <EmptyState
                icon={Star}
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
