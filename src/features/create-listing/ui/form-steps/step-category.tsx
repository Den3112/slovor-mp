'use client'

import type { Category } from '@/shared/lib/types/database'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'
import type {
  ListingFormData,
  ListingFormErrors,
} from '@/shared/lib/utils/listing-form-schema'

import { CategoryIcon } from '@/entities/category/ui/category-icon'
import { FormField } from '@/shared/ui/form-field'
import { Button } from '@/shared/ui/button'

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
            <Button
              key={cat.id}
              type="button"
              variant="outline"
              onClick={() => updateField('category_id', cat.id)}
              className={cn(
                'group relative flex h-auto flex-col items-center gap-4 rounded-[2rem] border-2 p-5 transition-all active:scale-95 md:p-8',
                formData.category_id === cat.id
                  ? 'border-primary bg-primary/5 ring-primary/20 shadow-primary/10 shadow-xl ring-4'
                  : 'glass-panel border-primary/5 hover:border-primary/30 hover:bg-primary/5'
              )}
            >
              <div
                className={cn(
                  'rounded-2xl p-4 transition-all duration-500',
                  formData.category_id === cat.id
                    ? 'bg-primary shadow-primary/20 scale-110 text-white shadow-lg'
                    : 'bg-primary/10 text-primary group-hover:scale-110'
                )}
              >
                <CategoryIcon
                  slug={cat.slug}
                  className="h-6 w-6 md:h-8 md:w-8"
                />
              </div>
              <span
                className={cn(
                  'text-center text-xs font-black tracking-tight transition-colors md:text-sm',
                  formData.category_id === cat.id
                    ? 'text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {cat.name}
              </span>
            </Button>
          ))}
        </div>
      </FormField>

      <FormField label={t('condition')} error={fieldErrors.condition}>
        <div className="glass-panel border-primary/5 bg-primary/2 flex gap-2 rounded-2xl border p-2">
          {(['new', 'used'] as const).map((c) => (
            <Button
              key={c}
              type="button"
              variant="ghost"
              onClick={() => updateField('condition', c)}
              className={cn(
                'h-12 flex-1 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all duration-500',

                formData.condition === c
                  ? 'bg-primary hover:bg-primary shadow-primary/20 scale-[1.02] text-white shadow-xl'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
              )}
            >
              {c === 'new' ? t('filters:new') : t('filters:used')}
            </Button>
          ))}
        </div>
      </FormField>
    </div>
  )
}
