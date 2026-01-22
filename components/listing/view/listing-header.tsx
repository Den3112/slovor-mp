'use client'

import { Search } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { SaveSearchButton } from '@/components/listing/shared'
import { useTranslation } from '@/lib/i18n'
import type { ListingFilterOptions } from '@/lib/api/listings'

interface ListingHeaderProps {
    searchQuery?: string
    totalCount: number
    filters?: ListingFilterOptions
}

export function ListingHeader({ searchQuery, totalCount, filters }: ListingHeaderProps) {
    const { t } = useTranslation()

    return (
        <div className="relative mb-8 border-b-2 border-primary/10 bg-zinc-950 pb-10 pt-24 md:mb-12 md:pb-16 md:pt-40">
            {/* Architectural Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <Container>
                <div className="relative z-10 flex flex-col gap-6 md:gap-10">
                    <div className="inline-flex w-fit items-center gap-3 border-2 border-primary/20 bg-primary/10 px-6 py-2 font-sans text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                        <Search className="h-4 w-4" />
                        Explorer
                    </div>

                    <div className="flex flex-col gap-2">
                        <Breadcrumbs
                            items={[
                                {
                                    label: searchQuery
                                        ? `${t.common.search}: ${searchQuery}`
                                        : t.common.allListings,
                                },
                            ]}
                        />

                        <h1 className="max-w-5xl font-heading text-6xl font-black italic tracking-tighter text-white md:text-[10rem] leading-[0.85]">
                            {searchQuery
                                ? searchQuery
                                : t.common.allListings}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-4 border-2 border-primary/10 bg-zinc-900 px-6 py-4">
                            <span className="font-heading text-4xl font-black italic text-primary leading-none">
                                {totalCount}
                            </span>
                            <span className="font-sans text-sm font-bold uppercase tracking-widest text-zinc-400">
                                {totalCount === 1
                                    ? t.common.listings.slice(0, -1)
                                    : t.common.listings}{' '}
                                {t.common.found}
                            </span>
                        </div>
                        <SaveSearchButton filters={filters || {}} searchQuery={searchQuery} />
                    </div>
                </div>
            </Container>

            {/* Dynamic Corner Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 border-b-2 border-l-2 border-primary/20 bg-primary/5" />
        </div>
    )
}
