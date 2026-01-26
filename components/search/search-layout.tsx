'use client'

import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'

interface SearchLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
}

export function SearchLayout({ children, sidebar }: SearchLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-24 space-y-8">{sidebar}</div>
        </aside>

        {/* Mobile Filter Drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2 lg:hidden">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] overflow-y-auto sm:w-[400px]"
          >
            <SheetTitle>Filters</SheetTitle>
            <div className="mt-6">{sidebar}</div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
