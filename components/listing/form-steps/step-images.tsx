'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, AlertCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { ListingFormData } from '@/lib/utils/listing-form-schema'

interface StepImagesProps {
  formData: ListingFormData
  updateField: <K extends keyof ListingFormData>(
    field: K,
    value: ListingFormData[K]
  ) => void
  isUploading: boolean
  uploadProgress: { current: number; total: number } | null
  onFilesSelected: (files: FileList | null) => void
}

export function StepImages({
  formData,
  updateField,
  isUploading,
  uploadProgress,
  onFilesSelected,
}: StepImagesProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  const addMockImage = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=400&q=80',
    ]
    const randomImage =
      mockImages[Math.floor(Math.random() * mockImages.length)] ?? mockImages[0]
    updateField('images', [...formData.images, randomImage as string])
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-500">
      <div className="space-y-2">
        <label className="text-muted-foreground/80 ml-1 text-xs font-black tracking-widest uppercase">
          {t('createListing.uploadPhotos')}
        </label>

        <div
          onClick={handleFileInputClick}
          className="group hover:border-primary/50 hover:bg-primary/5 relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/5 py-12 text-center transition-all hover:scale-[1.01]"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-black/20 shadow-inner transition-transform duration-300 group-hover:scale-110">
            {isUploading ? (
              <Loader2 className="text-primary h-10 w-10 animate-spin" />
            ) : (
              <Upload className="text-muted-foreground group-hover:text-primary h-10 w-10 transition-colors" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-foreground text-xl font-bold">
              {isUploading
                ? t('createListing.uploading')
                : t('createListing.dragDrop')}
            </h3>
            <p className="text-muted-foreground/70 text-sm font-medium">
              {t('createListing.selectImages')}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => onFilesSelected(e.target.files)}
          />
        </div>
      </div>

      {uploadProgress && (
        <div className="bg-muted/20 rounded-2xl border border-white/5 p-4">
          <div className="text-muted-foreground mb-2 flex w-full items-center justify-between text-xs font-bold tracking-widest uppercase">
            <span>Uploading...</span>
            <span>
              {Math.round(
                (uploadProgress.current / uploadProgress.total) * 100
              )}
              %
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{
                width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Debug Mock Button - Keep simple */}
      <div className="flex justify-center">
        <Button
          onClick={addMockImage}
          type="button"
          variant="ghost"
          className="text-muted-foreground hover:text-primary text-xs font-medium"
        >
          + {t('createListing.addMockImage')}
        </Button>
      </div>

      {/* Image Preview Grid */}
      {formData.images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-3 lg:grid-cols-4">
          {formData.images.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl transition-transform hover:scale-105"
            >
              <Image
                src={img}
                alt="preview"
                fill
                className="object-cover transition-opacity group-hover:opacity-75"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    updateField(
                      'images',
                      formData.images.filter((_, i) => i !== idx)
                    )
                  }}
                  className="bg-destructive hover:bg-destructive/90 scale-90 rounded-full p-3 text-white shadow-lg transition-transform hover:scale-100"
                >
                  <AlertCircle className="h-6 w-6" />
                </button>
              </div>
              {idx === 0 && (
                <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
