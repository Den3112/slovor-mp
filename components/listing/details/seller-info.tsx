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
            className="flex items-center gap-6 py-10 border-y-2 border-primary/10 group/seller transition-all hover:bg-primary/5 -mx-6 px-6 sm:mx-0 sm:px-0"
        >
            <Avatar className="h-20 w-20 rounded-none border-2 border-primary/20 transition-transform group-hover/seller:rotate-3">
                <AvatarImage src={seller.avatar_url || undefined} className="rounded-none object-cover" />
                <AvatarFallback className="rounded-none bg-zinc-900">
                    <UserIcon className="h-10 w-10 text-primary/40" />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="font-heading text-2xl font-bold text-white transition-colors group-hover/seller:text-primary italic">
                    {seller.display_name || 'Anonymous Seller'}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <span suppressHydrationWarning>{t.seller.memberSince} {new Date(seller.created_at).getFullYear()}</span>
                    {seller.verified && (
                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-2 py-1 border border-emerald-500/20">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>{t.trust.verified}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
