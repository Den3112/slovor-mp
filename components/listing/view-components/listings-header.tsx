import { Container } from '@/components/ui/container'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Search } from 'lucide-react'
import { SaveSearchButton } from '../save-search-button'

interface ListingsHeaderProps {
    t: any
    searchQuery?: string
    totalCount: number
    filters: any
}

export function ListingsHeader({
    t,
    searchQuery,
    totalCount,
    filters,
}: ListingsHeaderProps) {
    return (
        <div className="relative mb-8 overflow-hidden border-b border-white/5 pt-24 pb-10 md:mb-12 md:pt-32 md:pb-16">
            <div className="bg-primary/5 absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-500/5 blur-[120px]" />

            <Container>
                <div className="relative z-10 flex flex-col gap-4 md:gap-8">
                    <div className="border-primary/20 bg-primary/5 text-primary inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
                        <Search className="h-3.5 w-3.5" />
                        Explorer
                    </div>

                    <Breadcrumbs
                        items={[
                            {
                                label: searchQuery
                                    ? `${t.common.search}: ${searchQuery}`
                                    : t.common.allListings,
                            },
                        ]}
                    />

                    <h1 className="font-heading text-foreground max-w-4xl text-5xl font-black tracking-tighter italic md:text-8xl">
                        {searchQuery
                            ? `${t.common.search}: ${searchQuery}`
                            : t.common.allListings}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="text-muted-foreground flex items-center gap-3 text-lg font-medium md:text-2xl">
                            <span className="font-heading text-foreground font-black">
                                {totalCount}
                            </span>
                            {totalCount === 1
                                ? t.common.listings.slice(0, -1)
                                : t.common.listings}{' '}
                            {t.common.found}
                        </p>
                        <div className="bg-border mx-2 hidden h-6 w-px md:block" />
                        <SaveSearchButton
                            filters={filters || {}}
                            searchQuery={searchQuery}
                        />
                    </div>
                </div>
            </Container>
        </div>
    )
}
