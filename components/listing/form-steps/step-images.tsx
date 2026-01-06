'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { ListingFormData } from '@/lib/utils/listing-form-schema'

interface StepImagesProps {
    formData: ListingFormData
    updateField: <K extends keyof ListingFormData>(field: K, value: ListingFormData[K]) => void
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
        const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)] ?? mockImages[0]
        updateField('images', [...formData.images, randomImage as string])
    }

    return (
        <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-right-8">
            <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center transition-colors hover:bg-muted/30">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Upload className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{t.createListing.uploadPhotos}</h3>
                <p className="mx-auto mb-4 max-w-xs text-sm text-muted-foreground">
                    {t.createListing.dragDrop}
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
                                {t.createListing.uploading}
                            </>
                        ) : (
                            <>
                                <ImageIcon className="mr-2 h-4 w-4" />
                                {t.createListing.selectImages}
                            </>
                        )}
                    </Button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        multiple
                        className="hidden"
                        onChange={(e) => onFilesSelected(e.target.files)}
                    />

                    <Button
                        onClick={addMockImage}
                        type="button"
                        variant="outline"
                        className="border-primary/20 text-xs font-semibold text-primary hover:bg-primary/5"
                    >
                        {t.createListing.addMockImage}
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
                                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                                }}
                            />
                        </div>
                        <p className="text-[11px] text-muted-foreground/80">
                            {t.createListing.maxSize}
                        </p>
                    </div>
                )}

                {!uploadProgress && (
                    <p className="text-[11px] text-muted-foreground/80">
                        {t.createListing.maxSize}
                    </p>
                )}

                <div className="mt-4 flex items-center justify-center gap-3">
                    <input
                        type="text"
                        placeholder={t.createListing.orPasteUrl}
                        className="h-10 w-56 rounded-xl border bg-background px-3 text-sm"
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
                                className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <AlertCircle className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
