'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, Heart } from 'lucide-react'
import type { Listing } from '@/lib/types/database'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function DashboardFavoriteItem({ listing }: { listing: Listing & { category?: { name: string } | null } }) {
    return (
        <div className="group relative flex items-center gap-4 rounded-2xl border border-border/40 bg-card p-3 transition-all hover:bg-muted/30 hover:border-primary/20">
            {/* Image Thumbnail */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                {listing.images?.[0] ? (
                    <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Heart className="h-8 w-8 opacity-20" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <Link href={`/listings/${listing.id}`} className="hover:underline">
                    <h3 className="truncate font-heading text-lg font-bold">
                        {listing.title || 'Untitled Listing'}
                    </h3>
                </Link>

                <div className="flex items-center gap-4 mt-1">
                    <span className="font-bold text-primary" suppressHydrationWarning>
                        {listing.price?.toLocaleString()} {listing.currency}
                    </span>
                    {listing.location && (
                        <span className="text-xs text-muted-foreground">
                            {listing.location}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pr-2">
                <Link href={`/listings/${listing.id}`}>
                    <Button variant="outline" size="sm" className="rounded-xl">
                        View
                    </Button>
                </Link>
                <RemoveFavoriteButton listingId={listing.id} />
            </div>
        </div>
    )
}

function RemoveFavoriteButton({ listingId }: { listingId: string }) {
    const router = useRouter()
    const supabase = createClient()

    const handleRemove = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        await supabase.from('favorites').delete().eq('listing_id', listingId).eq('user_id', user.id)
        router.refresh()
    }

    return (
        <Button size="icon" variant="ghost" onClick={handleRemove} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
