'use client'

import { useTranslation } from 'react-i18next'

interface ListingDescriptionProps {
  description: string
}

export function ListingDescription({ description }: ListingDescriptionProps) {
  const { t } = useTranslation(['listing', 'common'])

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="font-heading text-3xl font-black tracking-tight">
          {t('listing:itemDescription')}
        </h2>
        <div className="bg-linear-to-r from-primary to-primary/20 h-1.5 w-24 rounded-full" />
      </div>
      <p className="text-foreground/90 text-lg leading-relaxed font-bold whitespace-pre-wrap">
        {description}
      </p>
    </div>
  )
}
