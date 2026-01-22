'use client'

import Image from 'next/image'
import {
    MapPin,
    Calendar,
    ShieldCheck,
    User,
} from 'lucide-react'
import type { Profile } from '@/lib/types/database'
import { useTranslation } from '@/lib/i18n'
import { SellerStats } from './seller-stats'

interface SellerProfileCardProps {
    seller: Profile
    listingCount: number
}

export function SellerProfileCard({ seller, listingCount }: SellerProfileCardProps) {
    const { t, locale } = useTranslation()

    // Calculate member since date
    const memberSince = new Date(seller.created_at).toLocaleDateString(locale === 'sk' ? 'sk-SK' : locale === 'cs' ? 'cs-CZ' : 'en-US', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="relative border-2 border-primary/20 bg-zinc-950 p-1 shadow-2xl">
            {/* Architectural Background Noise */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

            <div className="relative border-2 border-primary/10 bg-background p-8 px-6 sm:px-10">

                {/* Avatar Area */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                        <div className="relative">
                            {seller.avatar_url ? (
                                <Image
                                    src={seller.avatar_url}
                                    alt={seller.display_name ?? seller.username ?? ''}
                                    width={128}
                                    height={128}
                                    unoptimized
                                    className="h-32 w-32 border-4 border-primary/30 object-cover shadow-2xl relative z-10"
                                />
                            ) : (
                                <div className="flex h-32 w-32 items-center justify-center border-4 border-primary/10 bg-zinc-950 relative z-10">
                                    <User className="h-12 w-12 text-zinc-800" />
                                </div>
                            )}
                            {seller.verified && (
                                <div className="absolute -bottom-2 -right-2 z-20 border-2 border-primary bg-zinc-950 p-2 shadow-xl">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name & Badge */}
                    <div className="space-y-2 mb-8">
                        <h1 className="font-heading text-4xl font-bold italic tracking-tight text-white">
                            {seller.display_name ?? seller.username}
                        </h1>
                        {seller.verified && (
                            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                    {t.trust.verified}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Bio */}
                    {seller.bio && (
                        <p className="mb-10 font-sans text-sm font-medium leading-relaxed tracking-wide text-zinc-500 max-w-xs mx-auto">
                            {seller.bio}
                        </p>
                    )}

                    {/* Stats */}
                    <SellerStats listingCount={listingCount} />

                    {/* Meta Info - Clustered */}
                    <div className="w-full space-y-4 mt-8">
                        {seller.location && (
                            <div className="flex items-center justify-center gap-3 border-2 border-primary/10 bg-zinc-950/50 p-4">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="font-sans text-xs font-bold uppercase tracking-widest text-white">{seller.location}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-center gap-2 text-zinc-600">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="font-sans text-[10px] font-bold uppercase tracking-widest opacity-70" suppressHydrationWarning>
                                Joined {memberSince}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
