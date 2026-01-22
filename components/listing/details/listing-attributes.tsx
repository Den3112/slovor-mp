'use client'

import { MapPin, Calendar, Sparkles, PackageCheck } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/types/database'

interface ListingDetailsGridProps {
    listing: Listing
    categoryName?: string
}

export function ListingDetailsGrid({ listing }: ListingDetailsGridProps) {
    const { t, locale } = useTranslation()

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="border-2 border-primary/10 bg-zinc-950/80 p-6 transition-all hover:bg-primary/5 hover:border-primary/40 group">
                <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 group-hover:text-primary transition-colors">
                    {t.common.condition}
                </p>
                <div className="flex items-center gap-3 font-sans text-lg font-bold text-white uppercase tracking-widest">
                    {listing.condition === 'new' ? (
                        <>
                            <Sparkles className="h-5 w-5 text-emerald-500" />
                            <span>{t.common.new}</span>
                        </>
                    ) : (
                        <>
                            <PackageCheck className="h-5 w-5 text-amber-500" />
                            <span>{t.common.used}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="border-2 border-primary/10 bg-zinc-950/80 p-6 transition-all hover:bg-primary/5 hover:border-primary/40 group">
                <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 group-hover:text-primary transition-colors">
                    {t.common.location}
                </p>
                <div className="flex items-center gap-3 font-sans text-lg font-bold text-white uppercase tracking-widest">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="truncate">{listing.location}</span>
                </div>
            </div>

            <div className="border-2 border-primary/10 bg-zinc-950/80 p-6 transition-all hover:bg-primary/5 hover:border-primary/40 group">
                <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 group-hover:text-primary transition-colors">
                    {t.common.published}
                </p>
                <div className="flex items-center gap-3 font-sans text-lg font-bold text-white uppercase tracking-widest">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span suppressHydrationWarning>
                        {new Date(listing.created_at).toLocaleDateString(locale)}
                    </span>
                </div>
            </div>
        </div>
    )
}
