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
import { StepCategory, StepDetails, StepImages } from './form-steps'
import { useCreateListing } from './use-create-listing'
import { ListingPreview } from './listing-preview'

function CreateListingFormContent() {
  const { state, actions, flags, t, router } = useCreateListing()

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
    <div className="bg-background md:from-background md:via-background/95 md:to-background flex min-h-[100dvh] flex-col items-center justify-center p-0 md:bg-gradient-to-b md:py-20">
      {/* Mobile Top Bar */}
      <div className="border-border/10 bg-background/80 sticky top-0 z-50 flex w-full items-center justify-between border-b px-4 py-3 backdrop-blur-xl md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            step > 1 && !showPreview ? prevStep() : router.push('/')
          }
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            {showPreview
              ? t.createListing.preview
              : t.createListing.step.replace('{step}', step.toString())}
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
          'bg-background relative w-full overflow-hidden transition-[max-width,height] duration-500 ease-in-out md:rounded-[2.5rem] md:border md:border-white/10 md:bg-black/20 md:p-10 md:shadow-2xl md:backdrop-blur-2xl',
          containerWidth,
          'min-h-[calc(100dvh-60px)] md:min-h-0'
        )}
      >
        {/* Desktop Progress Bar */}
        <div className="absolute top-0 left-0 hidden h-1.5 w-full bg-white/5 md:block">
          <div
            className="from-primary/50 to-primary box-shadow-glow h-full bg-gradient-to-r transition-all duration-700 ease-out"
            style={{ width: `${showPreview ? 100 : (step / 3) * 100}%` }}
          />
        </div>

        {/* Header - Desktop Only */}
        <div className="mb-6 hidden text-center md:block">
          <h1 className="font-heading mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm">
            {showPreview ? t.createListing.preview : t.createListing.title}
          </h1>
          <p className="text-muted-foreground">
            {showPreview
              ? t.createListing.previewDescription
              : t.createListing.step.replace('{step}', step.toString())}
          </p>
        </div>

        {/* View Mode Tabs - Desktop */}
        <div className="mb-6 hidden justify-center md:flex">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as 'edit' | 'preview')}
          >
            <TabsList className="bg-muted/50">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                {t.createListing.edit}
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {t.createListing.preview}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {error && (
          <div className="border-destructive/20 bg-destructive/10 text-destructive animate-in slide-in-from-top-2 mx-4 mb-6 flex items-center gap-2 rounded-2xl border p-4 font-medium md:mx-0">
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
            </>
          )}
        </div>

        {/* Actions */}
        <div className="border-border/10 bg-background/90 fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t p-4 backdrop-blur-xl md:relative md:mt-10 md:justify-between md:border-t md:border-white/10 md:bg-transparent md:p-0 md:pt-8">
          {!showPreview ? (
            <>
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  className="text-muted-foreground hidden rounded-xl font-bold hover:bg-white/10 hover:text-white md:flex"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t.createListing.back}
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
                  'text-muted-foreground rounded-xl font-bold md:hidden',
                  step === 1 && 'invisible'
                )}
              >
                {t.createListing.back}
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={goToNextStep}
                  className="shadow-primary/20 rounded-2xl px-8 py-6 font-bold shadow-lg transition-transform active:scale-95 md:py-4"
                >
                  {t.createListing.nextStep}{' '}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary shadow-primary/20 hover:bg-primary/90 min-w-[140px] rounded-2xl px-8 py-6 font-bold shadow-lg transition-transform active:scale-95 md:py-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    t.createListing.publish
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
                className="flex-1 rounded-xl"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                {t.createListing.backToEdit}
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary shadow-primary/20 flex-1 rounded-2xl px-8 py-4 font-bold shadow-lg"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  t.createListing.publish
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
