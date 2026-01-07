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
  const { t, locale } = useTranslation()
  const { user, isLoading: authLoading } = useAuth()
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
        if (!user) throw new Error('Session expired. Please sign in again.')
        // Assuming updateListingAction uses cookie/server-side auth or we fetch session correctly.
        // For now, removing the explicit token pass if the action handles it, or fixing logic.
        // The action probably needs just the data if it uses server auth.
        // Let's create a fresh session check if needed or rely on the validated user.

        // Actually, we can get the session properly
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) throw new Error('Session expired')

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
    1: 'max-w-4xl',
    2: 'max-w-xl',
    3: 'max-w-4xl',
  }[step]

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background md:py-20 p-0 md:bg-gradient-to-b md:from-background md:via-background/95 md:to-background">
      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-border/10 bg-background/80 px-4 py-3 backdrop-blur-xl md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => step > 1 ? prevStep() : router.push('/')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.createListing.step.replace('{step}', step.toString())}</span>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={cn("h-1 w-8 rounded-full transition-colors", step >= i ? "bg-primary" : "bg-muted")} />
            ))}
          </div>
        </div>
        <div className="w-10" />
      </div>

      <div
        className={cn(
          'relative w-full overflow-hidden bg-background md:rounded-[2.5rem] md:border md:border-white/10 md:bg-black/20 md:p-10 md:shadow-2xl md:backdrop-blur-2xl transition-[max-width,height] duration-500 ease-in-out',
          containerWidth,
          // Mobile full height minus header/footer
          'min-h-[calc(100dvh-60px)] md:min-h-0'
        )}
      >
        {/* Desktop Progress Bar */}
        <div className="absolute left-0 top-0 hidden h-1.5 w-full bg-white/5 md:block">
          <div
            className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-700 ease-out box-shadow-glow"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Header - Desktop Only */}
        <div className="mb-8 text-center hidden md:block">
          <h1 className="mb-2 font-heading text-4xl font-black tracking-tight text-white drop-shadow-sm">
            {t.createListing.title}
          </h1>
          <p className="text-muted-foreground text-lg">{t.createListing.step.replace('{step}', step.toString())}</p>
        </div>

        {error && (
          <div className="mx-4 md:mx-0 mb-6 flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 font-medium text-destructive animate-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        <div className="px-4 py-6 md:p-0 md:min-h-[400px]">
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
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-border/10 bg-background/90 p-4 backdrop-blur-xl md:relative md:mt-10 md:justify-between md:border-t md:border-white/10 md:bg-transparent md:p-0 md:pt-8">
          {step > 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              className="hidden md:flex font-bold text-muted-foreground hover:text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> {t.createListing.back}
            </Button>
          ) : <div className="hidden md:block" />}

          {/* Mobile Back (if step > 1) */}
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            className={cn("md:hidden font-bold text-muted-foreground rounded-xl", step === 1 && "invisible")}
          >
            {t.createListing.back}
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              onClick={goToNextStep}
              className="rounded-2xl px-8 py-6 md:py-4 font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95"
            >
              {t.createListing.nextStep} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[140px] rounded-2xl bg-primary px-8 py-6 md:py-4 font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-transform active:scale-95"
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
