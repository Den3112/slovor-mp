'use client'

import Image from 'next/image'
import { User, ShieldCheck, MapPin, Calendar, Star } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { Profile } from '@/lib/types/database'

interface ProfileCardProps {
  seller: Profile
  listingsCount: number
  ratingData: {
    averageRating: number
    totalReviews: number
  } | null
  memberSince: string
}

export function ProfileCard({
  seller,
  listingsCount,
  ratingData,
  memberSince,
}: ProfileCardProps) {
  const { t } = useTranslation(['seller', 'trust'])

  return (
    <div className="group bg-card border-border relative flex flex-col overflow-hidden rounded-3xl border shadow-md transition-all duration-500 hover:shadow-xl dark:shadow-none">
      <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-50" />
      <div className="from-primary/5 to-primary/5 absolute inset-0 bg-linear-to-r via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 space-y-8 p-8">
        {/* Avatar & Verification */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="bg-primary/20 group-hover:bg-primary/30 absolute -inset-4 animate-pulse rounded-full blur-xl transition-all" />
            {seller.avatar_url ? (
              <Image
                src={seller.avatar_url}
                alt={seller.display_name ?? seller.username ?? ''}
                width={112}
                height={112}
                unoptimized
                className="relative h-28 w-28 rounded-full border-4 border-white/20 object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="from-primary to-primary/60 shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg">
                <User className="text-muted-foreground/30 h-10 w-10" />
              </div>
            )}
            {seller.verified && (
              <div className="ring-background absolute -right-2 -bottom-2 rounded-full bg-blue-500 p-2 text-white shadow-lg ring-4 shadow-blue-500/40">
                <ShieldCheck className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* Name & Badge */}
          <div className="from-primary/20 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-50" />
          <div className="space-y-3">
            <h1 className="from-foreground to-foreground/60 bg-linear-to-r bg-clip-text text-2xl leading-tight font-black tracking-tight text-transparent uppercase sm:text-3xl">
              {seller.display_name ?? seller.username}
            </h1>
            {seller.verified && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">
                  {t('trust:verified')}
                </span>
              </div>
            )}
          </div>

          {/* Bio */}
          {seller.bio && (
            <p className="text-muted-foreground/80 mt-6 max-w-xs text-sm leading-relaxed font-medium">
              {seller.bio}
            </p>
          )}

          {/* Stats - Glass Row */}
          <div className="mt-8 grid w-full grid-cols-2 gap-4 border-t border-white/10 pt-8">
            <div className="group/stat rounded-2xl border border-white/5 bg-white/5 p-4 text-center transition-colors hover:bg-white/10">
              <p className="text-foreground text-3xl font-black tracking-tight">
                {listingsCount}
              </p>
              <p className="text-muted-foreground mt-1 text-[9px] font-bold tracking-widest uppercase opacity-60 transition-opacity group-hover/stat:opacity-100">
                {t('seller:activeListings')}
              </p>
            </div>
            <div className="group/stat rounded-2xl border border-white/5 bg-white/5 p-4 text-center transition-colors hover:bg-white/10">
              <div className="flex items-center justify-center gap-2">
                <span className="text-foreground text-3xl leading-none font-black tracking-tight">
                  {ratingData?.averageRating || '—'}
                </span>
                <Star className="mb-1 h-5 w-5 fill-amber-500 text-amber-500" />
              </div>
              <p className="text-muted-foreground mt-1 text-[9px] font-bold tracking-widest uppercase opacity-60 transition-opacity group-hover/stat:opacity-100">
                {t('seller:rating')}
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="w-full space-y-3 pt-6">
            {seller.location && (
              <div className="text-muted-foreground/80 bg-muted/50 border-border/50 flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold tracking-widest uppercase shadow-sm">
                <MapPin className="text-primary h-3.5 w-3.5" />
                <span className="text-foreground">{seller.location}</span>
              </div>
            )}
            <div className="text-muted-foreground/60 flex items-center justify-center gap-2 pt-2">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                {t('seller:memberSince')} {memberSince}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
