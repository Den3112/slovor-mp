'use client'

import { Suspense, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, AlertCircle, Eye, Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepCategory, StepDetails, StepImages } from './steps'
import { useCreateListing } from '@/lib/hooks/use-create-listing'
import { ListingPreview } from '../listing-preview'

import { FormHeader } from './form-header'
import { FormProgress } from './form-progress'
import { FormActions } from './form-actions'

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

  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')

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
  }[step as 1 | 2 | 3]

  const showPreview = viewMode === 'preview'

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background md:py-20 p-0 md:bg-gradient-to-b md:from-background md:via-background/95 md:to-background">
      <FormHeader
        step={step}
        showPreview={showPreview}
        t={t}
        router={router}
        prevStep={prevStep}
      />

      <div
        className={cn(
          'relative w-full overflow-hidden bg-zinc-950 md:border-2 md:border-primary/10 md:p-12 md:shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)] transition-[max-width,height] duration-500 ease-in-out',
          containerWidth,
          'min-h-[calc(100dvh-60px)] md:min-h-0'
        )}
      >
        <FormProgress step={step} showPreview={showPreview} />

        {/* View Mode Tabs - Desktop */}
        <div className="hidden md:flex justify-center mb-10">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'edit' | 'preview')}>
            <TabsList className="bg-zinc-900 border-2 border-primary/20 h-14 p-1 rounded-none">
              <TabsTrigger value="edit" className="flex items-center gap-3 px-8 rounded-none font-sans text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                <Edit3 className="h-4 w-4" />
                {t.createListing.edit}
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-3 px-8 rounded-none font-sans text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                <Eye className="h-4 w-4" />
                {t.createListing.preview}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {error && (
          <div className="mx-4 md:mx-0 mb-8 flex items-center gap-4 border-2 border-destructive/20 bg-destructive/5 p-6 font-sans text-[10px] font-bold uppercase tracking-widest text-destructive animate-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        <div className="px-4 py-6 md:p-0 md:min-h-[400px]">
          {showPreview ? (
            <ListingPreview formData={formData} categories={categories} />
          ) : (
            <div className="animate-in fade-in duration-500">
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
          )}
        </div>

        <FormActions
          step={step}
          showPreview={showPreview}
          isSubmitting={isSubmitting}
          t={t}
          prevStep={prevStep}
          goToNextStep={goToNextStep}
          handleSubmit={handleSubmit}
          setViewMode={setViewMode}
        />
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
