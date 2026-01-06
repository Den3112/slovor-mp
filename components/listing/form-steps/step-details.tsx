'use client'

import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type { ListingFormData, ListingFormErrors } from '@/lib/utils/listing-form-schema'

interface StepDetailsProps {
    formData: ListingFormData
    fieldErrors: ListingFormErrors
    updateField: <K extends keyof ListingFormData>(field: K, value: ListingFormData[K]) => void
}

export function StepDetails({ formData, fieldErrors, updateField }: StepDetailsProps) {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-right-8">
            <div className="space-y-1">
                <label className="text-sm font-bold">{t.createListing.itemTitle}</label>
                <input
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className={cn(
                        'h-14 w-full rounded-xl border bg-muted/30 px-4 text-lg font-medium outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
                        fieldErrors.title ? 'border-destructive' : 'border-border'
                    )}
                    placeholder={t.createListing.titlePlaceholder}
                />
                {fieldErrors.title && (
                    <p className="text-sm text-destructive">{fieldErrors.title}</p>
                )}
            </div>

            <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                    <label className="text-sm font-bold">{t.createListing.price}</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => updateField('price', e.target.value)}
                        className={cn(
                            'h-14 w-full rounded-xl border bg-muted/30 px-4 text-lg font-medium outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
                            fieldErrors.price ? 'border-destructive' : 'border-border'
                        )}
                        placeholder="0.00"
                    />
                    {fieldErrors.price && (
                        <p className="text-sm text-destructive">{fieldErrors.price}</p>
                    )}
                </div>
                <div className="w-1/3 space-y-1">
                    <label className="text-sm font-bold">{t.createListing.currency}</label>
                    <div className="flex h-14 items-center rounded-xl border border-border bg-muted/30 px-4 font-bold text-muted-foreground">
                        EUR (€)
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-bold">{t.createListing.description}</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="h-32 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                    placeholder={t.createListing.descPlaceholder}
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-bold">{t.createListing.location}</label>
                <input
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className={cn(
                        'h-12 w-full rounded-xl border bg-muted/30 px-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
                        fieldErrors.location ? 'border-destructive' : 'border-border'
                    )}
                    placeholder={t.createListing.locationPlaceholder}
                />
                {fieldErrors.location && (
                    <p className="text-sm text-destructive">{fieldErrors.location}</p>
                )}
            </div>
        </div>
    )
}
