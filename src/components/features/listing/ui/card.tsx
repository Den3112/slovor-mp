'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, memo } from 'react'
import type { Listing } from '@/lib/api'
import { MapPin, Eye, Sparkles, ImageOff } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedTitle } from '@/lib/utils/listing-utils'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { cn } from '@/lib/utils/cn'
import { FavoriteButton } from '@/components/features/listing/ui/favorite-button'
import { PriceDisplay } from '@/components/ui/price-display'
import { CheckCircle2 } from 'lucide-react'

interface ListingCardProps {
  listing: Listing
  featured?: boolean
  variant?: 'default' | 'compact'
}

export const ListingCard = memo(function ListingCard({
  listing,
  featured,
  variant = 'default',
}: ListingCardProps) {
  const { t, i18n } = useTranslation(['common', 'categories'])
  const locale = i18n.language
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const imageUrl = listing.images?.[0] || ''
  const hasValidImage = imageUrl && !imageError

  const localizedTitle = getLocalizedTitle(listing, locale)
  const categoryName = listing.category
    ? getLocalizedCategoryName(listing.category, locale, t)
    : ''

  // Compact variant for mobile horizontal layout
  if (variant === 'compact') {
    return (
      <Link
        href={`/${locale}/listings/${listing.id}`}
        className="card-pro group border-border/40 relative flex gap-4 overflow-hidden p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
      >
        {/* Compact Image */}
        <div className="bg-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.25rem] sm:h-28 sm:w-28">
          {hasValidImage ? (
            <Image
              src={imageUrl}
              alt={localizedTitle}
              fill
              className={cn(
                'object-cover transition-all duration-700 group-hover:scale-110',
                isLoading ? 'opacity-0' : 'opacity-100'
              )}
              sizes="120px"
              onError={() => {
                setImageError(true)
                setIsLoading(false)
              }}
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <div className="bg-muted text-muted-foreground/30 flex h-full w-full items-center justify-center">
              <ImageOff className="h-6 w-6" />
            </div>
          )}

          {/* Condition Badge */}
          {listing.condition === 'new' && (
            <div className="bg-card text-primary border-primary/20 absolute top-1.5 left-1.5 flex items-center gap-1 rounded-xl border px-2 py-0.5 text-[8px] font-black uppercase shadow-sm">
              <Sparkles className="fill-primary h-2.5 w-2.5" />
              {t('new')}
            </div>
          )}
        </div>

        {/* Compact Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div>
            {listing.category && (
              <span className="text-primary text-[9px] font-black tracking-[0.2em] uppercase opacity-70">
                {categoryName}
              </span>
            )}
            <h3 className="text-foreground group-hover:text-primary mt-1 line-clamp-2 text-sm leading-snug font-bold transition-colors sm:text-base">
              {localizedTitle}
            </h3>
          </div>

          <div className="flex items-end justify-between">
            <PriceDisplay
              amount={listing.price}
              baseCurrency={listing.currency}
              className="font-heading text-foreground text-xl font-black tracking-tight sm:text-2xl"
            />

            {listing.location && (
              <div className="text-muted-foreground flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase opacity-50">
                <MapPin className="text-primary h-3 w-3" />
                <span className="max-w-[80px] truncate">
                  {listing.location.split(',')[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton listingId={listing.id} size="sm" />
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link
      href={`/${locale}/listings/${listing.id}`}
      className={cn(
        'card-pro group ring-primary/0 border-border/40 hover:shadow-primary/5 relative block overflow-hidden shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.99]',
        (listing.is_highlighted || featured) &&
          'border-primary/40 from-primary/5 bg-linear-to-b to-transparent'
      )}
    >
      {/* Glow Effect on Hover */}
      <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Premium Border for Highlighted */}
      {(listing.is_highlighted || featured) && (
        <div className="bg-primary absolute inset-x-0 -top-px z-20 h-[3px] shadow-[0_2px_10px_rgba(var(--primary-rgb),0.5)]" />
      )}

      {/* Image Container */}
      <div className="bg-muted relative aspect-4/3 overflow-hidden">
        {hasValidImage ? (
          <>
            <Image
              src={imageUrl}
              alt={localizedTitle}
              fill
              className={cn(
                'ease-out-expo object-cover transition-transform duration-1000 group-hover:scale-110',
                isLoading ? 'opacity-0' : 'opacity-100'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => {
                setImageError(true)
                setIsLoading(false)
              }}
              onLoad={() => setIsLoading(false)}
              priority={featured}
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/10 transition-opacity group-hover:opacity-40" />
          </>
        ) : (
          <div className="bg-muted text-muted-foreground/30 absolute inset-0 flex flex-col items-center justify-center">
            <ImageOff className="mb-2 h-10 w-10 stroke-1" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase">
              {t('noImage')}
            </span>
          </div>
        )}

        {/* Badges - Floating Style */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {(featured || listing.is_highlighted) && (
            <div className="bg-primary shadow-primary/20 flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-black tracking-widest text-white uppercase shadow-md">
              <Sparkles className="h-3 w-3 fill-white" />
              {t('featured')}
            </div>
          )}

          {listing.condition === 'new' && (
            <div className="bg-card text-foreground border-border flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black tracking-widest uppercase shadow-md">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {t('new')}
            </div>
          )}
        </div>

        {/* Top Right: Favorite */}
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton listingId={listing.id} />
        </div>

        {/* Photos Count Overlay */}
        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[10px] font-black text-white">
            <span className="opacity-70">{listing.images.length}</span>
            <span className="text-[9px] tracking-[0.2em] uppercase">
              {t('photos') || 'Photos'}
            </span>
          </div>
        )}
      </div>

      {/* Content - Pro Max Polish */}
      <div className="relative z-10 flex flex-col gap-4 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {listing.category && (
              <span className="text-primary text-[10px] font-black tracking-[0.25em] uppercase opacity-70">
                {categoryName}
              </span>
            )}
            <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-black opacity-40">
              <Eye className="h-3.5 w-3.5" />
              <span>{listing.views_count || 0}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-lg font-black tracking-tight transition-colors duration-500">
              {localizedTitle}
            </h3>
            {listing.user?.is_verified && (
              <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Attributes Teaser */}
        {listing.attributes && Object.keys(listing.attributes).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(listing.attributes)
              .slice(0, 3)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="bg-muted/40 border-border/40 flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-black tracking-wide uppercase"
                >
                  <span className="text-muted-foreground opacity-60">
                    {key}:
                  </span>
                  <span className="text-foreground">{String(value)}</span>
                </div>
              ))}
          </div>
        )}

        <div className="border-border/40 mt-2 flex items-center justify-between border-t pt-5">
          <div className="flex flex-col">
            <span className="text-muted-foreground mb-1 text-[10px] font-black tracking-widest uppercase opacity-40">
              {t('common:price') || 'Price'}
            </span>
            <PriceDisplay
              amount={listing.price}
              baseCurrency={listing.currency}
              className="font-heading text-foreground text-2xl font-black tracking-tighter"
            />
          </div>

          {listing.location && (
            <div className="bg-muted/40 border-border/40 group-hover:bg-primary/5 flex items-center gap-2 rounded-full border px-3 py-2 transition-colors">
              <MapPin className="text-primary h-3.5 w-3.5" />
              <span className="max-w-[100px] truncate text-[11px] font-black tracking-widest uppercase opacity-70">
                {listing.location.split(',')[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
})

ListingCard.displayName = 'ListingCard'
