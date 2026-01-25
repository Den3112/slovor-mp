'use client'

import type { Category } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type {
  ListingFormData,
  ListingFormErrors,
} from '@/lib/utils/listing-form-schema'

import { CategoryIcon } from '@/components/category/CategoryIcon'

interface StepCategoryProps {
  categories: Category[]
  formData: ListingFormData
  fieldErrors: ListingFormErrors
  updateField: <K extends keyof ListingFormData>(
    field: K,
    value: ListingFormData[K]
  ) => void
}

export function StepCategory({
  categories,
  formData,
  fieldErrors,
  updateField,
}: StepCategoryProps) {
  const { t } = useTranslation()

  return (
    <div className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-500">
      <div className="space-y-4">
        <label className="text-muted-foreground/80 block text-sm font-black tracking-widest uppercase md:text-xs">
          {t.createListing.category}
        </label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateField('category_id', cat.id)}
              className={cn(
                'group relative flex flex-col items-center justify-center gap-4 rounded-5xl border p-6 text-center transition-all duration-300',
                formData.category_id === cat.id
                  ? 'bg-primary border-primary text-primary-foreground shadow-primary/30 ring-primary/20 scale-105 shadow-xl ring-4'
                  : 'border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/50 hover:shadow-lg'
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300',
                  formData.category_id === cat.id
                    ? 'bg-white/20'
                    : 'bg-primary/10 group-hover:bg-primary group-hover:text-white'
                )}
              >
                <CategoryIcon slug={cat.slug} className="h-6 w-6" />
              </div>
              <span className="text-sm font-black tracking-tight">
                {cat.name}
              </span>

              {/* Checkmark indicator for active state */}
              {formData.category_id === cat.id && (
                <div className="animate-in zoom-in absolute top-4 right-4 h-3 w-3 rounded-full bg-white shadow-sm" />
              )}
            </button>
          ))}
        </div>
        {fieldErrors.category_id && (
          <p className="text-destructive mt-2 flex items-center gap-2 text-sm font-medium">
            <span className="bg-destructive inline-block h-1.5 w-1.5 rounded-full" />
            {fieldErrors.category_id}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <label className="text-muted-foreground/80 block text-sm font-black tracking-widest uppercase md:text-xs">
          {t.createListing.condition}
        </label>
        <div className="bg-muted/30 flex gap-4 rounded-4xl border border-white/5 p-1">
          {(['new', 'used'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateField('condition', c)}
              className={cn(
                'flex-1 rounded-3xl py-4 text-sm font-black tracking-wider uppercase transition-all duration-300',
                formData.condition === c
                  ? 'bg-primary text-primary-foreground shadow-primary/20 scale-[1.02] shadow-lg'
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
