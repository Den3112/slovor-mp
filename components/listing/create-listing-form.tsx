'use client'

import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepCategory, StepDetails, StepImages } from './form-steps'
import { useCreateListing } from './use-create-listing'

function CreateListingFormContent() {
  const {
    state,
    actions,
    flags,
    t,
    router
  } = useCreateListing()

  const {
    step,
    error,
    fieldErrors,
    categories,
    isUploading,
    uploadProgress,
    formData,
    isSubmitting
  } = state

  const {
    updateField,
    goToNextStep,
    prevStep,
    handleSubmit,
    handleFilesSelected
  } = actions

  if (flags.showLoader) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
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
