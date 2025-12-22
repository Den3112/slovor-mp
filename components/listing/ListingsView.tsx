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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {searchQuery
                        ? `${t.common.search}: "${searchQuery}"`
                        : t.common.allListings
                    }
                </h1>
                <p className="text-gray-600">
                    {listings.length} {t.common.found}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                    <Suspense fallback={<div className="h-64 bg-gray-100 rounded-lg animate-pulse" />}>
                        <ListingFilters />
                    </Suspense>
                </aside>

                <main className="lg:col-span-3">
                    {error ? (
                        <ErrorState message={error} />
                    ) : (
                        <ListingGrid listings={listings} />
                    )}
                </main>
            </div>
        </div>
    )
}
