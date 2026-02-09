'use client'

import { useEffect, useState } from 'react'
import { reviewsApi, type SellerRating, type Review } from '@/lib/api'
import { Award, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Premium Header */}
      <div className="from-card to-background border-border relative overflow-hidden rounded-2xl border bg-linear-to-br p-8 shadow-sm">
        <div className="bg-primary/5 absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
              {t('reviews:title')}
            </h1>
            <p className="text-muted-foreground/70 text-[10px] font-bold tracking-[0.2em] uppercase">
              {t('reviews:manageReputation')}
            </p>
          </div>
          <div className="bg-primary/10 text-primary border-primary/20 shadow-primary/10 ring-primary/5 flex h-14 w-14 items-center justify-center rounded-xl border shadow-lg ring-4">
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

          {activeTab === 'received' && <ReviewStats ratingData={ratingData} />}
        </div>

        {/* Reviews List */}
        <ReviewList
          reviews={reviews}
          activeTab={activeTab}
          isMounted={isMounted}
          onReply={handleReplySubmit}
        />
      </div>
    </div>
  )
}
