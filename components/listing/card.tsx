'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Listing } from '@/lib/api'
import { MapPin, Eye, Sparkles, ImageOff } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedTitle } from '@/lib/utils/listing-i18n'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { cn } from '@/lib/utils'
import { FavoriteButton } from '@/components/listing/favorite-button'

interface ListingCardProps {
  listing: Listing
  featured?: boolean
}

export function ListingCard({ listing, featured }: ListingCardProps) {
  const { locale, t } = useTranslation()
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const imageUrl = listing.images?.[0] || ''
  const hasValidImage = imageUrl && !imageError
  const localizedTitle = getLocalizedTitle(listing, locale)
  const categoryName = listing.category
    ? getLocalizedCategoryName(listing.category, locale, t)
    : ''

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-border/40 bg-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_32px_64px_-16px_rgba(139,92,246,0.15)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {hasValidImage ? (
          <>
            <Image
              src={imageUrl}
              alt={localizedTitle}
              fill
              className={cn(
                'object-cover transition-transform duration-700 group-hover:scale-110',
                isLoading ? 'scale-105 blur-md' : 'blur-0'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                setImageError(true)
                setIsLoading(false)
              }}
              onLoad={() => setIsLoading(false)}
              unoptimized
              priority={featured}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground/40">
            <ImageOff className="mb-3 h-12 w-12 stroke-[1.5]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {t.common.noImage}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {featured && (
            <div className="rounded-full bg-primary/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/30 backdrop-blur-md duration-500 animate-in fade-in zoom-in">
              {t.common.featured}
            </div>
          )}

          {listing.condition === 'new' && (
            <div className="flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-card-foreground shadow-lg backdrop-blur-md">
              <Sparkles className="h-3 w-3 fill-primary text-primary" />
              {t.common.new}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute right-4 top-4">
          <FavoriteButton listingId={listing.id} />
        </div>

        {listing.images && listing.images.length > 1 && (
          <div className="glass absolute bottom-4 left-4 rounded-full border border-white/20 px-3 py-1 text-[10px] font-black text-foreground/80">
            {listing.images.length} PHOTOS
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            {listing.category && (
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                {categoryName}
              </span>
            )}
            {listing.views !== undefined && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground opacity-60">
                <Eye className="h-3 w-3" />
                <span>{listing.views}</span>
              </div>
            )}
          </div>
          <h3 className="line-clamp-2 font-heading text-xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {localizedTitle}
          </h3>
        </div>

        <div className="flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-3xl font-black tracking-tighter text-foreground">
              {listing.price.toLocaleString()}
            </span>
            <span className="text-xs font-bold uppercase text-muted-foreground">
              {listing.currency}
            </span>
          </div>

          {listing.location && (
            <div className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-80">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="max-w-[100px] truncate">{listing.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
