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

export function DashboardListingsContent({ all, active, drafts, sold, archived }: ContentProps) {
    const [activeTab, setActiveTab] = useState('all')

    return (
        <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-between md:justify-start overflow-x-auto rounded-none bg-zinc-950 p-1 md:p-2 border-2 border-primary/10 mb-10 h-auto gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <TabsTrigger
                        value="all"
                        className="rounded-none flex-1 md:flex-none px-1 md:px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
                    >
                        All <span className="ml-2 border border-white/20 px-1.5 py-0.5 text-[9px] opacity-80">{all.length}</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="active"
                        className="rounded-none flex-1 md:flex-none px-1 md:px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
                    >
                        Active <span className="ml-2 border border-white/20 px-1.5 py-0.5 text-[9px] opacity-80">{active.length}</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="draft"
                        className="rounded-none flex-1 md:flex-none px-1 md:px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
                    >
                        Drafts <span className="ml-2 border border-white/20 px-1.5 py-0.5 text-[9px] opacity-80">{drafts.length}</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="sold"
                        className="rounded-none flex-1 md:flex-none px-1 md:px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
                    >
                        Sold <span className="ml-2 border border-white/20 px-1.5 py-0.5 text-[9px] opacity-80">{sold.length}</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="archived"
                        className="rounded-none flex-1 md:flex-none px-1 md:px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
                    >
                        Archived <span className="ml-2 border border-white/20 px-1.5 py-0.5 text-[9px] opacity-80">{archived.length}</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    {all.length > 0 ? (
                        <div className="grid gap-4">
                            {all.map((listing, index) => (
                                <DashboardListingCard key={listing.id} listing={listing} priority={index < 2} />
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
                                <DashboardListingCard key={listing.id} listing={listing} priority={index < 2} />
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
                                <DashboardListingCard key={listing.id} listing={listing} priority={index < 2} />
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
                                <DashboardListingCard key={listing.id} listing={listing} priority={index < 2} />
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
                                <DashboardListingCard key={listing.id} listing={listing} priority={index < 2} />
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
