'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DashboardListingCard } from '@/components/profile/listing-card' // CHANGED IMPORT
import { EmptyState } from '@/components/ui/empty-state'
import { PackageOpen } from 'lucide-react'

import type { Listing } from '@/lib/api'

interface ContentProps {
  all: Listing[]
  active: Listing[]
  drafts: Listing[]
  sold: Listing[]
  archived: Listing[]
}

export function DashboardListingsContent({
  all,
  active,
  drafts,
  sold,
  archived,
}: ContentProps) {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-background/60 mb-8 h-auto w-full justify-between gap-1 overflow-x-auto rounded-[1.25rem] border border-white/10 p-1 backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] md:justify-start md:p-1.5 [&::-webkit-scrollbar]:hidden">
          <TabsTrigger
            value="all"
            className="mobile:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary/25 flex-1 rounded-xl px-1 py-2 text-[10px] font-bold transition-all duration-300 data-[state=active]:shadow-lg md:flex-none md:px-4 md:py-2.5 md:text-sm"
          >
            All{' '}
            <span className="bg-background/20 ml-1 rounded-md px-1 py-0.5 text-[9px] opacity-80 md:ml-2 md:px-1.5 md:text-[10px]">
              {all.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="mobile:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary/25 flex-1 rounded-xl px-1 py-2 text-[10px] font-bold transition-all duration-300 data-[state=active]:shadow-lg md:flex-none md:px-4 md:py-2.5 md:text-sm"
          >
            Active{' '}
            <span className="bg-background/20 ml-1 rounded-md px-1 py-0.5 text-[9px] opacity-80 md:ml-2 md:px-1.5 md:text-[10px]">
              {active.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="mobile:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary/25 flex-1 rounded-xl px-1 py-2 text-[10px] font-bold transition-all duration-300 data-[state=active]:shadow-lg md:flex-none md:px-4 md:py-2.5 md:text-sm"
          >
            Drafts{' '}
            <span className="bg-background/20 ml-1 rounded-md px-1 py-0.5 text-[9px] opacity-80 md:ml-2 md:px-1.5 md:text-[10px]">
              {drafts.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="sold"
            className="mobile:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary/25 flex-1 rounded-xl px-1 py-2 text-[10px] font-bold transition-all duration-300 data-[state=active]:shadow-lg md:flex-none md:px-4 md:py-2.5 md:text-sm"
          >
            Sold{' '}
            <span className="bg-background/20 ml-1 rounded-md px-1 py-0.5 text-[9px] opacity-80 md:ml-2 md:px-1.5 md:text-[10px]">
              {sold.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="mobile:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary/25 flex-1 rounded-xl px-1 py-2 text-[10px] font-bold transition-all duration-300 data-[state=active]:shadow-lg md:flex-none md:px-4 md:py-2.5 md:text-sm"
          >
            Archived{' '}
            <span className="bg-background/20 ml-1 rounded-md px-1 py-0.5 text-[9px] opacity-80 md:ml-2 md:px-1.5 md:text-[10px]">
              {archived.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {all.length > 0 ? (
            <div className="grid gap-4">
              {all.map((listing, index) => (
                <DashboardListingCard
                  key={listing.id}
                  listing={listing}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageOpen}
              title="No listings"
              description="You haven't created any listings yet."
            />
          )}
        </TabsContent>

        <TabsContent value="active">
          {active.length > 0 ? (
            <div className="grid gap-4">
              {active.map((listing, index) => (
                <DashboardListingCard
                  key={listing.id}
                  listing={listing}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageOpen}
              title="No active listings"
              description="You don't have any active listings yet."
            />
          )}
        </TabsContent>

        <TabsContent value="draft">
          {drafts.length > 0 ? (
            <div className="grid gap-4">
              {drafts.map((listing, index) => (
                <DashboardListingCard
                  key={listing.id}
                  listing={listing}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageOpen}
              title="No drafts"
              description="Start creating a listing to see it here."
            />
          )}
        </TabsContent>

        <TabsContent value="sold">
          {sold.length > 0 ? (
            <div className="grid gap-4">
              {sold.map((listing, index) => (
                <DashboardListingCard
                  key={listing.id}
                  listing={listing}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageOpen}
              title="No sold items"
              description="Items you mark as sold will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="archived">
          {archived.length > 0 ? (
            <div className="grid gap-4">
              {archived.map((listing, index) => (
                <DashboardListingCard
                  key={listing.id}
                  listing={listing}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageOpen}
              title="No archived items"
              description="Deleted listings appear here."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
