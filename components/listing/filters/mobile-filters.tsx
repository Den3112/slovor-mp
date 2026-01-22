'use client'

import { useState } from 'react'
import { Drawer } from 'vaul'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingFilters } from './listing-filters'
import { useTranslation } from '@/lib/i18n'

interface ListingMobileFiltersProps {
    totalCount: number
}

export function ListingMobileFilters({ totalCount }: ListingMobileFiltersProps) {
    const { t } = useTranslation()
    const [filterOpen, setFilterOpen] = useState(false)

    return (
        <div className="mb-6 lg:hidden">
            <Drawer.Root open={filterOpen} onOpenChange={setFilterOpen}>
                <Drawer.Trigger asChild>
                    <button className="flex w-full items-center justify-between border-2 border-primary/10 bg-zinc-950 p-6 font-sans text-xs font-bold uppercase tracking-widest text-white transition-all active:scale-95">
                        <div className="flex items-center gap-3">
                            <SlidersHorizontal className="h-5 w-5 text-primary" />
                            <span>{t.filters.title}</span>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center border-2 border-primary/20 bg-primary/10 text-xs text-primary">
                            +
                        </div>
                    </button>
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md" />
                    <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[90vh] flex-col border-t-4 border-primary bg-zinc-950 outline-none">
                        <div className="p-6 bg-zinc-950 flex-shrink-0 border-b-2 border-primary/10">
                            <div className="mx-auto w-16 h-1 flex-shrink-0 bg-primary/20 mb-8" />
                            <div className="flex items-center justify-between">
                                <Drawer.Title className="font-heading text-3xl font-black italic tracking-tight text-white">
                                    {t.filters.title}
                                </Drawer.Title>
                                <Drawer.Close asChild>
                                    <button className="p-3 border-2 border-primary/10 text-white hover:bg-primary/10 transition-colors">
                                        <X className="h-6 w-6" />
                                    </button>
                                </Drawer.Close>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-zinc-900/30">
                            <ListingFilters />
                        </div>
                        <div className="p-6 border-t-2 border-primary/10 bg-zinc-950 safe-bottom">
                            <Button className="w-full text-xs font-bold uppercase tracking-[0.2em] h-16 rounded-none shadow-xl shadow-primary/20" onClick={() => setFilterOpen(false)}>
                                Show {totalCount} Listings
                            </Button>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </div>
    )
}
