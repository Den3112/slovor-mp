'use client'

import Image from 'next/image'
import { MapPin, Eye, Sparkles, ImageOff } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils'
import type { Listing, Category } from '@/lib/types/database'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'

interface ListingPreviewProps {
  formData: {
    title: string
    description: string
    price: string
    currency: string
    category_id: string
    condition: 'new' | 'used'
    location: string
    images: string[]
  }
  categories: Array<{
    id: string
    name: string
    slug: string
    name_sk?: string | null
    name_cs?: string | null
    name_en?: string | null
  }>
}

export function ListingPreview({ formData, categories }: ListingPreviewProps) {
  const { locale, t } = useTranslation()

  // Get category name based on locale
  const getCategoryNameLocalized = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return ''
    return getLocalizedCategoryName(category as unknown as Category, locale, t)
  }

  const listing: Listing = {
    id: 'preview',
    title: formData.title,
    description: formData.description,
    price: parseFloat(formData.price) || 0,
    currency: formData.currency,
    category_id: formData.category_id,
    user_id: '',
    location: formData.location,
    featured: false,
    images: formData.images,
    condition: formData.condition,
    views: 0,
    is_active: true,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: null,
    category: {
      id: formData.category_id,
      name: getCategoryNameLocalized(formData.category_id),
      slug: '',
      description: null,
      icon: null,
      icon_name: null,
      color: null,
      order_index: null,
      created_at: new Date().toISOString(),
    }
  }

  const hasValidImage = listing.images && listing.images.length > 0
  const localizedTitle = listing.title
  const categoryName = listing.category?.name || ''

  return (
    <div className="border-2 border-primary/10 bg-zinc-950 overflow-hidden shadow-xl">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {hasValidImage ? (
          <>
            <Image
              src={listing.images?.[0] || '/placeholder.png'}
              alt={localizedTitle}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground/40">
            <ImageOff className="mb-2 h-8 w-8 stroke-[1.5] md:mb-3 md:h-12 md:w-12" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em] md:text-[10px] md:tracking-[0.2em]">
              {t.common.noImage}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 md:left-4 md:top-4 md:gap-2">
          {listing.condition === 'new' && (
            <div className="flex items-center gap-2 border-2 border-primary/20 bg-black/80 px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 fill-primary text-primary" />
              {t.common.new}
            </div>
          )}
        </div>

        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-4 left-4 border-2 border-white/10 bg-black/80 px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
            {listing.images.length} PHOTOS
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            {listing.category && (
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                {categoryName}
              </span>
            )}
            <div className="flex items-center gap-1.5 font-sans text-[10px] font-bold text-zinc-500 opacity-60">
              <Eye className="h-3.5 w-3.5" />
              <span>0</span>
            </div>
          </div>
          <h3 className="line-clamp-2 font-heading text-xl font-bold leading-tight text-white transition-colors duration-300">
            {localizedTitle || 'Название объявления'}
          </h3>
        </div>

        {formData.description && (
          <p className="line-clamp-2 font-sans text-sm font-medium text-zinc-400">
            {formData.description}
          </p>
        )}

        <div className="flex items-end justify-between pt-2">
          <div className="font-heading text-3xl font-bold tracking-tighter text-white">
            {formatPrice(parseFloat(formData.price) || 0, formData.currency)}
          </div>

          {formData.location && (
            <div className="mb-1 flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="max-w-[100px] truncate">{formData.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
