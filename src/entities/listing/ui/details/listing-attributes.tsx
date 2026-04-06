'use client'

import { MapPin, Calendar, Sparkles, PackageCheck } from 'lucide-react'
import { useTranslation } from '@/shared/lib/i18n'
import type { Listing } from '@/shared/lib/types/database'

interface ListingDetailsGridProps {
  listing: Listing
  categoryName?: string
}

export function ListingDetailsGrid({ listing }: ListingDetailsGridProps) {
  const { t, locale } = useTranslation()

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      <div className="glass-panel border-primary/5 rounded-2xl p-5 transition-transform hover:scale-[1.02]">
        <p className="text-primary/60 mb-2 text-[10px] font-black tracking-[0.3em] uppercase">
          {t('common:condition')}
        </p>
        <div className="text-foreground flex items-center gap-2 text-lg font-black tracking-tight">
          {listing.condition === 'new' ? (
            <>
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <span>{t('common:new')}</span>
            </>
          ) : (
            <>
              <PackageCheck className="h-5 w-5 text-amber-500" />
              <span>{t('common:used')}</span>
            </>
          )}
        </div>
      </div>
      <div className="glass-panel border-primary/5 rounded-2xl p-5 transition-transform hover:scale-[1.02]">
        <p className="text-primary/60 mb-2 text-[10px] font-black tracking-[0.3em] uppercase">
          {t('common:location')}
        </p>
        <div className="text-foreground flex items-center gap-2 text-lg font-black tracking-tight">
          <MapPin className="text-primary h-5 w-5" />
          <span className="truncate">{listing.location}</span>
        </div>
      </div>
      <div className="glass-panel border-primary/5 col-span-2 rounded-2xl p-5 transition-transform hover:scale-[1.02] md:col-span-1">
        <p className="text-primary/60 mb-2 text-[10px] font-black tracking-[0.3em] uppercase">
          {t('common:published')}
        </p>
        <div className="text-foreground flex items-center gap-2 text-lg font-black tracking-tight">
          <Calendar className="h-5 w-5 text-blue-500" />
          <span suppressHydrationWarning>
            {new Date(listing.created_at).toLocaleDateString(locale)}
          </span>
        </div>
      </div>
    </div>
  )
}
