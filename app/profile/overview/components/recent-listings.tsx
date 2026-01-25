import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Plus, ArrowRight } from 'lucide-react'
import { ListingRowActions } from '@/components/profile/listing-row-actions'
import { cn } from '@/lib/utils'

interface RecentListingsProps {
    listings: any[]
}

export function RecentListings({ listings }: RecentListingsProps) {
    return (
        <Card className="relative ml-0 flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl md:rounded-[2.5rem] md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50" />

            <div className="relative z-10 mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-heading text-xl font-black tracking-tight md:text-2xl">
                        Recent Listings
                    </h2>
                    <p className="text-muted-foreground text-xs font-medium md:text-sm">
                        Your latest activity
                    </p>
                </div>
            </div>

            <div className="relative z-10 flex flex-1 flex-col justify-center">
                {listings && listings.length > 0 ? (
                    <div className="flex flex-1 flex-col gap-3">
                        <div className="space-y-3">
                            {listings.slice(0, 3).map((listing) => (
                                <div
                                    key={listing.id}
                                    className="bg-background/40 hover:bg-background/60 hover:border-primary/20 group relative z-10 flex w-full items-center gap-3 rounded-2xl border border-white/5 p-3 transition-all duration-300 hover:shadow-lg md:gap-4 md:rounded-[1.25rem] md:p-3"
                                >
                                    {/* Clickable Area */}
                                    <Link
                                        href={`/listings/${listing.id}`}
                                        className="group/link flex min-w-0 flex-1 items-center gap-3 md:gap-4"
                                    >
                                        <div className="bg-muted relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl shadow-inner md:h-14 md:w-14 md:rounded-2xl">
                                            {listing.images?.[0] ? (
                                                <Image
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover/link:scale-110"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="bg-primary/5 text-primary/40 flex h-full w-full items-center justify-center">
                                                    <Package className="h-4 w-4 md:h-5 md:w-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-foreground group-hover/link:text-primary mb-0.5 truncate text-sm font-bold transition-colors md:text-base">
                                                {listing.title}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <p className="text-muted-foreground text-xs font-medium">
                                                    {listing.price} {listing.currency}
                                                </p>
                                                <span
                                                    className={cn(
                                                        'rounded-md border px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase shadow-sm',
                                                        listing.is_active
                                                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                                                            : 'bg-muted text-muted-foreground border-border/50'
                                                    )}
                                                >
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
                        <div className="mt-auto flex justify-center pt-4">
                            <Link
                                href="/profile/my-listings"
                                className="group/btn text-muted-foreground hover:text-primary hover:bg-primary/5 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors"
                            >
                                View All Listings
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full min-h-[200px] flex-col items-center justify-center py-8 text-center">
                        <div className="mobile:h-20 mobile:w-20 bg-primary/5 mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full">
                            <Plus className="text-primary/40 h-8 w-8 md:h-10 md:w-10" />
                        </div>
                        <h3 className="mb-2 text-lg font-black md:text-xl">
                            No listings yet
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-[220px] text-xs leading-relaxed font-medium md:mb-8 md:text-sm">
                            Start selling today and reach thousands of buyers.
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="shadow-primary/25 hover:shadow-primary/40 rounded-2xl px-6 py-5 text-sm font-bold shadow-xl transition-all hover:scale-105 md:px-8 md:py-6 md:text-base"
                        >
                            <Link href="/post">Create Listing</Link>
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}
