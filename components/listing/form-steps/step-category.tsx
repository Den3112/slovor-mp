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
                'group relative flex flex-col items-center gap-3 rounded-xl border p-4 transition-all active:scale-95 md:p-6',
                formData.category_id === cat.id
                  ? 'border-primary bg-primary/10 ring-primary/10 ring-2'

                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110 md:h-16 md:w-16',
                  formData.category_id === cat.id
                    ? 'bg-primary text-primary-foreground shadow-sm'

                    : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                )}
              >
                <CategoryIcon slug={cat.slug} className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <span
                className={cn(
                  'text-center text-xs font-bold transition-colors md:text-sm',
                  formData.category_id === cat.id
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </FormField>

      <FormField label={t('condition')} error={fieldErrors.condition}>
        <div className="bg-muted/50 flex gap-2 rounded-xl border border-border p-1">
          {(['new', 'used'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateField('condition', c)}
              className={cn(
                'flex-1 rounded-xl py-3 text-sm font-bold tracking-wide uppercase transition-all duration-300',

                formData.condition === c
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
              )}
            >
              {c === 'new' ? t('filters:new') : t('filters:used')}
            </button>
          ))}
        </div>
      </FormField>
    </div>
  )
}

