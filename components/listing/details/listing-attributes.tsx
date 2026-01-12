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
        <div className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 transition-transform hover:scale-105">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                    {t.common.condition}
                </p>
                <div className="flex items-center gap-2 font-bold text-foreground text-lg">
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
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 transition-transform hover:scale-105">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                    {t.common.location}
                </p>
                <div className="flex items-center gap-2 font-bold text-foreground text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="truncate">{listing.location}</span>
                </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 transition-transform hover:scale-105 col-span-2 md:col-span-1">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                    {t.common.published}
                </p>
                <div className="flex items-center gap-2 font-bold text-foreground text-lg">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span suppressHydrationWarning>
                        {new Date(listing.created_at).toLocaleDateString(locale)}
                    </span>
                </div>
            </div>
        </div>
    )
}
