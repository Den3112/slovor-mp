import Link from 'next/link'
import { CURRENCIES } from '@/lib/types/currency'

import type { TranslationKeys } from '@/lib/i18n/translations'

interface FooterBottomProps {
    t: TranslationKeys
    mounted: boolean
    isLoading: boolean
    currency: string
    geoLocation: { country?: string } | null
}

export function FooterBottom({ t, mounted, isLoading, currency, geoLocation }: FooterBottomProps) {
    const currentYear = new Date().getFullYear()

    return (
        <div className="border-t border-white/[0.03] pt-6 md:pt-10">
            {/* Mobile: Vertical stack */}
            <div className="flex flex-col items-center gap-4 text-center md:hidden">
                <span className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider" suppressHydrationWarning>
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    {mounted && !isLoading ? `${geoLocation?.country || 'Slovakia'} / ${CURRENCIES[currency as keyof typeof CURRENCIES]?.code || 'EUR'}` : '...'}
                </span>
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-600" suppressHydrationWarning>
                    © {currentYear} Slovor Marketplace. {t.footer.rights}.
                </p>
                <div className="flex items-center gap-6">
                    <Link
                        href="/terms"
                        className="font-sans text-[11px] font-bold uppercase tracking-widest text-zinc-600 transition-colors hover:text-white"
                    >
                        {t.footer.transparency || 'Transparency'}
                    </Link>
                    <Link
                        href="/privacy"
                        className="font-sans text-[11px] font-bold uppercase tracking-widest text-zinc-600 transition-colors hover:text-white"
                    >
                        {t.footer.privacyPolicy || 'Privacy Policy'}
                    </Link>
                </div>
            </div>

            {/* Desktop: Horizontal layout */}
            <div className="hidden items-center justify-between md:flex">
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600" suppressHydrationWarning>
                    © {currentYear} Slovor Marketplace. {t.footer.rights}.
                </p>
                <div className="flex items-center gap-8">
                    <span className="flex h-7 items-center gap-2 border border-primary/20 bg-primary/5 px-4 font-sans text-[11px] font-bold uppercase tracking-wider" suppressHydrationWarning>
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        {mounted && !isLoading ? `${geoLocation?.country || 'Slovakia'} / ${CURRENCIES[currency as keyof typeof CURRENCIES]?.code || 'EUR'}` : '...'}
                    </span>
                    <Link
                        href="/terms"
                        className="flex h-7 items-center font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 transition-colors hover:text-white"
                    >
                        {t.footer.transparency || 'Transparency'}
                    </Link>
                    <Link
                        href="/privacy"
                        className="flex h-7 items-center font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 transition-colors hover:text-white"
                    >
                        {t.footer.privacyPolicy || 'Privacy Policy'}
                    </Link>
                </div>
            </div>
        </div>
    )
}
