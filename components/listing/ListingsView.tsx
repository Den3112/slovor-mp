'use client'

import { Suspense } from 'react'
import { ListingGrid } from '@/components/listing/grid'
import { ListingFilters } from '@/components/listing/filters'
import { ErrorState } from '@/components/ui/error-state'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/supabase/queries'

interface ListingsViewProps {
    listings: Listing[]
    error: string | null
    searchQuery?: string
}

export function ListingsView({ listings, error, searchQuery }: ListingsViewProps) {
    const { t } = useTranslation()

    return (
        <div className="container mx-auto px-4 py-16 overflow-x-hidden">
            <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                            {searchQuery
                                ? `${t.common.search}: "${searchQuery}"`
                                : t.common.allListings
                            }
                        </h1>
                        <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                        {listings.length} {t.common.found}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <aside className="lg:col-span-1">
                    <div className="sticky top-28">
                        <Suspense fallback={<div className="h-96 bg-gray-100 rounded-[2.5rem] animate-pulse" />}>
                            <ListingFilters />
                        </Suspense>
                    </div>
                </aside>

                <main className="lg:col-span-3">
                    {error ? (
                        <div className="p-12 bg-red-50 text-red-600 rounded-[3rem] border border-red-100 text-center font-black">
                            {error}
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                            <ListingGrid listings={listings} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
