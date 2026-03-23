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
  useAuth() // Ensure auth context is available

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
    handleClearImages,
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
          'glass-panel md:border-primary/10 md:shadow-primary/5 relative w-full overflow-hidden transition-[max-width,height] duration-500 ease-in-out md:rounded-[2rem] md:p-12 md:shadow-2xl',
          containerWidth,
          'min-h-[calc(100dvh-60px)] md:min-h-0'
        )}
      >
        {/* Desktop Progress Bar */}
        <div className="bg-primary/5 absolute top-0 left-0 hidden h-1.5 w-full md:block">
          <div
            className="bg-primary ease-out-expo h-full rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] transition-all duration-1000"
            style={{ width: `${showPreview ? 100 : (step / 3) * 100}%` }}
          />
        </div>

        {/* Header - Desktop Only */}
        <div className="mb-10 hidden text-center md:block">
          <h1 className="font-heading text-foreground mb-3 text-4xl font-black tracking-tight">
            {showPreview ? t('preview') : t('title')}
          </h1>
          <p className="text-muted-foreground font-medium opacity-70">
            {showPreview ? t('previewDescription') : t('step', { step })}
          </p>
        </div>

        {/* View Mode Tabs - Desktop */}
        <div className="mb-8 hidden justify-center md:flex">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as 'edit' | 'preview')}
          >
            <TabsList className="glass-panel border-primary/5 bg-primary/2 h-12 gap-1 px-1.5">
              <TabsTrigger
                value="edit"
                className="data-[state=active]:bg-primary flex items-center gap-2 rounded-xl px-6 font-black tracking-tight transition-all active:scale-95 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Edit3 className="h-4 w-4" />
                {t('edit')}
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-primary flex items-center gap-2 rounded-xl px-6 font-black tracking-tight transition-all active:scale-95 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Eye className="h-4 w-4" />
                {t('preview')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {error && (
          <div className="border-destructive/20 bg-destructive/10 text-destructive animate-in slide-in-from-top-2 mx-4 mb-6 flex items-center gap-2 rounded-xl border p-4 font-medium md:mx-0">
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
                  onClearImages={handleClearImages}
                />
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="glass-panel border-primary/10 fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:relative md:bottom-0 md:mt-12 md:justify-between md:border-t-0 md:bg-transparent md:p-0">
          {!showPreview ? (
            <>
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  className="text-muted-foreground hover:bg-primary/5 hover:text-primary hidden h-14 rounded-2xl px-8 font-black tracking-tight transition-all active:scale-95 md:flex"
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
                  'text-muted-foreground h-14 rounded-2xl px-6 font-black tracking-tight transition-all active:scale-95 md:hidden',
                  step === 1 && 'invisible'
                )}
              >
                {t('back')}
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={goToNextStep}
                  className="shadow-primary/20 h-14 rounded-2xl px-10 font-black tracking-tight shadow-xl transition-all active:scale-95 md:py-4"
                >
                  {t('nextStep')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 shadow-primary/30 h-14 min-w-[160px] rounded-2xl px-10 font-black tracking-tight shadow-xl transition-all active:scale-95 md:py-4"
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
            <div className="flex w-full gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setViewMode('edit')}
                className="border-primary/20 h-14 flex-1 rounded-2xl font-black tracking-tight transition-all active:scale-95"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                {t('backToEdit')}
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary shadow-primary/20 h-14 flex-1 rounded-2xl px-8 font-black tracking-tight shadow-xl transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  t('publish')
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
