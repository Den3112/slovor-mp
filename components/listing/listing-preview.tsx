'use client'

import Image from 'next/image'
import { MapPin, Eye, Sparkles, ImageOff } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils'
import type { Listing } from '@/lib/types/database'

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
    name_sk?: string | null
    name_cs?: string | null
    name_en?: string | null
  }>
}

export function ListingPreview({ formData, categories }: ListingPreviewProps) {
  const { locale, t } = useTranslation()

  // Get category name based on locale
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return ''

    const localeMap: Record<string, string> = {
      sk: 'name_sk',
      cs: 'name_cs',
      en: 'name_en',
    }
    const field = localeMap[locale] || 'name'
    return category[field as keyof typeof category] || category.name
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
    is_highlighted: false,

    promoted_until: null,
    images: formData.images,
    condition: formData.condition,
    views_count: 0,
    status: 'active',
    attributes: {},
    is_active: true,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: null,
    category: {
      id: formData.category_id,
      name: getCategoryName(formData.category_id),
      slug: '',
      description: null,
      icon: null,
      icon_name: null,
      color: null,
      order_index: null,
      created_at: new Date().toISOString(),
    },
  }

  const hasValidImage = listing.images && listing.images.length > 0
  const localizedTitle = listing.title
  const categoryName = listing.category?.name || ''

  return (
    <div className="bg-card/60 overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm md:rounded-3xl">
      {/* Image */}
      <div className="bg-muted relative aspect-4/3 overflow-hidden">
        {hasValidImage ? (
          <>
            <Image
              src={listing.images?.[0] || '/placeholder.png'}
              alt={localizedTitle}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60" />
          </>
        ) : (
          <div className="bg-muted/50 text-muted-foreground/40 absolute inset-0 flex flex-col items-center justify-center">
            <ImageOff className="mb-2 h-8 w-8 stroke-[1.5] md:mb-3 md:h-12 md:w-12" />
            <span className="text-[9px] font-black tracking-widest uppercase md:text-[10px] md:tracking-[0.2em]">
              {t('common.noImage')}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 md:top-4 md:left-4 md:gap-2">
          {listing.condition === 'new' && (
            <div className="bg-card/90 text-card-foreground flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black tracking-wide uppercase shadow-lg backdrop-blur-md md:gap-1.5 md:px-3 md:py-1.5 md:text-[10px] md:tracking-widest">
              <Sparkles className="fill-primary text-primary h-2.5 w-2.5 md:h-3 md:w-3" />
              {t('common.new')}
            </div>
          )}
        </div>

        {listing.images && listing.images.length > 1 && (
          <div className="glass text-foreground/80 absolute bottom-3 left-3 rounded-full border border-white/20 px-2.5 py-1 text-[9px] font-black md:bottom-4 md:left-4 md:px-3 md:text-[10px]">
            {listing.images.length} PHOTOS
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2.5 p-4 md:space-y-4 md:p-6">
        <div>
          <div className="mb-1.5 flex items-center justify-between md:mb-2">
            {listing.category && (
              <span className="text-primary text-[9px] font-black tracking-widest uppercase md:text-[10px] md:tracking-[0.2em]">
                {categoryName}
              </span>
            )}
            <div className="text-muted-foreground flex items-center gap-1 text-[9px] font-bold opacity-60 md:text-[10px]">
              <Eye className="h-3 w-3" />
              <span>0</span>
            </div>
          </div>
          <h3 className="font-heading text-foreground line-clamp-2 text-base leading-tight font-bold transition-colors duration-300 md:text-xl">
            {localizedTitle || 'Название объявления'}
          </h3>
        </div>

        {formData.description && (
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {formData.description}
          </p>
        )}

        <div className="flex items-end justify-between pt-1 md:pt-2">
          <div className="font-heading text-foreground text-xl font-black tracking-tighter md:text-3xl">
            {formatPrice(parseFloat(formData.price) || 0, formData.currency)}
          </div>

          {formData.location && (
            <div className="text-muted-foreground mb-0.5 flex items-center gap-1 text-[9px] font-black tracking-wide uppercase opacity-80 md:mb-1 md:text-[10px] md:tracking-widest">
              <MapPin className="text-primary h-3 w-3" />
              <span className="max-w-[80px] truncate md:max-w-[100px]">
                {formData.location}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
