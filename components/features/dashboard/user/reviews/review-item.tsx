'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { User, Star, CornerDownRight, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type { Review } from '@/lib/api'

interface ReviewItemProps {
  review: Review
  activeTab: 'received' | 'given'
  isMounted: boolean
  onReply: (reviewId: string, text: string) => Promise<void>
}

export function ReviewItem({
  review,
  activeTab,
  isMounted,
  onReply,
}: ReviewItemProps) {
  const { t } = useTranslation(['common', 'reviews', 'dashboard'])
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userDisplay =
    activeTab === 'received' ? review.author : (review as any).recipient

  const [avatarError, setAvatarError] = useState(false)

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return
    setIsSubmitting(true)
    try {
      await onReply(review.id, replyText)
      setIsReplying(false)
      setReplyText('')
    } catch (error) {
      // Error is handled by parent or toast in parent
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="group border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-primary/5 relative rounded-xl border p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Avatar */}
        <div className="border-border/40 bg-muted/50 relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
          {userDisplay?.avatar_url && !avatarError ? (
            <Image
              src={userDisplay.avatar_url}
              alt={userDisplay.display_name || ''}
              fill
              className="object-cover"
              unoptimized
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="text-muted-foreground/20 h-8 w-8" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Header Info */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-foreground text-lg leading-none font-bold tracking-tight">
                {userDisplay?.display_name || t('reviews:anonymous')}
              </p>
              <div className="text-muted-foreground/60 flex flex-wrap items-center gap-3 text-[10px] font-bold tracking-widest uppercase">
                <span>
                  {isMounted
                    ? new Date(review.created_at).toLocaleDateString()
                    : '...'}
                </span>
                {review.listing && (
                  <>
                    <span className="opacity-30">•</span>
                    <Link
                      href={`/listings/${review.listing.id}`}
                      className="text-primary/80 hover:text-primary decoration-primary/30 underline-offset-4 transition-colors hover:underline"
                    >
                      {review.listing.title}
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="bg-muted/30 border-border/40 flex w-fit gap-0.5 rounded-xl border p-1.5">
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

          {/* Comment */}
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
                <p className="text-foreground/80 text-sm leading-relaxed font-medium">
                  &ldquo;{review.seller_reply}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Reply Form / Action */}
          {activeTab === 'received' && !review.seller_reply && (
            <div className="mt-5 flex justify-end">
              {isReplying ? (
                <div className="border-primary/20 bg-primary/5 w-full space-y-4 rounded-xl border border-dashed p-4">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={t('reviews:writeReply')}
                    className="bg-background border-primary/20 focus:border-primary/50 resize-none"
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsReplying(false)
                        setReplyText('')
                      }}
                      className="rounded-xl text-[10px] font-bold tracking-widest uppercase"
                    >
                      {t('common:cancel')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmitReply}
                      disabled={isSubmitting || !replyText.trim()}
                      className="shadow-primary/20 rounded-xl text-[10px] font-bold tracking-widest uppercase shadow-md"
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
                  onClick={() => setIsReplying(true)}
                  className="hover:bg-primary/5 hover:text-primary hover:border-primary/20 border-border/60 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all"
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
}
