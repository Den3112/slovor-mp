'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, Trash2, GripHorizontal } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { ListingFormData } from '@/lib/utils/listing-form-schema'
import { motion, AnimatePresence, Reorder } from 'framer-motion'

interface StepImagesProps {
  formData: ListingFormData
  isUploading: boolean
  uploadProgress: { current: number; total: number; fileName?: string } | null
  onFilesSelected: (files: FileList | null) => void
  onRemoveImage: (index: number) => void
  onReorderImages: (newImages: string[]) => void
}

export function StepImages({
  formData,
  isUploading,
  uploadProgress,
  onFilesSelected,
  onRemoveImage,
  onReorderImages,
}: StepImagesProps) {
  const { t } = useTranslation(['createListing', 'common'])
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-xl font-bold">
            {t('uploadPhotos')}
          </h3>
          <span className="text-muted-foreground text-sm font-medium">
            {formData.images.length} / 10
          </span>
        </div>

        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragActive ? 'var(--primary)' : 'var(--border)',
            backgroundColor: isDragActive ? 'var(--accent)' : 'transparent',
            scale: isDragActive ? 1.01 : 1,
          }}
          className={cn(
            'group relative flex min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200',
            isUploading
              ? 'border-primary/50 bg-primary/5 cursor-wait'
              : 'bg-card hover:border-primary/40 focus-within:border-primary/40 focus-within:ring-primary/10 transition-all focus-within:ring-2'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onFilesSelected(e.target.files)}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={isUploading || formData.images.length >= 10}
            title={t('uploadPhotos')}
            aria-label={t('uploadPhotos')}
          />

          <div className="pointer-events-none flex flex-col items-center gap-4 p-8 text-center">
            <motion.div
              animate={isDragActive ? { y: -10 } : { y: 0 }}
              className="bg-primary/10 text-primary flex h-20 w-20 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
            >
              {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <Upload className="h-10 w-10" />
              )}
            </motion.div>
            <div className="space-y-2">
              <p className="text-foreground text-lg font-bold">
                {isUploading
                  ? t('uploading')
                  : isDragActive
                    ? 'Drop images here'
                    : t('dragDrop')}
              </p>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                {t('maxSize')}
              </p>
            </div>
            {!isUploading && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 pointer-events-auto mt-2 rounded-lg px-8 shadow-sm transition-all active:scale-95"
                disabled={formData.images.length >= 10}
              >
                {t('selectImages')}
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {uploadProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-muted/30 border-border rounded-lg border p-5 shadow-sm"
          >
            <div className="text-muted-foreground mb-3 flex w-full items-center justify-between text-[10px] font-bold tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                {uploadProgress.fileName
                  ? `Uploading: ${uploadProgress.fileName}`
                  : `${t('uploading')}...`}
              </span>
              <span>
                {Math.round(
                  (uploadProgress.current / uploadProgress.total) * 100
                )}
                %
              </span>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-lg">
              <motion.div
                className="bg-primary h-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Grid with Reorder */}
      {formData.images.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Manage & Reorder
            </h4>
            <p className="text-muted-foreground hidden text-[10px] sm:block">
              Drag to change order. First image is the cover.
            </p>
          </div>

          <Reorder.Group
            axis="y"
            values={formData.images}
            onReorder={onReorderImages}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {formData.images.map((img, idx) => (
              <Reorder.Item
                key={img}
                value={img}
                className="group border-border bg-muted relative aspect-square cursor-grab overflow-hidden rounded-lg border shadow-sm active:cursor-grabbing"
              >
                <Image
                  src={img}
                  alt="preview"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveImage(idx)
                    }}
                    className="h-10 w-10 rounded-lg shadow-sm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <div className="rounded-lg bg-white/20 p-2.5 text-white">
                    <GripHorizontal className="h-5 w-5" />
                  </div>
                </div>

                {/* Cover Badge */}
                <AnimatePresence>
                  {idx === 0 && (
                    <motion.div
                      key="cover-badge"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-primary absolute top-3 left-3 rounded-lg px-3 py-1 text-[9px] font-bold tracking-widest text-white uppercase shadow-sm"
                    >
                      Cover
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-black/70 text-[10px] font-bold text-white uppercase transition-all md:opacity-0 md:group-hover:opacity-100">
                  {idx + 1}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}
    </div>
  )
}
