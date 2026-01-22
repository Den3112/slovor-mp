import { ImageGallery } from '@/components/listing/image-gallery'
import { ListingDetailsGrid } from './listing-attributes'
import type { Listing } from '@/lib/types/database'

import type { TranslationKeys } from '@/lib/i18n/translations'

interface DetailMainContentProps {
    listing: Listing
    displayTitle: string
    displayDescription: string
    t: TranslationKeys
}

export function DetailMainContent({ listing, displayTitle, displayDescription, t }: DetailMainContentProps) {
    return (
        <div className="space-y-8 md:space-y-12 lg:col-span-8">
            <div className="relative group border-2 border-primary/10 bg-zinc-950 shadow-xl overflow-hidden">
                <ImageGallery
                    images={listing.images || []}
                    title={displayTitle}
                />
            </div>

            <div className="space-y-10">
                <div className="space-y-6">
                    <h2 className="font-heading text-3xl font-bold italic tracking-tight text-white">
                        {t.listing.itemDescription}
                    </h2>
                    <div className="h-1.5 w-20 bg-primary" />
                    <p className="whitespace-pre-wrap font-sans text-xl font-medium leading-relaxed text-zinc-400">
                        {displayDescription}
                    </p>
                </div>

                <ListingDetailsGrid listing={listing} />
            </div>
        </div>
    )
}
