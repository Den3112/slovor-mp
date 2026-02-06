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
    <div className="group relative flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-border/50 bg-card p-3 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      {/* Image Thumbnail */}
      <Link
        href={`/${locale}/listings/${listing.id}`}
        className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg bg-muted border border-border/40 sm:h-24 sm:w-24 group-hover:shadow-md transition-all duration-300"
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
          <div className="flex h-full w-full items-center justify-center bg-muted/50">
            <Heart className="h-8 w-8 text-muted-foreground/20" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 w-full space-y-2">
        <Link
          href={`/${locale}/listings/${listing.id}`}
          className="inline-block group-hover:text-primary transition-colors max-w-full"
        >
          <h3 className="font-bold text-base truncate uppercase tracking-tight">
            {listing.title || 'Untitled Listing'}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-primary text-lg font-bold tracking-tight tabular-nums">
            {listing.price?.toLocaleString()} <span className="text-xs">{listing.currency}</span>
          </span>
          {listing.location && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50 border border-border/40">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                {listing.location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto border-t border-border/40 pt-3 sm:border-0 sm:pt-0">
        <Link href={`/${locale}/listings/${listing.id}`} className="flex-1 sm:flex-none">
          <Button
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
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
      className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
