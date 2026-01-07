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
        <div className="space-y-8 duration-500 animate-in fade-in slide-in-from-right-8">
            <div className="space-y-2">
                <label className="ml-1 text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                    {t.createListing.itemTitle}
                </label>
                <div className="relative group">
                    <input
                        value={formData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        className={cn(
                            'h-16 w-full rounded-2xl border bg-white/5 px-6 text-xl font-bold outline-none transition-all placeholder:text-muted-foreground/30',
                            'focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10',
                            fieldErrors.title ? 'border-destructive/50 bg-destructive/5' : 'border-white/10 hover:border-white/20'
                        )}
                        placeholder="e.g. iPhone 13 Pro Max - 256GB"
                    />
                </div>
                {fieldErrors.title && (
                    <p className="ml-1 text-sm font-medium text-destructive">{fieldErrors.title}</p>
                )}
            </div>

            <div className="flex gap-4 md:gap-6">
                <div className="flex-1 space-y-2">
                    <label className="ml-1 text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                        {t.createListing.price}
                    </label>
                    <div className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground">€</span>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => updateField('price', e.target.value)}
                            className={cn(
                                'h-16 w-full rounded-2xl border bg-white/5 pl-12 pr-6 text-2xl font-black tracking-tight outline-none transition-all placeholder:text-muted-foreground/30',
                                'focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10',
                                fieldErrors.price ? 'border-destructive/50 bg-destructive/5' : 'border-white/10 hover:border-white/20'
                            )}
                            placeholder="0.00"
                        />
                    </div>
                    {fieldErrors.price && (
                        <p className="ml-1 text-sm font-medium text-destructive">{fieldErrors.price}</p>
                    )}
                </div>
                {/* Visual Currency Badge (Static for now as mostly EUR) */}
                <div className="w-24 md:w-32 space-y-2 opacity-50 pointer-events-none grayscale">
                    <label className="ml-1 text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                        {t.createListing.currency}
                    </label>
                    <div className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 font-black text-muted-foreground">
                        EUR
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="ml-1 text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                    {t.createListing.description}
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="h-48 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-6 text-lg leading-relaxed outline-none transition-all placeholder:text-muted-foreground/30 focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10 hover:border-white/20"
                    placeholder="Describe your item in detail..."
                />
            </div>

            <div className="space-y-2">
                <label className="ml-1 text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                    {t.createListing.location}
                </label>
                <input
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className={cn(
                        'h-14 w-full rounded-2xl border bg-white/5 px-6 font-medium outline-none transition-all placeholder:text-muted-foreground/30',
                        'focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10',
                        fieldErrors.location ? 'border-destructive/50 bg-destructive/5' : 'border-white/10 hover:border-white/20'
                    )}
                    placeholder="City, District"
                />
                {fieldErrors.location && (
                    <p className="ml-1 text-sm font-medium text-destructive">{fieldErrors.location}</p>
                )}
            </div>
        </div>
    )
}
