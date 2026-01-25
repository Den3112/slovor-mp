'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, Heart, MapPin } from 'lucide-react'
import type { Listing } from '@/lib/types/database'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function DashboardFavoriteItem({
  listing,
}: {
  listing: Listing & { category?: { name: string } | null }
}) {
  return (
    <div className="group hover:shadow-primary/5 hover:border-primary/20 relative flex flex-col items-start gap-4 rounded-4xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-2xl sm:flex-row sm:items-center md:p-4">
      {/* Image Thumbnail */}
      <Link
        href={`/listings/${listing.id}`}
        className="bg-muted group/image relative h-48 w-full flex-shrink-0 overflow-hidden rounded-3xl shadow-inner sm:h-28 sm:w-28 sm:rounded-2xl"
      >
        {listing.images?.[0] ? (
          <>
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-700 group-hover/image:scale-110"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover/image:bg-black/0" />
          </>
        ) : (
          <div className="text-muted-foreground bg-primary/5 flex h-full w-full items-center justify-center">
            <Heart className="h-8 w-8 opacity-20" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="w-full min-w-0 flex-1 px-1 sm:px-0">
        <Link
          href={`/listings/${listing.id}`}
          className="group-hover:text-primary block transition-colors"
        >
          <h3 className="font-heading mb-1 truncate text-xl font-black tracking-tight">
            {listing.title || 'Untitled Listing'}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span
            className="text-primary text-lg font-black tracking-tight"
            suppressHydrationWarning
          >
            {listing.price?.toLocaleString()} {listing.currency}
          </span>
          {listing.location && (
            <span className="text-muted-foreground/70 flex items-center gap-1 rounded-lg border border-white/5 bg-white/5 px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-2 flex w-full items-center justify-end gap-2 border-t border-white/5 pt-2 sm:mt-0 sm:w-auto sm:border-0 sm:pt-0">
        <Link href={`/listings/${listing.id}`} className="flex-1 sm:flex-none">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/20 hover:text-primary w-full rounded-xl sm:w-auto"
          >
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
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('favorites')
      .delete()
      .eq('listing_id', listingId)
      .eq('user_id', user.id)
    router.refresh()
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleRemove}
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
