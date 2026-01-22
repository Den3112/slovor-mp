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
        <div className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 border-2 border-primary/10 bg-zinc-950 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-zinc-900 hover:-translate-y-1">
            {/* Image Thumbnail */}
            <Link href={`/listings/${listing.id}`} className="relative h-48 w-full sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden border-2 border-primary/10 bg-muted group/image">
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
                    <div className="flex h-full w-full items-center justify-center text-zinc-800 bg-primary/5">
                        <Heart className="h-10 w-10 opacity-20" />
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0 w-full">
                <Link href={`/listings/${listing.id}`} className="block group-hover:text-primary transition-colors">
                    <h3 className="truncate font-heading text-2xl font-bold italic tracking-tight mb-2 text-white">
                        {listing.title || 'Untitled Listing'}
                    </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-6 mt-4">
                    <span className="font-sans text-xl font-black text-primary tracking-tight" suppressHydrationWarning>
                        {listing.price?.toLocaleString()} {listing.currency}
                    </span>
                    {listing.location && (
                        <span className="flex items-center gap-2 border-2 border-primary/10 bg-zinc-950/50 px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <MapPin className="h-3.5 w-3.5" />
                            {listing.location}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t-2 sm:border-0 border-primary/10 justify-end">
                <Link href={`/listings/${listing.id}`} className="flex-1 sm:flex-none">
                    <Button variant="outline" size="sm" className="h-12 w-full sm:w-24 rounded-none border-2 border-primary/10 font-sans text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-primary hover:text-white">
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
        <Button size="icon" variant="outline" onClick={handleRemove} className="h-12 w-12 rounded-none border-2 border-primary/10 text-zinc-500 hover:text-destructive hover:border-destructive/30 transition-all">
            <Trash2 className="h-5 w-5" />
        </Button>
    )
}
