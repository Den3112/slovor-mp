import { SlidersHorizontal } from 'lucide-react'
import { ListingFilters } from '../filters'

interface FiltersSidebarProps {
    t: any
}

export function FiltersSidebar({ t }: FiltersSidebarProps) {
    return (
        <aside className="hidden space-y-8 lg:col-span-3 lg:block">
            <div className="sticky top-28">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xl font-black tracking-tight italic">
                        <SlidersHorizontal className="text-primary h-5 w-5" />
                        {t.filters.title}
                    </h2>
                </div>
                <div className="shadow-premium border-border bg-card rounded-[2rem] border p-6">
                    <ListingFilters />
                </div>
            </div>
        </aside>
    )
}
