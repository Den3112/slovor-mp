'use client'

import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface ListingImage {
  id: string
  file: File
  preview: string
  orderIndex: number
  isPrimary: boolean
  progress: number
  status: 'idle' | 'processing' | 'completed' | 'error'
  error?: string
}

const MAX_FILES = 15
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function useImageUpload() {
  const [images, setImages] = useState<ListingImage[]>([])

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('Canvas context not available'))

          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Blob creation failed'))
              const compressedFile = new File(
                [blob],
                `${file.name.split('.')[0]}.webp`,
                {
                  type: 'image/webp',
                  lastModified: Date.now(),
                }
              )
              resolve(compressedFile)
            },
            'image/webp',
            0.85
          )
        }
        img.onerror = () => reject(new Error('Image loading failed'))
        img.src = event.target?.result as string
      }
      reader.onerror = () => reject(new Error('File reading failed'))
      reader.readAsDataURL(file)
    })
  }

  const uploadImages = useCallback(
    async (files: File[]) => {
      const errors: string[] = []

      if (images.length + files.length > MAX_FILES) {
        errors.push(`Maximálny počet fotografií je ${MAX_FILES}.`)
        return { images: [], errors }
      }

      const newImages: ListingImage[] = await Promise.all(
        files.map(async (file, index) => {
          if (!ALLOWED_TYPES.includes(file.type)) {
            return {
              id: uuidv4(),
              file,
              preview: URL.createObjectURL(file),
              orderIndex: images.length + index,
              isPrimary: false,
              progress: 0,
              status: 'error',
              error: 'Nepodporovaný formát súboru (povolené: jpg, png, webp).',
            } as ListingImage
          }

          if (file.size > MAX_SIZE) {
            return {
              id: uuidv4(),
              file,
              preview: URL.createObjectURL(file),
              orderIndex: images.length + index,
              isPrimary: false,
              progress: 0,
              status: 'error',
              error: 'Súbor je príliš veľký (max 5MB).',
            } as ListingImage
          }

          const id = uuidv4()
          const preview = URL.createObjectURL(file)

          return {
            id,
            file,
            preview,
            orderIndex: images.length + index,
            isPrimary: images.length === 0 && index === 0,
            progress: 0,
            status: 'processing',
          } as ListingImage
        })
      )

      setImages((prev) => [...prev, ...newImages])

      // Process/Compress images
      const processedImages = await Promise.all(
        newImages.map(async (img) => {
          if (img.status === 'error') return img
          try {
            const compressedFile = await compressImage(img.file)
            return {
              ...img,
              file: compressedFile,
              status: 'completed',
              progress: 100,
            } as ListingImage
          } catch (err) {
            return {
              ...img,
              status: 'error',
              error: 'Chyba pri spracovaní obrázka.',
            } as ListingImage
          }
        })
      )

      setImages((prev) =>
        prev.map((img) => {
          const processed = processedImages.find((p) => p.id === img.id)
          return processed || img
        })
      )

      return { images: processedImages, errors }
    },
    [images]
  )

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id)
      // If we removed primary, set first one as primary
      if (
        prev.find((img) => img.id === id)?.isPrimary &&
        filtered.length > 0 &&
        filtered[0]
      ) {
        filtered[0].isPrimary = true
      }
      // Re-index
      return filtered.map((img, index) => ({ ...img, orderIndex: index }))
    })
  }, [])

  const reorderImages = useCallback((startIndex: number, endIndex: number) => {
    setImages((prev) => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      if (removed) {
        result.splice(endIndex, 0, removed)
      }
      return result.map((img, index) => ({ ...img, orderIndex: index }))
    })
  }, [])

  const setPrimary = useCallback((id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    )
  }, [])

  return {
    images,
    uploadImages,
    removeImage,
    reorderImages,
    setPrimary,
    MAX_FILES,
    MAX_SIZE,
  }
}
