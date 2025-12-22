'use client'

import { ListingGrid } from '@/components/listing/grid'
import { ErrorState } from '@/components/ui/error-state'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/i18n'
import type { Category, Listing } from '@/lib/types/database'

interface CategoryViewProps {
    category: Category
    listings: Listing[]
    listingsError: string | null
}

export function CategoryView({ category, listings, listingsError }: CategoryViewProps) {
    const { t, locale } = useTranslation()

    // Dynamic locale check
    const categoryName = (() => {
        if (locale === 'sk') return category.name_sk || category.name
        if (locale === 'cs') return category.name_cs || category.name
        if (locale === 'en') return category.name_en || category.name
        return t.categories[category.slug] || category.name
    })()

    return (
        <div className="container mx-auto px-4 py-12 overflow-x-hidden">
            <Breadcrumbs
                items={[
                    { label: t.common.categories, href: '/listings' },
                    { label: categoryName },
                ]}
            />

            <div className="mb-12 mt-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {category.icon && (
                        <div className="text-6xl bg-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm border border-gray-100">
                            {category.icon}
                        </div>
                    )}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">{categoryName}</h1>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-0 font-bold px-3">
                                {listings.length} {t.common.listings} {t.common.found}
                            </Badge>
                            <div className="h-1 flex-1 bg-gray-100 rounded-full hidden md:block w-32"></div>
                        </div>
                    </div>
                </div>
            </div>

            {listingsError ? (
                <ErrorState message={listingsError} />
            ) : (
                <ListingGrid listings={listings} />
            )}
        </div>
    )
}
