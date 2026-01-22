import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Drawer } from 'vaul'
import { ListingFilters } from '../filters'

import type { TranslationKeys } from '@/lib/i18n/translations'

interface MobileFilterDrawerProps {
    filterOpen: boolean
    setFilterOpen: (open: boolean) => void
    totalCount: number
    t: TranslationKeys
}

export function MobileFilterDrawer({ filterOpen, setFilterOpen, totalCount, t }: MobileFilterDrawerProps) {
    return (
        <div className="mb-6 lg:hidden">
            <Drawer.Root open={filterOpen} onOpenChange={setFilterOpen}>
                <Drawer.Trigger asChild>
                    <button className="flex w-full items-center justify-between border-2 border-primary/20 bg-zinc-950 p-6 font-sans text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all active:scale-[0.98]">
                        <div className="flex items-center gap-3">
                            <SlidersHorizontal className="h-5 w-5 text-primary" />
                            <span>{t.filters.title}</span>
                        </div>
                        <div className="flex h-6 w-6 items-center justify-center border border-primary/20 bg-primary/5 text-xs text-primary">
                            +
                        </div>
                    </button>
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md" />
                    <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[85vh] flex-col border-t-2 border-primary/20 bg-background outline-none">
                        <div className="p-6 bg-zinc-950 flex-shrink-0 border-b-2 border-primary/10">
                            <div className="mx-auto w-12 h-1 flex-shrink-0 bg-primary/20 mb-8" />
                            <div className="flex items-center justify-between px-2">
                                <Drawer.Title className="font-heading text-3xl font-bold italic tracking-tight text-white">
                                    {t.filters.title}
                                </Drawer.Title>
                                <Drawer.Close asChild>
                                    <button className="p-2 -mr-2 text-zinc-500 hover:text-white transition-colors">
                                        <X className="h-7 w-7" />
                                    </button>
                                </Drawer.Close>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8">
                            <ListingFilters />
                        </div>
                        <div className="p-6 border-t-2 border-primary/10 bg-zinc-950 safe-bottom">
                            <Button className="w-full h-16 rounded-none font-sans text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/10" onClick={() => setFilterOpen(false)}>
                                Show {totalCount} {t.common.listings}
                            </Button>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </div>
    )
}
