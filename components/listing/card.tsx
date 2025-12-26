'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Listing } from '@/lib/supabase/queries'
import { MapPin, Eye, Sparkles, ImageOff } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { getLocalizedTitle } from '@/lib/utils/listing-i18n'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { cn } from '@/lib/utils'

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
      className="group relative block bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
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
                "object-cover transition-transform duration-500 group-hover:scale-110",
                isLoading ? 'blur-md scale-105' : 'blur-0'
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
            <ImageOff className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-xs font-medium uppercase tracking-wider">{t.common.noImage}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {featured && (
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-primary/25 animate-in fade-in zoom-in">
              {t.common.featured}
            </div>
          )}

          {listing.condition === 'new' && (
            <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              {t.common.new}
            </div>
          )}
        </div>

        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-white/10">
            {listing.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            {listing.category && (
              <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                {categoryName}
              </div>
            )}
            <h3 className="font-medium text-foreground text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {localizedTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-heading text-foreground tracking-tight">
            {listing.price.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-muted-foreground">{listing.currency}</span>
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-3 border-t border-border/50">
          {listing.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{listing.location}</span>
            </div>
          )}

          {listing.views !== undefined && (
            <div className="flex items-center gap-1.5 opacity-70">
              <Eye className="w-3.5 h-3.5" />
              <span>{listing.views}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
