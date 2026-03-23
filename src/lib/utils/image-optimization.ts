/**
 * Utility for client-side image optimization.
 * Reduces image size before upload to save bandwidth and storage.
 */

export interface OptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  mimeType?: string
}

const DEFAULT_OPTIONS: OptimizationOptions = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.8,
  mimeType: 'image/jpeg',
}

/**
 * Compresses an image file using Canvas.
 */
export async function optimizeImage(
  file: File,
  options: OptimizationOptions = {}
): Promise<File> {
  const { maxWidth, maxHeight, quality, mimeType } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  // Skip non-images
  if (!file.type.startsWith('image/')) {
    return file
  }

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > (maxWidth ?? 1600) || height > (maxHeight ?? 1600)) {
          const ratio = Math.min(
            (maxWidth ?? 1600) / width,
            (maxHeight ?? 1600) / height
          )
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        // Draw image to canvas (this also handles orientation in modern browsers)
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const optimizedFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now(),
            })
            resolve(optimizedFile)
          },
          mimeType,
          quality
        )
      }
      img.onerror = () => resolve(file)
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

/**
 * Batch optimizes multiple images.
 */
export async function optimizeImages(
  files: FileList | File[],
  options: OptimizationOptions = {}
): Promise<File[]> {
  const fileArray = Array.from(files)
  return Promise.all(fileArray.map((file) => optimizeImage(file, options)))
}
