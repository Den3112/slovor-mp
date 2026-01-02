'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { categoriesApi, listingsApi } from '@/lib/supabase/queries'
import { storageApi } from '@/lib/api'
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

function CreateListingFormContent() {
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
  const [categories, setCategories] = useState<Category[]>([])

  // Upload State
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Data State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'EUR',
    category_id: '',
    condition: 'new' as 'new' | 'used',
    location: '',
    images: [] as string[],
  })

  // Init Editing
  useEffect(() => {
    if (editId) {
      setIsEditing(true)
      setIsLoadingData(true)
      listingsApi.getById(editId).then((res) => {
        if (res.data) {
          const l = res.data
          setFormData({
            title: l.title,
            description: l.description,
            price: l.price.toString(),
            currency: l.currency,
            category_id: l.category_id || '',
            condition: l.condition as 'new' | 'used',
            location: l.location,
            images: l.images || [],
          })
        }
        setIsLoadingData(false)
      })
    }
  }, [editId])

  // Fetch Categories
  useEffect(() => {
    categoriesApi.getAll().then((res) => {
      if (res.data) setCategories(res.data)
    })
  }, [])

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

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.category_id) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      let res
      if (isEditing && editId) {
        res = await listingsApi.update(editId, {
          ...formData,
          price: parseFloat(formData.price),
        })
      } else {
        res = await listingsApi.create({
          ...formData,
          price: parseFloat(formData.price),
          user_id: user?.id ?? '',
        })
      }

      if (res.error || !res.data)
        throw new Error(res.error || 'Failed to save listing')

      // Success
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

  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border/50 bg-card p-8 shadow-2xl">
      {/* Progress Bar */}
      <div className="absolute left-0 top-0 h-1.5 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4">
        <h1 className="mb-2 font-heading text-3xl font-black">
          Create New Listing
        </h1>
        <p className="text-muted-foreground">Step {step} of 3</p>
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
              <label className="mb-2 block text-sm font-bold">Category</label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateField('category_id', cat.id)}
                    className={cn(
                      'rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02]',
                      formData.category_id === cat.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border/50 bg-muted/20 hover:border-primary/50'
                    )}
                  >
                    <span className="mb-1 block text-2xl">{cat.icon}</span>
                    <span className="text-sm font-bold">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">Condition</label>
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
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-right-8">
            <div className="space-y-1">
              <label className="text-sm font-bold">Title</label>
              <input
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="h-14 w-full rounded-xl border border-border bg-muted/30 px-4 text-lg font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="What are you selling?"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-bold">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  className="h-14 w-full rounded-xl border border-border bg-muted/30 px-4 text-lg font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="0.00"
                />
              </div>
              <div className="w-1/3 space-y-1">
                <label className="text-sm font-bold">Currency</label>
                <div className="flex h-14 items-center rounded-xl border border-border bg-muted/30 px-4 font-bold text-muted-foreground">
                  EUR (€)
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="h-32 w-full resize-none rounded-xl border border-border bg-muted/30 p-4 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="Tell buyers more about your item..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold">Location</label>
              <input
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-muted/30 px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="City, District"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-right-8">
            <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center transition-colors hover:bg-muted/30">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Upload Photos</h3>
              <p className="mx-auto mb-4 max-w-xs text-sm text-muted-foreground">
                Drag and drop your photos here, or use the upload button to add
                real images to your listing.
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
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Select Images
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
                  Add Mock Image
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
                        width: `${
                          (uploadProgress.current / uploadProgress.total) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground/80">
                    Max 10MB per image. Supported formats: JPEG, PNG, WebP, GIF.
                  </p>
                </div>
              )}

              {!uploadProgress && (
                <p className="text-[11px] text-muted-foreground/80">
                  Max 10MB per image. Supported formats: JPEG, PNG, WebP, GIF.
                </p>
              )}

              <div className="mt-4 flex items-center justify-center gap-3">
                <input
                  type="text"
                  placeholder="Or paste Image URL"
                  className="h-10 w-56 rounded-lg border bg-background px-3 text-sm"
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
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
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
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        ) : (
          <div /> // Spacer
        )}

        {step < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={step === 1 && !formData.category_id}
            className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
          >
            Next Step <ArrowRight className="ml-2 h-4 w-4" />
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
              'Publish Listing'
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
