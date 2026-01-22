import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import type { Listing } from '@/lib/types/database'

import type { Locale, TranslationKeys } from '@/lib/i18n/translations'

interface DetailHeaderProps {
    listing: Listing
    t: TranslationKeys
    locale: Locale
    displayTitle: string
}

export function DetailHeader({ listing, t, locale, displayTitle }: DetailHeaderProps) {
    return (
        <Container className="py-6 pt-24 md:pt-32 relative z-10">
            <Link
                href="/listings"
                className="group hidden md:inline-flex items-center gap-3 border-2 border-primary/20 bg-background/50 px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest text-zinc-500 backdrop-blur-md transition-all hover:border-primary hover:text-primary hover:shadow-xl shadow-primary/5"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {t.common.backToSearch}
            </Link>

            <div className="mt-0 md:mt-8">
                <Breadcrumbs
                    items={[
                        { label: t.common.allListings, href: '/listings' },
                        ...(listing.category
                            ? [
                                {
                                    label: getLocalizedCategoryName(listing.category, locale, t),
                                    href: `/categories/${listing.category.slug}`,
                                },
                            ]
                            : []),
                        { label: displayTitle },
                    ]}
                />
            </div>
        </Container>
    )
}
