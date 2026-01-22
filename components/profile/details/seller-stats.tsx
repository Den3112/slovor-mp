'use client'

import { Star } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface SellerStatsProps {
    listingCount: number
}

export function SellerStats({ listingCount }: SellerStatsProps) {
    const { t } = useTranslation()

    return (
        <div className="grid grid-cols-2 gap-0 w-full border-t-2 border-primary/10 py-8">
            <div className="text-center group cursor-default border-r-2 border-primary/10">
                <p className="font-sans text-4xl font-black text-white transition-all group-hover:scale-110">
                    {listingCount}
                </p>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-2">
                    {t.seller.activeListings}
                </p>
            </div>
            <div className="text-center group cursor-default">
                <div className="flex items-center justify-center gap-1.5 px-4">
                    <span className="font-sans text-4xl font-black text-white transition-all group-hover:scale-110">
                        —
                    </span>
                    <Star className="h-5 w-5 text-primary fill-primary mb-1" />
                </div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-2">
                    {t.seller.rating}
                </p>
            </div>
        </div>
    )
}
