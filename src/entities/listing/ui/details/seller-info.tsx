'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { User as UserIcon, ShieldCheck } from 'lucide-react'
import { useTranslation } from '@/shared/lib/i18n'
import type { Listing } from '@/shared/lib/types/database'

interface SellerInfoCardProps {
  seller: NonNullable<Listing['user']>
}

export function SellerInfoCard({ seller }: SellerInfoCardProps) {
  const { t, locale } = useTranslation(['listing', 'seller', 'trust', 'common'])

  return (
    <Link
      href={`/${locale}/seller/${seller.id}`}
      className="group/seller flex items-center gap-4 py-1 transition-all"
    >
      <Avatar className="ring-primary/10 group-hover/seller:ring-primary/20 h-14 w-14 ring-4 transition-transform group-hover/seller:scale-105">
        <AvatarImage src={seller.avatar_url || undefined} />
        <AvatarFallback className="bg-primary/5">
          <UserIcon className="text-primary/40 h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-foreground group-hover/seller:text-primary truncate text-base font-black tracking-tight transition-colors">
          {seller.display_name || 'Anonymous Seller'}
        </p>
        <div className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
          <span suppressHydrationWarning className="opacity-70">
            {t('seller:memberSince')}{' '}
            {new Date(seller.created_at).getFullYear()}
          </span>
          {seller.verified && (
            <>
              <div className="h-1 w-1 rounded-full bg-emerald-500/40" />
              <div className="flex items-center gap-1 text-emerald-500">
                <ShieldCheck className="h-3 w-3" />
                {t('trust:verified')}
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
