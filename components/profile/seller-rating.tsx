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

export function SellerRating({ sellerId, showReviewForm = true }: SellerRatingProps) {
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
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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
            seller_id: sellerId,
            buyer_id: user.id,
            rating: newRating,
            comment: comment.trim() || undefined,
        })

        if (error) {
            setSubmitMessage({ type: 'error', text: error })
        } else {
            setSubmitMessage({ type: 'success', text: t.reviews.thankYou })
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
            <div className="animate-pulse space-y-4 rounded-2xl bg-muted/30 p-6">
                <div className="h-6 w-32 rounded bg-muted" />
                <div className="h-4 w-48 rounded bg-muted" />
            </div>
        )
    }

    return (
        <div className="space-y-8 border-2 border-primary/10 bg-zinc-950 p-8 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-primary/10 pb-6">
                <h3 className="font-heading text-2xl font-bold tracking-tight text-white">{t.reviews.title}</h3>
                {canReview && showReviewForm && !showForm && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowForm(true)}
                        className="rounded-none border-2 px-6 font-sans text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-primary hover:text-white"
                    >
                        {t.reviews.writeReview}
                    </Button>
                )}
            </div>

            {/* Average Rating */}
            {ratingData && ratingData.totalReviews > 0 ? (
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "h-6 w-6",
                                    star <= Math.round(ratingData.averageRating)
                                        ? "fill-primary text-primary"
                                        : "text-zinc-800"
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-sans text-3xl font-black text-white leading-none">{ratingData.averageRating}</span>
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
                            {t.reviews.basedOn} {ratingData.totalReviews} {t.reviews.reviewsCount}
                        </span>
                    </div>
                </div>
            ) : (
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-600">{t.reviews.noReviews}</p>
            )}

            {/* Submit Message */}
            {submitMessage && (
                <div className={cn(
                    "border-2 px-6 py-4 font-sans text-xs font-bold uppercase tracking-widest",
                    submitMessage.type === 'success' ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-500" : "border-destructive/30 bg-destructive/5 text-destructive"
                )}>
                    {submitMessage.text}
                </div>
            )}

            {/* Review Form */}
            {showForm && (
                <div className="space-y-8 border-t-2 border-primary/10 pt-8">
                    <div className="space-y-4">
                        <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t.reviews.yourRating}</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="border-2 border-primary/10 bg-white/5 p-3 transition-all hover:border-primary hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        className={cn(
                                            "h-8 w-8 transition-colors",
                                            star <= (hoverRating || newRating)
                                                ? "fill-primary text-primary"
                                                : "text-zinc-800"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t.reviews.yourComment}</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="..."
                            className="w-full resize-none border-2 border-primary/10 bg-white/[0.03] px-6 py-4 font-sans text-xs font-medium text-white outline-none transition-all placeholder:text-zinc-700 focus:border-primary"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={handleSubmitReview}
                            disabled={newRating === 0 || isSubmitting}
                            className="h-14 flex-1 rounded-none font-sans text-xs font-bold uppercase tracking-[0.2em]"
                        >
                            {isSubmitting ? '...' : t.reviews.submitReview}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            className="h-14 rounded-none border-2 border-primary/10 font-sans text-xs font-bold uppercase tracking-[0.2em]"
                        >
                            {t.common.back}
                        </Button>
                    </div>
                </div>
            )}

            {/* Already reviewed message */}
            {hasReviewed && !showForm && (
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t.reviews.alreadyReviewed}</p>
            )}

            {/* Reviews List */}
            {ratingData && ratingData.reviews.length > 0 && (
                <div className="space-y-10 border-t-2 border-primary/10 pt-10">
                    {ratingData.reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="flex gap-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-primary/10 bg-zinc-950">
                                {review.buyer?.avatar_url ? (
                                    <Image
                                        src={review.buyer.avatar_url}
                                        alt=""
                                        width={56}
                                        height={56}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User className="h-6 w-6 text-zinc-800" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-4">
                                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-white">
                                        {review.buyer?.display_name || 'User'}
                                    </span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn(
                                                    "h-3 w-3",
                                                    star <= review.rating
                                                        ? "fill-primary text-primary"
                                                        : "text-zinc-800"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="mt-3 font-sans text-xs font-medium leading-relaxed text-zinc-400">{review.comment}</p>
                                )}
                                <p className="mt-3 font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-600" suppressHydrationWarning>
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
