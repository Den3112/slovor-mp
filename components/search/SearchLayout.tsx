'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

interface SearchLayoutProps {
    children: React.ReactNode
    sidebar: React.ReactNode
}

export function SearchLayout({ children, sidebar }: SearchLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8 lg:flex-row">
                {/* Desktop Sidebar */}
                <aside className="hidden w-64 flex-shrink-0 lg:block">
                    <div className="sticky top-24 space-y-8">
                        {sidebar}
                    </div>
                </aside>

                {/* Mobile Filter Drawer */}
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden w-full gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                        <SheetTitle>Filters</SheetTitle>
                        <div className="mt-6">
                            {sidebar}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
