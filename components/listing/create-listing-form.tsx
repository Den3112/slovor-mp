'use client'

import { Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  Edit3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepCategory } from './form-steps/step-category'
import { StepDetails } from './form-steps/step-details'
import { StepImages } from './form-steps/step-images'
import { useCreateListing } from '@/lib/hooks/use-create-listing'
import { ListingPreview } from './listing-preview'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'

function CreateListingFormContent() {
  const { state, actions, flags, t, locale } = useCreateListing()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  console.log('CreateListingForm: RENDER', { user: !!user, authLoading })

  const {
    step,
    error,
    fieldErrors,
    categories,
    isUploading,
    uploadProgress,
    formData,
    isSubmitting,
  } = state

  const {
    updateField,
    goToNextStep,
    prevStep,
    handleSubmit,
    handleFilesSelected,
    handleRemoveImage,
    handleReorderImages,
  } = actions

  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')

  if (flags.showLoader) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
      </div>
    )
  }

  const containerWidth = {
    1: 'max-w-4xl',
    2: 'max-w-xl',
    3: 'max-w-4xl',
  }[step]

  const showPreview = viewMode === 'preview'

  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center py-8 md:py-16">
      {/* Mobile Top Bar */}
      <div className="border-border bg-background sticky top-0 z-50 flex w-full items-center justify-between border-b px-4 py-3 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            step > 1 && !showPreview ? prevStep() : router.push(`/${locale}/`)
          }
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {showPreview ? t('preview') : t('step', { step })}
          </span>
          {!showPreview && (
            <div className="mt-1 flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 w-8 rounded-full transition-colors',
                    step >= i ? 'bg-primary' : 'bg-muted'
                  )}
                />
              ))}
            </div>
          )}
        </div>
        <div className="w-10" />
      </div>

      <div
        className={cn(
          'bg-card md:border-border relative w-full overflow-hidden transition-[max-width,height] duration-500 ease-in-out md:rounded-lg md:border md:p-10 md:shadow-sm',
          containerWidth,
          'min-h-[calc(100dvh-60px)] md:min-h-0'
        )}
      >
        {/* Desktop Progress Bar */}
        <div className="bg-muted absolute top-0 left-0 hidden h-1 w-full md:block">
          <div
            className="bg-primary h-full transition-all duration-700 ease-out"
            style={{ width: `${showPreview ? 100 : (step / 3) * 100}%` }}
          />
        </div>

        {/* Header - Desktop Only */}
        <div className="mb-6 hidden text-center md:block">
          <h1 className="font-heading text-foreground mb-2 text-3xl font-bold tracking-tight">
            {showPreview ? t('preview') : t('title')}
          </h1>
          <p className="text-muted-foreground">
            {showPreview ? t('previewDescription') : t('step', { step })}
          </p>
        </div>

        {/* View Mode Tabs - Desktop */}
        <div className="mb-6 hidden justify-center md:flex">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as 'edit' | 'preview')}
          >
            <TabsList className="bg-muted">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                {t('edit')}
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {t('preview')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {error && (
          <div className="border-destructive/20 bg-destructive/10 text-destructive animate-in slide-in-from-top-2 mx-4 mb-6 flex items-center gap-2 rounded-lg border p-4 font-medium md:mx-0">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        <div className="px-4 py-6 md:min-h-[400px] md:p-0">
          {showPreview ? (
            <ListingPreview formData={formData} categories={categories} />
          ) : (
            <>
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
                  categories={categories}
                />
              )}

              {step === 3 && (
                <StepImages
                  formData={formData}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  onFilesSelected={handleFilesSelected}
                  onRemoveImage={handleRemoveImage}
                  onReorderImages={handleReorderImages}
                />
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="border-border bg-card fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t p-4 md:relative md:mt-10 md:justify-between md:border-t md:border-transparent md:bg-transparent md:p-0 md:pt-8">
          {!showPreview ? (
            <>
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  className="text-muted-foreground hover:bg-secondary hidden rounded-lg font-bold md:flex"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}
                </Button>
              ) : (
                <div className="hidden md:block" />
              )}

              {/* Mobile Back (if step > 1) */}
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                className={cn(
                  'text-muted-foreground rounded-lg font-bold md:hidden',
                  step === 1 && 'invisible'
                )}
              >
                {t('back')}
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={goToNextStep}
                  className="rounded-lg px-8 py-6 font-bold transition-transform active:scale-95 md:py-4"
                >
                  {t('nextStep')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 min-w-[140px] rounded-lg px-8 py-6 font-bold transition-transform active:scale-95 md:py-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    t('publish')
                  )}
                </Button>
              )}
            </>
          ) : (
            <div className="flex w-full gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setViewMode('edit')}
                className="flex-1 rounded-lg"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                {t('backToEdit')}
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary flex-1 rounded-lg px-8 py-4 font-bold"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  t('createListing:publish')
                )}
              </Button>
            </div>
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
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
        </div>
      }
    >
      <CreateListingFormContent />
    </Suspense>
  )
}
