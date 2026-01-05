'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { categoriesApi, listingsApi, storageApi } from '@/lib/api'
import { updateListingAction } from '@/lib/actions/listings'
import { generateListingTranslations } from '@/lib/services/translation'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Upload,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react'
import Image from 'next/image'
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Data State
  const [formData, setFormData] = useState<ListingFormData>(DEFAULT_LISTING_FORM)

  // Init Editing / Draft restore
  useEffect(() => {
    // If editing existing listing - load data from DB
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

    // Otherwise try to restore draft
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

  // Unsaved changes warning on tab/window close
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirty) return
      event.preventDefault()
      // Chrome requires returnValue to be set
      // eslint-disable-next-line no-param-reassign
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)
    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [isDirty])

  // Auth Check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  if (authLoading || isLoadingData)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )

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
  }

  const goToNextStep = () => {
    const errors = validateListingForm(formData)
    setFieldErrors(errors)

    // For step 1, selected category is enough; for step 2, validate everything
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
        // Use Server Action for updates to bypass RLS issues securely
        res = await updateListingAction(editId, { ...formData, ...translations }, session.access_token)
      } else {
        res = await listingsApi.create({
          ...formData,
          ...translations,
          price: parseFloat(formData.price),
          user_id: user?.id ?? '',
        })
      }

      if (res.error || !res.data)
        throw new Error(res.error || 'Failed to save listing')

      // Success
      clearListingDraft(user?.id ?? null)
      setIsDirty(false)

      if (isEditing) {
        router.push('/dashboard/listings')
      } else {
        router.push(`/listings/${res.data.id}`)
      }
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      )
      setIsSubmitting(false)
    }
  }

  // Real image upload using Supabase Storage
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

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  // Handlers for optional mock / manual Image input (kept as fallback)
  const addMockImage = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=400&q=80',
    ]
    const randomImage = (mockImages[
      Math.floor(Math.random() * mockImages.length)
    ] ?? mockImages[0]) as string
    updateField('images', [...formData.images, randomImage])
  }

  // Dynamic max-width based on step
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
          <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-right-8">
            <div>
              <label className="mb-2 block text-sm font-bold">{t.createListing.category}</label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateField('category_id', cat.id)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-6 text-center transition-all hover:scale-[1.02]',
                      formData.category_id === cat.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border/50 bg-muted/20 hover:border-primary/50'
                    )}
                  >
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="text-sm font-bold">{cat.name}</span>
                  </button>
                ))}
              </div>
              {fieldErrors.category_id && (
                <p className="mt-2 text-sm text-destructive">
                  {fieldErrors.category_id}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">{t.createListing.condition}</label>
              <div className="flex gap-4">
                {(['new', 'used'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateField('condition', c)}
                    className={cn(
                      'flex-1 rounded-xl border-2 px-6 py-3 font-bold capitalize transition-all',
                      formData.condition === c
                        ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'border-border/50 bg-transparent text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {c === 'new' ? t.filters.new : t.filters.used}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-right-8">
            <div className="space-y-1">
              <label className="text-sm font-bold">{t.createListing.itemTitle}</label>
              <input
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className={cn(
                  'h-14 w-full rounded-xl border bg-muted/30 px-4 text-lg font-medium outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
                  fieldErrors.title ? 'border-destructive' : 'border-border'
                )}
                placeholder={t.createListing.titlePlaceholder}
              />
              {fieldErrors.title && (
                <p className="text-sm text-destructive">{fieldErrors.title}</p>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-bold">{t.createListing.price}</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  className={cn(
                    'h-14 w-full rounded-xl border bg-muted/30 px-4 text-lg font-medium outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
                    fieldErrors.price ? 'border-destructive' : 'border-border'
                  )}
                  placeholder="0.00"
                />
                {fieldErrors.price && (
                  <p className="text-sm text-destructive">{fieldErrors.price}</p>
                )}
              </div>
              <div className="w-1/3 space-y-1">
                <label className="text-sm font-bold">{t.createListing.currency}</label>
                <div className="flex h-14 items-center rounded-xl border border-border bg-muted/30 px-4 font-bold text-muted-foreground">
                  EUR (€)
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold">{t.createListing.description}</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="h-32 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                placeholder={t.createListing.descPlaceholder}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold">{t.createListing.location}</label>
              <input
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                className={cn(
                  'h-12 w-full rounded-xl border bg-muted/30 px-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
                  fieldErrors.location ? 'border-destructive' : 'border-border'
                )}
                placeholder={t.createListing.locationPlaceholder}
              />
              {fieldErrors.location && (
                <p className="text-sm text-destructive">{fieldErrors.location}</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-right-8">
            <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center transition-colors hover:bg-muted/30">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{t.createListing.uploadPhotos}</h3>
              <p className="mx-auto mb-4 max-w-xs text-sm text-muted-foreground">
                {t.createListing.dragDrop}
              </p>

              <div className="mb-4 flex flex-col items-center justify-center gap-3 md:flex-row">
                <Button
                  type="button"
                  onClick={handleFileInputClick}
                  disabled={isUploading}
                  className="rounded-xl px-6 font-bold shadow-md shadow-primary/20"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.createListing.uploading}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {t.createListing.selectImages}
                    </>
                  )}
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />

                <Button
                  onClick={addMockImage}
                  type="button"
                  variant="outline"
                  className="border-primary/20 text-xs font-semibold text-primary hover:bg-primary/5"
                >
                  {t.createListing.addMockImage}
                </Button>
              </div>

              {uploadProgress && (
                <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex w-full items-center justify-between">
                    <span>
                      Uploading {uploadProgress.current} / {uploadProgress.total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{
                        width: `${(uploadProgress.current / uploadProgress.total) * 100
                          }%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground/80">
                    {t.createListing.maxSize}
                  </p>
                </div>
              )}

              {!uploadProgress && (
                <p className="text-[11px] text-muted-foreground/80">
                  {t.createListing.maxSize}
                </p>
              )}

              <div className="mt-4 flex items-center justify-center gap-3">
                <input
                  type="text"
                  placeholder={t.createListing.orPasteUrl}
                  className="h-10 w-56 rounded-xl border bg-background px-3 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      e.preventDefault()
                      updateField('images', [
                        ...formData.images,
                        e.currentTarget.value.trim(),
                      ])
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </div>
            </div>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-border/50 shadow-md"
                  >
                    <Image
                      src={img}
                      alt="preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      onClick={() =>
                        updateField(
                          'images',
                          formData.images.filter((_, i) => i !== idx)
                        )
                      }
                      className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          <div /> // Spacer
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
