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
        <div className="space-y-8 duration-500 animate-in fade-in slide-in-from-right-8">
            <div className="space-y-4">
                <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground/80 md:text-xs">
                    {t.createListing.category}
                </label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateField('category_id', cat.id)}
                            className={cn(
                                'group relative flex flex-col items-center justify-center gap-3 rounded-[2rem] border p-6 text-center transition-all duration-300',
                                formData.category_id === cat.id
                                    ? 'bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/30 scale-105 ring-4 ring-primary/20'
                                    : 'border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/50 hover:shadow-lg'
                            )}
                        >
                            <span className={cn(
                                "text-4xl transition-transform duration-300 group-hover:scale-110",
                                formData.category_id === cat.id ? "scale-110" : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
                            )}>
                                {cat.icon}
                            </span>
                            <span className="text-sm font-bold tracking-tight">{cat.name}</span>

                            {/* Checkmark indicator for active state */}
                            {formData.category_id === cat.id && (
                                <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-white shadow-sm animate-in zoom-in" />
                            )}
                        </button>
                    ))}
                </div>
                {fieldErrors.category_id && (
                    <p className="mt-2 text-sm font-medium text-destructive flex items-center gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive" />
                        {fieldErrors.category_id}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-black uppercase tracking-widest text-muted-foreground/80 md:text-xs">
                    {t.createListing.condition}
                </label>
                <div className="flex gap-4 p-1 rounded-[2rem] bg-muted/30 border border-white/5">
                    {(['new', 'used'] as const).map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => updateField('condition', c)}
                            className={cn(
                                'flex-1 rounded-[1.8rem] py-4 text-sm font-black uppercase tracking-wider transition-all duration-300',
                                formData.condition === c
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
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
