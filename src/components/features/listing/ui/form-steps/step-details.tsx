'use client'

import { useId } from 'react'

import { useTranslation } from '@/lib/i18n'
import type {
  ListingFormData,
  ListingFormErrors,
} from '@/lib/utils/listing-form-schema'
import { LocationCombobox } from '@/components/ui/location-combobox'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Category } from '@/lib/types/database'
import {
  CATEGORY_ATTRIBUTES,
  getAttributeLabel,
} from '@/lib/constants/category-attributes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface StepDetailsProps {
  formData: ListingFormData
  fieldErrors: ListingFormErrors
  updateField: <K extends keyof ListingFormData>(
    field: K,
    value: ListingFormData[K]
  ) => void
  categories: Category[]
}

export function StepDetails({
  formData,
  fieldErrors,
  updateField,
  categories,
}: StepDetailsProps) {
  const { t, i18n } = useTranslation(['createListing', 'common', 'filters'])
  const locale = i18n.language

  const titleId = useId()
  const priceId = useId()
  const descriptionId = useId()
  const locationId = useId()

  const currentCategory = categories.find((c) => c.id === formData.category_id)
  const categoryAttributes = currentCategory
    ? CATEGORY_ATTRIBUTES[currentCategory.slug]
    : []

  return (
    <div className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-500">
      <FormField
        label={t('itemTitle')}
        error={fieldErrors.title}
        description="Write a clear, descriptive title for your item"
        inputId={titleId}
      >
        <Input
          id={titleId}
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="border-primary/10 focus:ring-primary/20 h-16 rounded-2xl px-6 text-xl font-black tracking-tight shadow-sm transition-all focus:ring-4"
          placeholder={t('titlePlaceholder')}
          aria-invalid={!!fieldErrors.title}
        />
      </FormField>

      <div className="flex flex-col gap-8 md:flex-row">
        <FormField
          label={t('price')}
          error={fieldErrors.price}
          className="flex-1"
          inputId={priceId}
        >
          <div className="relative">
            <span className="text-primary/40 absolute top-1/2 left-6 -translate-y-1/2 text-2xl font-black">
              €
            </span>
            <Input
              id={priceId}
              type="number"
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
              className="border-primary/10 focus:ring-primary/20 h-16 rounded-2xl pr-6 pl-12 text-2xl font-black tracking-tight shadow-sm transition-all focus:ring-4"
              placeholder="0"
              aria-invalid={!!fieldErrors.price}
            />
          </div>
        </FormField>

        <div className="w-full space-y-2.5 opacity-50 md:w-32">
          <label className="text-primary/60 ml-1 text-[10px] font-black tracking-[0.3em] uppercase">
            {t('currency')}
          </label>
          <div className="glass-panel border-primary/5 bg-primary/2 flex h-16 items-center justify-center rounded-2xl border font-black tracking-widest uppercase">
            EUR
          </div>
        </div>
      </div>

      <FormField
        label={t('description')}
        error={fieldErrors.description}
        inputId={descriptionId}
      >
        <Textarea
          id={descriptionId}
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="border-primary/10 focus:ring-primary/20 min-h-48 resize-none rounded-2xl p-6 text-lg leading-relaxed font-bold shadow-sm transition-all focus:ring-4"
          placeholder={t('descPlaceholder')}
          aria-invalid={!!fieldErrors.description}
        />
      </FormField>

      <FormField
        label={t('location')}
        error={fieldErrors.location}
        inputId={locationId}
      >
        <LocationCombobox
          id={locationId}
          value={formData.location}
          onChange={(value) => updateField('location', value)}
          error={fieldErrors.location}
          placeholder={t('locationPlaceholder')}
          className="h-16 rounded-2xl font-black tracking-tight"
        />
      </FormField>

      {/* Dynamic Category Attributes */}
      {categoryAttributes && categoryAttributes.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 glass-panel border-primary/10 bg-primary/2 shadow-primary/5 space-y-8 rounded-[2.5rem] p-8 shadow-2xl duration-700">
          <div className="space-y-1">
            <h3 className="text-primary text-[10px] font-black tracking-[0.3em] uppercase">
              {t('additionalDetails') || 'Additional Details'}
            </h3>
            <div className="from-primary to-primary/0 h-1 w-12 rounded-full bg-linear-to-r" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {categoryAttributes.map((attr) => (
              <FormField
                key={attr.id}
                label={getAttributeLabel(attr, locale)}
                inputId={`attr-${attr.id}`}
              >
                {attr.type === 'select' ? (
                  <Select
                    value={
                      (formData.attributes && formData.attributes[attr.id]) ||
                      ''
                    }
                    onValueChange={(value) =>
                      updateField('attributes', {
                        ...(formData.attributes || {}),
                        [attr.id]: value,
                      })
                    }
                  >
                    <SelectTrigger
                      id={`attr-${attr.id}`}
                      className="border-primary/10 bg-background focus:ring-primary/20 h-14 rounded-2xl px-6 font-black tracking-tight shadow-sm transition-all focus:ring-4"
                    >
                      <SelectValue placeholder={t('common:select')} />
                    </SelectTrigger>

                    <SelectContent className="rounded-2xl">
                      {attr.options?.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="rounded-xl font-bold"
                        >
                          {opt.label[locale] || opt.label['en']}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="relative">
                    <Input
                      id={`attr-${attr.id}`}
                      type={
                        attr.type === 'range' || attr.type === 'number'
                          ? 'number'
                          : 'text'
                      }
                      value={
                        (formData.attributes && formData.attributes[attr.id]) ||
                        ''
                      }
                      onChange={(e) =>
                        updateField('attributes', {
                          ...(formData.attributes || {}),
                          [attr.id]: e.target.value,
                        })
                      }
                      className="border-primary/10 focus:ring-primary/20 h-14 rounded-2xl px-6 font-black tracking-tight shadow-sm transition-all focus:ring-4"
                      placeholder={attr.unit ? `0 ${attr.unit}` : ''}
                    />
                    {attr.unit && (
                      <span className="text-primary/40 absolute top-1/2 right-6 -translate-y-1/2 text-[10px] font-black tracking-widest uppercase">
                        {attr.unit}
                      </span>
                    )}
                  </div>
                )}
              </FormField>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
