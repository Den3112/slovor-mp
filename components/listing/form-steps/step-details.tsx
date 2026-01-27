'use client'

import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type {
  ListingFormData,
  ListingFormErrors,
} from '@/lib/utils/listing-form-schema'
import { LocationCombobox } from '@/components/ui/location-combobox'

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
  const { t } = useTranslation()

  return (
    <div className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-500">
      <div className="space-y-2">
        <label className="text-muted-foreground/80 ml-1 text-xs font-black tracking-widest uppercase">
          {t('createListing.itemTitle')}
        </label>
        <div className="group relative">
          <input
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className={cn(
              'placeholder:text-muted-foreground/30 h-16 w-full rounded-2xl border bg-white/5 px-6 text-xl font-bold transition-all outline-none',
              'focus:border-primary focus:ring-primary/10 focus:bg-white/10 focus:ring-4',
              fieldErrors.title
                ? 'border-destructive/50 bg-destructive/5'
                : 'border-white/10 hover:border-white/20'
            )}
            placeholder="e.g. iPhone 13 Pro Max - 256GB"
          />
        </div>
        {fieldErrors.title && (
          <p className="text-destructive ml-1 text-sm font-medium">
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div className="flex gap-4 md:gap-6">
        <div className="flex-1 space-y-2">
          <label className="text-muted-foreground/80 ml-1 text-xs font-black tracking-widest uppercase">
            {t('createListing.price')}
          </label>
          <div className="group relative">
            <span className="text-muted-foreground absolute top-1/2 left-6 -translate-y-1/2 text-xl font-black">
              €
            </span>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
              className={cn(
                'placeholder:text-muted-foreground/30 h-16 w-full rounded-2xl border bg-white/5 pr-6 pl-12 text-2xl font-black tracking-tight transition-all outline-none',
                'focus:border-primary focus:ring-primary/10 focus:bg-white/10 focus:ring-4',
                fieldErrors.price
                  ? 'border-destructive/50 bg-destructive/5'
                  : 'border-white/10 hover:border-white/20'
              )}
              placeholder="0.00"
            />
          </div>
          {fieldErrors.price && (
            <p className="text-destructive ml-1 text-sm font-medium">
              {fieldErrors.price}
            </p>
          )}
        </div>
        {/* Visual Currency Badge (Static for now as mostly EUR) */}
        <div className="pointer-events-none w-24 space-y-2 opacity-50 grayscale md:w-32">
          <label className="text-muted-foreground/80 ml-1 text-xs font-black tracking-widest uppercase">
            {t('createListing.currency')}
          </label>
          <div className="text-muted-foreground flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 font-black">
            EUR
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-muted-foreground/80 ml-1 text-xs font-black tracking-widest uppercase">
          {t('createListing.description')}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="placeholder:text-muted-foreground/30 focus:border-primary focus:ring-primary/10 h-48 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-6 text-lg leading-relaxed transition-all outline-none hover:border-white/20 focus:bg-white/10 focus:ring-4"
          placeholder="Describe your item in detail..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-muted-foreground/80 ml-1 text-xs font-black tracking-widest uppercase">
          {t('createListing.location')}
        </label>
        <LocationCombobox
          value={formData.location}
          onChange={(value) => updateField('location', value)}
          error={fieldErrors.location}
          placeholder="Search for a city in Slovakia..."
        />
        {fieldErrors.location && (
          <p className="text-destructive ml-1 text-sm font-medium">
            {fieldErrors.location}
          </p>
        )}
      </div>
    </div>
  )
}
