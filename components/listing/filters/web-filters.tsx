'use client'

import { SlidersHorizontal } from 'lucide-react'
import { ListingFilters } from './listing-filters'
import { useTranslation } from '@/lib/i18n'

export function ListingWebFilters() {
    const { t } = useTranslation()

    return (
        <aside className="hidden space-y-8 lg:col-span-3 lg:block">
            <div className="sticky top-28">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="flex items-center gap-3 font-heading text-2xl font-black italic tracking-tight text-white">
                        <SlidersHorizontal className="h-6 w-6 text-primary" />
                        {t.filters.title}
                    </h2>
                </div>
                <div className="border-2 border-primary/10 bg-zinc-950 p-8 shadow-2xl">
                    <ListingFilters />
                </div>
            </div>
        </aside>
    )
}
