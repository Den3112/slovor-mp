'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, Heart, MapPin, ExternalLink } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/types/database'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function DashboardFavoriteItem({
  listing,
}: {
  listing: Listing & { category?: { name: string } | null }
}) {
  const { locale } = useTranslation()
  return (
    <div className="group border-border/40 bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-primary/5 relative flex flex-col gap-4 rounded-xl border p-4 transition-all duration-300 hover:shadow-lg sm:flex-row sm:items-center">
      {/* Image Thumbnail */}
      <Link
        href={`/${locale}/listings/${listing.id}`}
        className="bg-muted border-border/40 relative h-48 w-full shrink-0 overflow-hidden rounded-xl border transition-all duration-300 group-hover:shadow-md sm:h-28 sm:w-28"
      >
        {listing.images?.[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="bg-muted/50 flex h-full w-full items-center justify-center">
            <Heart className="text-muted-foreground/20 h-8 w-8" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="w-full min-w-0 flex-1 space-y-2.5">
        <Link
          href={`/${locale}/listings/${listing.id}`}
          className="group-hover:text-primary inline-block max-w-full transition-colors"
        >
          <h3 className="truncate text-lg font-bold tracking-tight uppercase">
            {listing.title || 'Untitled Listing'}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-primary text-xl font-bold tracking-tight tabular-nums">
            {listing.price?.toLocaleString()}{' '}
            <span className="text-sm">{listing.currency}</span>
          </span>
          {listing.location && (
            <div className="bg-muted/50 border-border/40 flex items-center gap-1.5 rounded-md border px-2.5 py-1">
              <MapPin className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground/80 text-[10px] font-bold tracking-widest uppercase">
                {listing.location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="border-border/40 flex w-full items-center gap-3 border-t pt-4 sm:w-auto sm:border-0 sm:pt-0">
        <Link
          href={`/${locale}/listings/${listing.id}`}
          className="flex-1 sm:flex-none"
        >
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary hover:border-primary/20 w-full rounded-xl border border-transparent text-xs font-bold tracking-widest uppercase transition-all sm:w-auto"
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
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
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 h-9 w-9 rounded-xl border border-transparent transition-all"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
