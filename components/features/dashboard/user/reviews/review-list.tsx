'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState } from '@/components/ui/empty-state'
import { useTranslation } from '@/lib/i18n'
import type { Review } from '@/lib/api'
import { ReviewItem } from './review-item'

interface ReviewListProps {
  reviews: Review[]
  activeTab: 'received' | 'given'
  isMounted: boolean
  onReply: (reviewId: string, text: string) => Promise<void>
}

export function ReviewList({
  reviews,
  activeTab,
  isMounted,
  onReply,
}: ReviewListProps) {
  const { t } = useTranslation(['reviews'])

  if (reviews.length === 0) {
    return (
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
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="grid gap-5"
      >
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            activeTab={activeTab}
            isMounted={isMounted}
            onReply={onReply}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
