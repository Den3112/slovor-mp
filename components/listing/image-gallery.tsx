'use client'

// Image Gallery Component with Mobile Swipe Support
// Principle #1: Small component (< 150 lines)

import { useState, useRef, type TouchEvent } from 'react'
// import type { TouchEvent } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageError, setImageError] = useState<Set<number>>(new Set())
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set([0]))
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const validImages =
    images?.filter((img) => img && !imageError.has(images.indexOf(img))) || []

  if (validImages.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-muted to-muted/80">
        <ImageOff className="h-16 w-16 text-muted-foreground" />
        <span className="text-lg font-medium text-muted-foreground">
          No images available
        </span>
      </div>
    )
  }

  const goToPrevious = () => {
    const newIndex =
      currentIndex === 0 ? validImages.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    setLoadingImages((prev) => new Set([...prev, newIndex]))
  }

  const goToNext = () => {
    const newIndex =
      currentIndex === validImages.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    setLoadingImages((prev) => new Set([...prev, newIndex]))
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches && e.touches[0]) {
      touchStartX.current = e.touches[0].clientX
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches && e.touches[0]) {
      touchEndX.current = e.touches[0].clientX
    }
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }
  }

  const handleImageError = (index: number) => {
    setImageError((prev) => new Set([...prev, index]))
    setLoadingImages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    // If current image fails, move to next
    if (index === currentIndex && validImages.length > 1) {
      goToNext()
    }
  }

  const handleImageLoad = (index: number) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-2xl border border-white/10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading Skeleton */}
        {loadingImages.has(currentIndex) && (
          <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-muted to-muted/80" />
        )}

        <Image
          src={validImages[currentIndex] || '/images/placeholder.jpg'}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className={`object-cover transition-opacity duration-300 ${loadingImages.has(currentIndex) ? 'opacity-0' : 'opacity-100'
            }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          priority={currentIndex === 0}
          onError={() => {
            const current = validImages[currentIndex]
            if (current) handleImageError(images.indexOf(current))
          }}
          onLoad={() => handleImageLoad(currentIndex)}
          unoptimized
        />

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100 md:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100 md:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 z-20 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            {currentIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex gap-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => {
            const originalIndex = images.indexOf(image)
            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setLoadingImages((prev) => new Set([...prev, index]))
                }}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${index === currentIndex
                  ? 'border-primary shadow-lg ring-2 ring-primary/20'
                  : 'border-border hover:border-border'
                  }`}
                aria-label={`View image ${index + 1}`}
              >
                {loadingImages.has(index) && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
                <Image
                  src={image}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  onError={() => handleImageError(originalIndex)}
                  onLoad={() => handleImageLoad(index)}
                  unoptimized
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
