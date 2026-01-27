'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User as UserIcon, ShieldCheck } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/types/database'

interface SellerInfoCardProps {
  seller: NonNullable<Listing['user']>
}

export function SellerInfoCard({ seller }: SellerInfoCardProps) {
  const { t } = useTranslation()

  return (
    <Link
      href={`/seller/${seller.id}`}
      className="border-border/50 group/seller hover:bg-muted/30 -mx-4 flex items-center gap-4 border-t border-b px-4 py-4 transition-colors sm:mx-0 sm:px-0 sm:hover:bg-transparent"
    >
      <Avatar className="border-primary/20 h-12 w-12 border-2 transition-transform group-hover/seller:scale-105">
        <AvatarImage src={seller.avatar_url || undefined} />
        <AvatarFallback>
          <UserIcon className="text-muted-foreground h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-foreground group-hover/seller:text-primary truncate font-bold transition-colors">
          {seller.display_name || 'Anonymous Seller'}
        </p>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span suppressHydrationWarning>
            {t('seller.memberSince')} {new Date(seller.created_at).getFullYear()}
          </span>
          {seller.verified && (
            <>
              <span className="bg-border h-1 w-1 rounded-full" />
              <div className="flex items-center gap-1 font-medium text-emerald-600">
                <ShieldCheck className="h-3 w-3" />
                {t('trust.verified')}
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
