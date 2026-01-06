'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DashboardListingCard } from '@/components/dashboard/listing-card'
import { EmptyState } from '@/components/ui/empty-state'
import { PackageOpen } from 'lucide-react'

import type { Listing } from '@/lib/api'

interface ContentProps {
    active: Listing[]
    drafts: Listing[]
    sold: Listing[]
    archived: Listing[]
}

export function DashboardListingsContent({ active, drafts, sold, archived }: ContentProps) {
    const [activeTab, setActiveTab] = useState('active')

    return (
        <div className="w-full">
            <Tabs className="w-full">
                <TabsList>
                    <TabsTrigger value="active" activeValue={activeTab} setActiveValue={setActiveTab}>
                        Active <span className="ml-2 text-xs opacity-60">{active.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="draft" activeValue={activeTab} setActiveValue={setActiveTab}>
                        Drafts <span className="ml-2 text-xs opacity-60">{drafts.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="sold" activeValue={activeTab} setActiveValue={setActiveTab}>
                        Sold <span className="ml-2 text-xs opacity-60">{sold.length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="archived" activeValue={activeTab} setActiveValue={setActiveTab}>
                        Archived <span className="ml-2 text-xs opacity-60">{archived.length}</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active" activeValue={activeTab}>
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

                <TabsContent value="draft" activeValue={activeTab}>
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

                <TabsContent value="sold" activeValue={activeTab}>
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

                <TabsContent value="archived" activeValue={activeTab}>
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
