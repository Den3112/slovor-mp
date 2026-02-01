'use client'

import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type {
  ListingFormData,
  ListingFormErrors,
} from '@/lib/utils/listing-form-schema'
import { LocationCombobox } from '@/components/ui/location-combobox'
import { FormField } from '@/components/ui/form-field'

interface StepDetailsProps {
  formData: ListingFormData
  fieldErrors: ListingFormErrors
  updateField: <K extends keyof ListingFormData>(
    field: K,
    value: ListingFormData[K]
  ) => void
}

export function StepDetails({
  formData,
  fieldErrors,
  updateField,
}: StepDetailsProps) {
  const { t } = useTranslation(['createListing', 'common', 'filters'])

  const inputClasses = (hasError: boolean) =>
    cn(
      'placeholder:text-muted-foreground/30 w-full rounded-xl border bg-card transition-all outline-none',
      'focus:border-primary focus:ring-primary/10 focus:bg-accent/5 focus:ring-4',
      hasError
        ? 'border-destructive/50 bg-destructive/5'
        : 'border-border hover:border-primary/50'
    )

  return (
    <div className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-500">
      <FormField
        label={t('itemTitle')}
        error={fieldErrors.title}
        description="Write a clear, descriptive title for your item"
      >
        <input
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className={cn(inputClasses(!!fieldErrors.title), 'h-16 px-6 text-xl font-bold')}
          placeholder={t('titlePlaceholder')}
        />
      </FormField>

      <div className="flex flex-col gap-6 md:flex-row">
        <FormField
          label={t('price')}
          error={fieldErrors.price}
          className="flex-1"
        >
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-6 -translate-y-1/2 text-xl font-black">
              €
            </span>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
              className={cn(
                inputClasses(!!fieldErrors.price),
                'h-16 pr-6 pl-12 text-2xl font-black tracking-tight'
              )}
              placeholder="0"
            />
          </div>
        </FormField>

        <div className="pointer-events-none w-full space-y-2.5 opacity-50 grayscale md:w-32">
          <label className="text-muted-foreground/80 ml-1 text-[10px] font-black tracking-[0.2em] uppercase">
            {t('currency')}
          </label>
          <div className="text-muted-foreground flex h-16 items-center justify-center rounded-xl border border-border bg-muted/50 font-black">
            EUR
          </div>
        </div>
      </div>

      <FormField
        label={t('description')}
        error={fieldErrors.description}
      >
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          className={cn(
            inputClasses(!!fieldErrors.description),
            'h-48 resize-none p-6 text-lg leading-relaxed'
          )}
          placeholder={t('descPlaceholder')}
        />
      </FormField>

      <FormField label={t('location')} error={fieldErrors.location}>
        <LocationCombobox
          value={formData.location}
          onChange={(value) => updateField('location', value)}
          error={fieldErrors.location}
          placeholder={t('locationPlaceholder')}
        />
      </FormField>
    </div>
  )
}
