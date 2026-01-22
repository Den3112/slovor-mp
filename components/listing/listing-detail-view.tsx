'use client'

import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import type { Listing } from '@/lib/types/database'
import { getLocalizedTitle, getLocalizedDescription } from '@/lib/utils/listing-utils'
import { useRecentlyViewed } from '@/lib/hooks/use-recently-viewed'
import { RecentlyViewed } from '@/components/listing/view'
import { useEffect } from 'react'
import { ListingSidebar } from './details/listing-sidebar'
import { DetailHeader } from './details/detail-header'
import { DetailMainContent } from './details/detail-main-content'

interface ListingDetailViewProps {
    listing: Listing
}

export function ListingDetailView({ listing }: ListingDetailViewProps) {
    const { t, locale } = useTranslation()

    const displayTitle = getLocalizedTitle(listing, locale)
    const displayDescription = getLocalizedDescription(listing, locale)

    const { addItem } = useRecentlyViewed()

    useEffect(() => {
        addItem(listing)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listing.id])

    return (
        <div className="min-h-screen pb-10 bg-gradient-to-b from-background via-background/95 to-background">
            <DetailHeader
                listing={listing}
                t={t}
                locale={locale}
                displayTitle={displayTitle}
            />

            <Container>
                <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-12">
                    <DetailMainContent
                        listing={listing}
                        displayTitle={displayTitle}
                        displayDescription={displayDescription}
                        t={t}
                    />

                    <div className="space-y-8 lg:col-span-4">
                        <ListingSidebar listing={listing} />
                    </div>
                </div>

                <div className="mt-8">
                    <RecentlyViewed />
                </div>
            </Container>
        </div>
    )
}
