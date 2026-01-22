import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Plus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ListingRowActions } from '@/components/profile/listing-row-actions'

import type { Listing } from '@/lib/types/database'

interface RecentListingsProps {
    listings: Listing[]
}

export function RecentListings({ listings }: RecentListingsProps) {
    return (
        <Card className="flex flex-col p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl h-full ml-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                <div>
                    <h2 className="font-heading text-xl md:text-2xl font-black tracking-tight">Recent Listings</h2>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">Your latest activity</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-10">
                {listings && listings.length > 0 ? (
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="space-y-3">
                            {listings.slice(0, 3).map(listing => (
                                <div key={listing.id} className="relative z-10 w-full flex items-center gap-3 md:gap-4 p-3 md:p-3 rounded-2xl md:rounded-[1.25rem] bg-background/40 border border-white/5 hover:bg-background/60 hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
                                    {/* Clickable Area */}
                                    <Link href={`/listings/${listing.id}`} className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 group/link">
                                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-muted overflow-hidden flex-shrink-0 relative shadow-inner">
                                            {listing.images?.[0] ? (
                                                <Image
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover/link:scale-110"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-primary/5 text-primary/40">
                                                    <Package className="h-4 w-4 md:h-5 md:w-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm md:text-base truncate text-foreground group-hover/link:text-primary transition-colors mb-0.5">{listing.title}</h4>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-muted-foreground font-medium">{listing.price} {listing.currency}</p>
                                                <span className={cn(
                                                    "px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border shadow-sm",
                                                    listing.is_active
                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                        : 'bg-muted text-muted-foreground border-border/50'
                                                )}>
                                                    {listing.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Actions */}
                                    <ListingRowActions listing={listing} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-4 flex justify-center">
                            <Link href="/profile/my-listings" className="group/btn text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5">
                                View All Listings
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center h-full min-h-[200px]">
                        <div className="h-16 w-16 mobile:h-20 mobile:w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 animate-pulse">
                            <Plus className="h-8 w-8 md:h-10 md:w-10 text-primary/40" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black mb-2">No listings yet</h3>
                        <p className="text-muted-foreground text-xs md:text-sm mb-6 md:mb-8 max-w-[220px] font-medium leading-relaxed">
                            Start selling today and reach thousands of buyers.
                        </p>
                        <Button asChild size="lg" className="rounded-2xl font-bold px-6 md:px-8 py-5 md:py-6 text-sm md:text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all">
                            <Link href="/post">
                                Create Listing
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}
