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
  onClearImages: () => void
}

export function StepImages({
  formData,
  isUploading,
  uploadProgress,
  onFilesSelected,
  onRemoveImage,
  onReorderImages,
  onClearImages,
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-2xl font-black tracking-tight">
            {t('uploadPhotos')}
          </h3>
          <span className="text-primary/60 text-[10px] font-black tracking-[0.2em] uppercase">
            {formData.images.length} / 10
          </span>
        </div>

        {formData.images.length > 0 && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearImages}
              className="text-muted-foreground hover:text-destructive flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              {t('clearAll', { defaultValue: 'Clear All' })}
            </Button>
          </div>
        )}

        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragActive
              ? 'var(--primary)'
              : 'rgba(var(--primary-rgb), 0.1)',
            backgroundColor: isDragActive
              ? 'rgba(var(--primary-rgb), 0.05)'
              : 'rgba(var(--primary-rgb), 0.02)',
            scale: isDragActive ? 1.02 : 1,
          }}
          className={cn(
            'group relative flex min-h-[320px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed transition-all duration-500',
            isUploading
              ? 'border-primary/50 cursor-wait'
              : 'glass-panel hover:border-primary/40 focus-within:border-primary/40 focus-within:ring-primary/20 shadow-primary/5 shadow-xl transition-all focus-within:ring-4'
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

          <div className="text-primary pointer-events-none flex flex-col items-center gap-6 p-8 text-center">
            <motion.div
              animate={
                isDragActive ? { y: -15, scale: 1.15 } : { y: 0, scale: 1 }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-primary shadow-primary/20 group-hover:shadow-primary/30 flex h-24 w-24 items-center justify-center rounded-[2rem] text-white shadow-2xl transition-all duration-500 group-hover:scale-110"
            >
              {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <Upload className="h-10 w-10" />
              )}
            </motion.div>
            <div className="space-y-3">
              <p className="text-foreground text-xl font-black tracking-tight">
                {isUploading
                  ? t('uploading')
                  : isDragActive
                    ? 'Drop images here'
                    : t('dragDrop')}
              </p>
              <p className="text-muted-foreground max-w-xs text-[10px] leading-relaxed font-black tracking-[0.15em] uppercase opacity-60">
                {t('maxSize')}
              </p>
            </div>
            {!isUploading && (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 pointer-events-auto mt-4 h-12 rounded-2xl px-10 font-black tracking-widest uppercase transition-all active:scale-95"
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel border-primary/10 shadow-primary/5 rounded-2xl border p-6 shadow-2xl"
          >
            <div className="text-primary/60 mb-4 flex w-full items-center justify-between text-[10px] font-black tracking-[0.3em] uppercase">
              <span className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadProgress.fileName
                  ? `Uploading: ${uploadProgress.fileName}`
                  : `${t('uploading')}...`}
              </span>
              <span className="text-foreground">
                {Math.round(
                  (uploadProgress.current / uploadProgress.total) * 100
                )}
                %
              </span>
            </div>
            <div className="bg-primary/5 h-3 w-full overflow-hidden rounded-full p-0.5">
              <motion.div
                className="bg-primary shadow-primary/30 h-full rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{
                  width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                }}
                transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Grid with Reorder */}
      {formData.images.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-primary/60 text-[10px] font-black tracking-[0.3em] uppercase">
              Manage & Reorder
            </h4>
            <p className="text-muted-foreground/60 hidden text-[10px] font-black tracking-widest uppercase sm:block">
              Drag to change order. First image is the cover.
            </p>
          </div>

          <Reorder.Group
            axis="y"
            values={formData.images}
            onReorder={onReorderImages}
            className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4"
          >
            {formData.images.map((img, idx) => (
              <Reorder.Item
                key={img}
                value={img}
                className="group glass-panel border-primary/5 shadow-primary/5 hover:border-primary/20 relative aspect-square cursor-grab overflow-hidden rounded-[2rem] border-2 shadow-xl transition-all duration-500 hover:scale-[1.02] active:cursor-grabbing"
              >
                <Image
                  src={img}
                  alt="preview"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveImage(idx)
                    }}
                    data-testid={`remove-image-${idx}`}
                    className="h-12 w-12 rounded-2xl shadow-xl transition-all active:scale-90"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <div className="glass-panel rounded-2xl border-white/20 bg-white/10 p-3.5 text-white shadow-xl backdrop-blur-md">
                    <GripHorizontal className="h-5 w-5" />
                  </div>
                </div>

                {/* Cover Badge */}
                <AnimatePresence>
                  {idx === 0 && (
                    <motion.div
                      key="cover-badge"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-primary shadow-primary/20 absolute top-4 left-4 rounded-xl px-4 py-2 text-[10px] font-black tracking-[0.2em] text-white uppercase shadow-xl backdrop-blur-md"
                    >
                      Cover
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="glass-panel absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-xl border-white/20 bg-black/60 text-[10px] font-black text-white backdrop-blur-md transition-all md:opacity-0 md:group-hover:opacity-100">
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
