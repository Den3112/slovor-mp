'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { reviewsApi, type SellerRating } from '@/lib/api'
import { EmptyState } from '@/components/ui/empty-state'
import { Star, User, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function ReviewsPage() {
    // const { t } = useTranslation()
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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const reviews = ratingData?.reviews || []

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-heading text-3xl font-black tracking-tight">Reviews</h1>
                <p className="text-muted-foreground">Manage your reputation and view feedback from buyers.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-[2rem] border border-border/50 bg-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                            <Star className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground">Rating</p>
                            <p className="font-heading text-2xl font-black">
                                {ratingData?.averageRating || 0}
                                <span className="text-sm font-medium text-muted-foreground">/5.0</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-border/50 bg-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground">Total Reviews</p>
                            <p className="font-heading text-2xl font-black">{ratingData?.totalReviews || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            {
                reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                                        {review.buyer?.avatar_url ? (
                                            <Image
                                                src={review.buyer.avatar_url}
                                                alt={review.buyer.display_name || ''}
                                                width={48}
                                                height={48}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-6 w-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-foreground">
                                                    {review.buyer?.display_name || 'Anonymous User'}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                                    {review.listing && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="font-medium text-primary">
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
                                                            "h-4 w-4",
                                                            star <= review.rating
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-muted-foreground/20"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {review.comment && (
                                            <div className="relative rounded-2xl bg-muted/30 p-4">
                                                <p className="text-sm leading-relaxed text-foreground/80">
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
                        title="No reviews yet"
                        description="You haven't received any reviews yet. Sell items to build your reputation!"
                        actionLabel="Back to listings"
                        actionHref="/listings"
                    />
                )
            }
        </div >
    )
}
