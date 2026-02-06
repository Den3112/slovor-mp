'use client'

import { useTranslation } from 'react-i18next'

interface ListingDescriptionProps {
    description: string
}

export function ListingDescription({ description }: ListingDescriptionProps) {
    const { t } = useTranslation(['listing', 'common'])

    return (
        <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight">
                {t('listing:itemDescription')}
            </h2>
            <div className="bg-primary h-1.5 w-20 rounded-xl" />
            <p className="text-foreground/80 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                {description}
            </p>
        </div>
    )
}
