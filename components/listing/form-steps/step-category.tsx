'use client'

import type { Category } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type { ListingFormData, ListingFormErrors } from '@/lib/utils/listing-form-schema'

interface StepCategoryProps {
    categories: Category[]
    formData: ListingFormData
    fieldErrors: ListingFormErrors
    updateField: <K extends keyof ListingFormData>(field: K, value: ListingFormData[K]) => void
}

export function StepCategory({ categories, formData, fieldErrors, updateField }: StepCategoryProps) {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-right-8">
            <div>
                <label className="mb-2 block text-sm font-bold">{t.createListing.category}</label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateField('category_id', cat.id)}
                            className={cn(
                                'flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-6 text-center transition-all hover:scale-[1.02]',
                                formData.category_id === cat.id
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border/50 bg-muted/20 hover:border-primary/50'
                            )}
                        >
                            <span className="text-3xl">{cat.icon}</span>
                            <span className="text-sm font-bold">{cat.name}</span>
                        </button>
                    ))}
                </div>
                {fieldErrors.category_id && (
                    <p className="mt-2 text-sm text-destructive">
                        {fieldErrors.category_id}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-2 block text-sm font-bold">{t.createListing.condition}</label>
                <div className="flex gap-4">
                    {(['new', 'used'] as const).map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => updateField('condition', c)}
                            className={cn(
                                'flex-1 rounded-xl border-2 px-6 py-3 font-bold capitalize transition-all',
                                formData.condition === c
                                    ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'border-border/50 bg-transparent text-muted-foreground hover:bg-muted'
                            )}
                        >
                            {c === 'new' ? t.filters.new : t.filters.used}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
