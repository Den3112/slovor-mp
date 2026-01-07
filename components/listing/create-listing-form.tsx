'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { categoriesApi, listingsApi, storageApi } from '@/lib/api'
import { updateListingAction } from '@/lib/actions/listings'
import { generateListingTranslations } from '@/lib/services/translation'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DEFAULT_LISTING_FORM,
  type ListingFormData,
  type ListingFormErrors,
  validateListingForm,
  hasListingFormErrors,
} from '@/lib/utils/listing-form-schema'
import {
  saveListingDraft,
  loadListingDraft,
  clearListingDraft,
} from '@/lib/utils/draft-storage'

// Extracted step components (Rule #1: Minimize code)
import { StepCategory, StepDetails, StepImages } from './form-steps'

function CreateListingFormContent() {
  const { user, session, isLoading: authLoading } = useAuth()
  const { t, locale } = useTranslation()
  const router = useRouter()

  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const [isEditing, setIsEditing] = useState(false)

  // Form State
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<ListingFormErrors>({})
  const [isDirty, setIsDirty] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  // Upload State
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)

  // Data State
  const [formData, setFormData] = useState<ListingFormData>(DEFAULT_LISTING_FORM)

  // Init Editing / Draft restore
  useEffect(() => {
    if (editId) {
      setIsEditing(true)
      setIsLoadingData(true)
      listingsApi.getForEdit(editId).then((res) => {
        if (res.data) {
          const l = res.data
          setFormData({
            title: l.title || '',
            description: l.description || '',
            price: l.price?.toString() || '',
            currency: 'EUR',
            category_id: l.category_id || '',
            condition: (l.condition as 'new' | 'used') ?? 'new',
            location: l.location || '',
            images: l.images || [],
          })
          setIsDirty(false)
          setFieldErrors({})
        }
        setIsLoadingData(false)
      })
      return
    }

    const draft = loadListingDraft(user?.id)
    if (draft) {
      setFormData(draft)
      setIsDirty(true)
    }
  }, [editId, user?.id])

  // Fetch Categories
  useEffect(() => {
    categoriesApi.getAll().then((res) => {
      if (res.data) setCategories(res.data)
    })
  }, [])

  // Unsaved changes warning
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirty) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // Auth Check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  if (authLoading || isLoadingData) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const updateField = <K extends keyof ListingFormData>(
    field: K,
    value: ListingFormData[K]
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      setIsDirty(true)
      saveListingDraft(user?.id ?? null, next)
      return next
    })

    const errorKey = field as keyof ListingFormErrors
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[errorKey]
        return next
      })
    }
  }

  const goToNextStep = () => {
    const errors = validateListingForm(formData)
    setFieldErrors(errors)

    if (step === 1 && !errors.category_id) {
      setStep(2)
      return
    }

    if (step === 2 && !hasListingFormErrors(errors)) {
      setStep(3)
      return
    }

    const missingFields = Object.keys(errors)
      .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
      .join(', ')
    setError(`Please fix the highlighted fields: ${missingFields}`)
  }

  const prevStep = () => setStep((prev) => prev - 1)

  const handleSubmit = async () => {
    const errors = validateListingForm(formData)
    setFieldErrors(errors)

    if (hasListingFormErrors(errors)) {
      const missingFields = Object.keys(errors)
        .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
        .join(', ')
      setError(`Please check the following fields: ${missingFields}`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    const translations = await generateListingTranslations(
      formData.title,
      formData.description,
      locale
    )

    try {
      let res
      if (isEditing && editId) {
        if (!session?.access_token) throw new Error('Session expired. Please sign in again.')
        res = await updateListingAction(editId, { ...formData, ...translations }, session.access_token)
      } else {
        res = await listingsApi.create({
          ...formData,
          ...translations,
          price: parseFloat(formData.price),
          user_id: user?.id ?? '',
        })
      }

      if (res.error || !res.data) throw new Error(res.error || 'Failed to save listing')

      clearListingDraft(user?.id ?? null)
      setIsDirty(false)

      if (isEditing) {
        router.push('/profile/my-listings')
      } else {
        router.push(`/listings/${res.data.id}`)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (!user?.id) {
      setError('You need to be logged in to upload images.')
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadProgress({ current: 0, total: files.length })

    const fileArray = Array.from(files)
    const result = await storageApi.uploadImages(
      fileArray,
      user.id,
      (current, total) => setUploadProgress({ current, total })
    )

    if (result.error || !result.data) {
      setError(result.error ?? 'Failed to upload images')
      setIsUploading(false)
      setUploadProgress(null)
      return
    }

    const newUrls = result.data.map((f) => f.url)
    updateField('images', [...formData.images, ...newUrls])

    setIsUploading(false)
    setUploadProgress(null)
  }

  const containerWidth = {
    1: 'max-w-6xl',
    2: 'max-w-3xl',
    3: 'max-w-5xl',
  }[step]

  return (
    <div
      className={cn(
        'relative mx-auto overflow-hidden rounded-3xl border border-border/50 bg-card p-8 shadow-2xl transition-[max-width] duration-500 ease-in-out',
        containerWidth
      )}
    >
      {/* Progress Bar */}
      <div className="absolute left-0 top-0 h-1.5 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4">
        <h1 className="mb-2 font-heading text-3xl font-black">
          {t.createListing.title}
        </h1>
        <p className="text-muted-foreground">{t.createListing.step.replace('{step}', step.toString())}</p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-destructive/10 p-4 font-medium text-destructive">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      <div className="min-h-[400px] space-y-8">
        {step === 1 && (
          <StepCategory
            categories={categories}
            formData={formData}
            fieldErrors={fieldErrors}
            updateField={updateField}
          />
        )}

        {step === 2 && (
          <StepDetails
            formData={formData}
            fieldErrors={fieldErrors}
            updateField={updateField}
          />
        )}

        {step === 3 && (
          <StepImages
            formData={formData}
            updateField={updateField}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            onFilesSelected={handleFilesSelected}
          />
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        {step > 1 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            className="font-bold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.createListing.back}
          </Button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <Button
            type="button"
            onClick={goToNextStep}
            className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
          >
            {t.createListing.nextStep} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[140px] rounded-xl bg-primary px-8 font-bold shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t.createListing.publish
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export function CreateListingForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }
    >
      <CreateListingFormContent />
    </Suspense>
  )
}
