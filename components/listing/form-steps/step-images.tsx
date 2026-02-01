'use client'

import { } from 'react' // Wait, this is actually used if it was { useState } but it's empty
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, AlertCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
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
  const { t } = useTranslation(['createListing', 'common'])
  const fileInputRef = { current: null as HTMLInputElement | null }

  const handleMockImage = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
    ]
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)] as string
    updateField('images', [...formData.images, randomImage])
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            {t('uploadPhotos')}
          </h3>
          <span className="text-muted-foreground text-sm">
            {formData.images.length} / 10
          </span>
        </div>

        <div
          className={cn(
            'group relative flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all',
            isUploading
              ? 'border-primary/50 bg-primary/5'
              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
          )}
        >
          <input
            ref={(el) => { if (el) fileInputRef.current = el }}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onFilesSelected(e.target.files)}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="bg-primary/20 flex h-20 w-20 items-center justify-center rounded-2xl text-primary transition-transform group-hover:scale-110">
              {isUploading ? <Loader2 className="h-10 w-10 animate-spin" /> : <Upload className="h-10 w-10" />}
            </div>
            <div className="space-y-2">
              <p className="text-lg font-bold text-white">
                {isUploading
                  ? t('uploading')
                  : t('dragDrop')}
              </p>
              <p className="text-muted-foreground text-sm max-w-xs">
                {t('maxSize')}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary text-white hover:bg-primary/90 rounded-2xl px-8 shadow-lg shadow-primary/20"
            >
              {t('selectImages')}
            </Button>
          </div>
        </div>

        {/* Mock Image Button (only for dev/test) */}
        {process.env.NODE_ENV !== 'production' && (
          <button
            type="button"
            onClick={handleMockImage}
            className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-bold transition-colors"
          >
            + {t('addMockImage')}
          </button>
        )}
      </div>

      {uploadProgress && (
        <div className="bg-muted/20 rounded-2xl border border-white/5 p-4">
          <div className="text-muted-foreground mb-2 flex w-full items-center justify-between text-xs font-bold tracking-widest uppercase">
            <span>{t('uploading')}</span>
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
