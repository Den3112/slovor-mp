'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { categoriesApi, listingsApi, storageApi } from '@/lib/api'
import { updateListingAction } from '@/lib/actions/listings'
import { generateListingTranslations } from '@/lib/services/translation'
import { validateListingContent } from '@/lib/moderation'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
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

export function useCreateListing() {
  const { t, locale } = useTranslation(['createListing', 'common', 'home'])
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [isEditing, setIsEditing] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<ListingFormErrors>({})
  const [isDirty, setIsDirty] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{
    current: number
    total: number
  } | null>(null)
  const [formData, setFormData] =
    useState<ListingFormData>(DEFAULT_LISTING_FORM)

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
    setError(`${t('fixErrors')}: ${missingFields}`)
  }

  const prevStep = () => setStep((prev) => prev - 1)

  const handleSubmit = async () => {
    const errors = validateListingForm(formData)
    setFieldErrors(errors)

    if (hasListingFormErrors(errors)) {
      const missingFields = Object.keys(errors)
        .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
        .join(', ')
      setError(`${t('checkFields')}: ${missingFields}`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    const contentCheck = validateListingContent(
      formData.title,
      formData.description,
      formData.location
    )
    if (!contentCheck.isValid) {
      setError(contentCheck.error || 'Obsah obsahuje nevhodné výrazy.')
      setIsSubmitting(false)
      return
    }

    const translations = await generateListingTranslations(
      formData.title,
      formData.description,
      locale as any
    )

    try {
      let res
      if (isEditing && editId) {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session?.access_token) throw new Error('Session expired')

        res = await updateListingAction(
          editId,
          { ...formData, ...translations },
          session.access_token
        )
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

      clearListingDraft(user?.id ?? null)
      setIsDirty(false)

      if (isEditing) {
        router.push('/profile/listings')
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

  return {
    state: {
      step,
      isSubmitting,
      isLoadingData,
      authLoading,
      error,
      fieldErrors,
      categories,
      isUploading,
      uploadProgress,
      formData,
      isEditing,
    },
    actions: {
      updateField,
      goToNextStep,
      prevStep,
      handleSubmit,
      handleFilesSelected,
      setStep,
    },
    flags: {
      showLoader: authLoading || isLoadingData,
    },
    t,
    router,
  }
}
