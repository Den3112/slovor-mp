'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, Heart, MapPin } from 'lucide-react'
import type { Listing } from '@/lib/types/database'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function DashboardFavoriteItem({ listing }: { listing: Listing & { category?: { name: string } | null } }) {
    return (
        <div className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-3 md:p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5">
            {/* Image Thumbnail */}
            <Link href={`/listings/${listing.id}`} className="relative h-48 w-full sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-3xl sm:rounded-2xl bg-muted shadow-inner group/image">
                {listing.images?.[0] ? (
                    <>
                        <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover/image:scale-110"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover/image:bg-black/0 transition-colors" />
                    </>
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-primary/5">
                        <Heart className="h-8 w-8 opacity-20" />
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0 w-full px-1 sm:px-0">
                <Link href={`/listings/${listing.id}`} className="block group-hover:text-primary transition-colors">
                    <h3 className="truncate font-heading text-xl font-black tracking-tight mb-1">
                        {listing.title || 'Untitled Listing'}
                    </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                    <span className="text-lg font-black text-primary tracking-tight" suppressHydrationWarning>
                        {listing.price?.toLocaleString()} {listing.currency}
                    </span>
                    {listing.location && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                            <MapPin className="h-3 w-3" />
                            {listing.location}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5 justify-end">
                <Link href={`/listings/${listing.id}`} className="flex-1 sm:flex-none">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto rounded-xl hover:bg-primary/20 hover:text-primary">
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
