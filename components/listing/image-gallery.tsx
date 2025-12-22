'use client'

// Image Gallery Component with Mobile Swipe Support
// Principle #1: Small component (< 150 lines)

import { useState, useRef, TouchEvent } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageError, setImageError] = useState<Set<number>>(new Set())
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const validImages = images?.filter(img => img && !imageError.has(images.indexOf(img))) || []

  if (validImages.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-3">
        <ImageOff className="w-16 h-16 text-gray-400" />
        <span className="text-gray-500 text-lg">No images available</span>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
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
    setImageError(prev => new Set([...prev, index]))
    // If current image fails, move to next
    if (index === currentIndex && validImages.length > 1) {
      goToNext()
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={validImages[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          priority={currentIndex === 0}
          onError={() => handleImageError(images.indexOf(validImages[currentIndex]))}
          unoptimized // For external images
        />

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={() => handleImageError(images.indexOf(image))}
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
