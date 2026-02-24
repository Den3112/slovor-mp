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

import { Button } from '@/components/ui/button'

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
      <div className="bg-muted border-border flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-xl border">
        <ImageOff className="text-muted-foreground h-16 w-16" />
        <span className="text-muted-foreground text-lg font-medium">
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
        className="bg-card group relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border shadow-md"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading Skeleton */}
        {loadingImages.has(currentIndex) && (
          <div className="bg-muted absolute inset-0 z-10 animate-pulse" />
        )}

        <Image
          src={validImages[currentIndex] || '/images/placeholder.jpg'}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${loadingImages.has(currentIndex) ? 'opacity-0' : 'opacity-100'
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
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute top-1/2 left-4 z-20 h-12 w-12 -translate-y-1/2 rounded-xl border border-white/20 bg-black/40 p-2 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-black/60 hover:text-white md:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute top-1/2 right-4 z-20 h-12 w-12 -translate-y-1/2 rounded-xl border border-white/20 bg-black/40 p-2 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-black/60 hover:text-white md:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute right-4 bottom-4 z-20 rounded-xl bg-black/60 px-3 py-1.5 text-[10px] font-black tracking-widest text-white uppercase">
            {currentIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex gap-2 overflow-x-auto px-1 pb-2">
          {validImages.map((image, index) => {
            const originalIndex = images.indexOf(image)
            return (
              <Button
                variant="ghost"
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setLoadingImages((prev) => new Set([...prev, index]))
                }}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 p-0 transition-all hover:bg-transparent ${index === currentIndex
                  ? 'border-primary ring-primary/20 opacity-100 ring-4 ring-offset-2'
                  : 'hover:border-primary/50 border-transparent opacity-60 hover:opacity-100'
                  }`}
                aria-label={`View image ${index + 1}`}
              >
                {loadingImages.has(index) && (
                  <div className="bg-muted absolute inset-0 animate-pulse" />
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
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}
