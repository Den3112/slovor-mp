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
            className="flex items-center gap-4 py-4 border-t border-b border-border/50 group/seller transition-colors hover:bg-muted/30 -mx-4 px-4 sm:mx-0 sm:px-0 sm:hover:bg-transparent"
        >
            <Avatar className="h-12 w-12 border-2 border-primary/20 transition-transform group-hover/seller:scale-105">
                <AvatarImage src={seller.avatar_url || undefined} />
                <AvatarFallback>
                    <UserIcon className="h-6 w-6 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate group-hover/seller:text-primary transition-colors">
                    {seller.display_name || 'Anonymous Seller'}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span suppressHydrationWarning>{t.seller.memberSince} {new Date(seller.created_at).getFullYear()}</span>
                    {seller.verified && (
                        <>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <div className="flex items-center gap-1 text-emerald-600 font-medium">
                                <ShieldCheck className="h-3 w-3" />
                                {t.trust.verified}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Link>
    )
}
