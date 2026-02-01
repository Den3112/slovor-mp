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
  const { t } = useTranslation(['createListing', 'common', 'filters'])

  return (
    <div className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-500">
      <FormField label={t('category')} error={fieldErrors.category_id}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateField('category_id', cat.id)}
              className={cn(
                'group relative flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all active:scale-95 md:p-6',
                formData.category_id === cat.id
                  ? 'border-primary bg-primary/10 ring-primary/20 ring-4'
                  : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 md:h-16 md:w-16',
                  formData.category_id === cat.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white/5 text-white/70'
                )}
              >
                <CategoryIcon slug={cat.slug} className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <span
                className={cn(
                  'text-center text-xs font-bold transition-colors md:text-sm',
                  formData.category_id === cat.id
                    ? 'text-white'
                    : 'text-muted-foreground group-hover:text-white'
                )}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </FormField>

      <FormField label={t('condition')} error={fieldErrors.condition}>
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

