'use client'

import { Star, MessageCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { SellerRating } from '@/lib/api'

interface ReviewStatsProps {
  ratingData: SellerRating | null
}

export function ReviewStats({ ratingData }: ReviewStatsProps) {
  const { t } = useTranslation(['reviews'])

  return (
    <div className="flex flex-1 flex-wrap gap-4">
      <div className="border-border/50 bg-card/60 hover:bg-card hover:border-primary/20 hover:shadow-primary/5 min-w-[200px] flex-1 rounded-xl border p-5 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 shadow-lg ring-1 shadow-amber-500/5 ring-amber-500/20">
            <Star className="h-6 w-6 fill-amber-500/10 text-amber-500" />
          </div>
          <div className="space-y-0.5">
            <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
              {t('reviews:rating')}
            </p>
            <p className="text-2xl font-bold tracking-tight tabular-nums">
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
          <div className="bg-primary/10 ring-primary/20 shadow-primary/5 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ring-1">
            <MessageCircle className="text-primary h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <p className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
              {t('reviews:totalReviews')}
            </p>
            <p className="text-2xl font-bold tracking-tight tabular-nums">
              {ratingData?.totalReviews || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
