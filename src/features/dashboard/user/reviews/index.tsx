'use client'

import { useEffect, useState } from 'react'
import { reviewsApi, type SellerRating, type Review } from '@/shared/lib/api'
import { Star, Loader2 } from 'lucide-react'
import { useTranslation } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'
import { toast } from 'sonner'
import { cn } from '@/shared/lib/utils'
import { ReviewStats } from './review-stats'
import { ReviewList } from './review-list'

interface UserReviewsViewProps {
  userId: string
}

export function UserReviewsView({ userId }: UserReviewsViewProps) {
  const { t } = useTranslation(['common', 'reviews', 'dashboard'])
  const [isMounted, setIsMounted] = useState(false)
  const [ratingData, setRatingData] = useState<SellerRating | null>(null)
  const [givenReviews, setGivenReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received')

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  const handleReplySubmit = async (reviewId: string, replyText: string) => {
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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-12 duration-700">
      {/* Premium Header */}
      <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 shadow-md">
        <div className="bg-primary/10 absolute -top-20 -right-20 h-64 w-64 animate-pulse rounded-full opacity-40 blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="bg-primary shadow-primary/20 flex h-16 w-16 items-center justify-center rounded-xl shadow-lg">
              <Star className="h-8 w-8 fill-white text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground ml-1 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
                {t('profile:reviewsSubtitle', {
                  defaultValue: 'Manage your reputation',
                })}
              </p>
              <h1 className="text-foreground text-5xl font-black tracking-tighter uppercase sm:text-6xl">
                {t('dashboard:reviews')}
              </h1>
            </div>
          </div>
          <div className="bg-card border-border relative hidden h-16 items-center justify-center rounded-xl border px-8 text-xs font-black tracking-widest uppercase shadow-sm md:flex">
            <span className="text-primary mr-2 text-xl">{reviews.length}</span>
            <span className="opacity-40">{t('common:reviews')}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* Tabs and Summary Row */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="bg-card border-border flex h-fit w-fit items-center gap-2 rounded-xl p-1.5 shadow-sm">
            <Button
              onClick={() => setActiveTab('received')}
              variant="ghost"
              className={cn(
                'rounded-xl px-8 py-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300',
                activeTab === 'received'
                  ? 'bg-primary shadow-primary/20 hover:bg-primary scale-105 text-white shadow-lg hover:text-white'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              )}
            >
              {t('reviews:received')}
            </Button>
            <Button
              onClick={() => setActiveTab('given')}
              variant="ghost"
              className={cn(
                'rounded-xl px-8 py-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300',
                activeTab === 'given'
                  ? 'bg-primary shadow-primary/20 hover:bg-primary scale-105 text-white shadow-lg hover:text-white'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              )}
            >
              {t('reviews:given')}
            </Button>
          </div>

          <div className="flex-1">
            {activeTab === 'received' && (
              <ReviewStats ratingData={ratingData} />
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="glass-panel border-primary/10 bg-background/10 shadow-primary/5 overflow-hidden rounded-[2.5rem] shadow-2xl">
          <ReviewList
            reviews={reviews}
            activeTab={activeTab}
            isMounted={isMounted}
            onReply={handleReplySubmit}
          />
        </div>
      </div>
    </div>
  )
}
