'use client'

import type { Category } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type {
  ListingFormData,
  ListingFormErrors,
} from '@/lib/utils/listing-form-schema'

import { CategoryIcon } from '@/components/category/category-icon'
import { FormField } from '@/components/ui/form-field'

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
    <div className="animate-in fade-in slide-in-from-right-8 space-y-10 duration-500">
      <FormField label={t('createListing.category')} error={fieldErrors.category_id}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateField('category_id', cat.id)}
              className={cn(
                'group relative flex flex-col items-center justify-center gap-4 rounded-4xl border p-6 text-center transition-all duration-300',
                formData.category_id === cat.id
                  ? 'bg-primary border-primary text-primary-foreground shadow-primary/30 ring-primary/20 scale-105 shadow-xl ring-4'
                  : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg'
              )}
            >
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300',
                  formData.category_id === cat.id
                    ? 'bg-white/20 scale-110'
                    : 'bg-primary/10 group-hover:bg-primary group-hover:text-white'
                )}
              >
                <CategoryIcon slug={cat.slug} className="h-7 w-7" />
              </div>
              <span className="text-sm font-black tracking-tight uppercase">
                {cat.name}
              </span>

              {/* Checkmark indicator for active state */}
              {formData.category_id === cat.id && (
                <div className="animate-in zoom-in absolute top-5 right-5 h-2.5 w-2.5 rounded-full bg-white shadow-sm ring-4 ring-white/20" />
              )}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label={t('createListing.condition')} error={fieldErrors.condition}>
        <div className="bg-white/5 flex gap-4 rounded-3xl border border-white/5 p-1.5 active:scale-[0.99] transition-transform">
          {(['new', 'used'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateField('condition', c)}
              className={cn(
                'flex-1 rounded-2xl py-4 text-sm font-black tracking-widest uppercase transition-all duration-500',
                formData.condition === c
                  ? 'bg-primary text-primary-foreground shadow-primary/20 scale-[1.02] shadow-xl'
                  : 'text-muted-foreground/60 hover:text-foreground hover:bg-white/5'
              )}
            >
              {c === 'new' ? t('filters.new') : t('filters.used')}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  )
}

