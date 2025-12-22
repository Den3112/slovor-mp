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
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set([0]))
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const validImages = images?.filter(img => img && !imageError.has(images.indexOf(img))) || []

  if (validImages.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center gap-3">
        <ImageOff className="w-16 h-16 text-gray-400" />
        <span className="text-gray-500 text-lg font-medium">No images available</span>
      </div>
    )
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? validImages.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    setLoadingImages(prev => new Set([...prev, newIndex]))
  }

  const goToNext = () => {
    const newIndex = currentIndex === validImages.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    setLoadingImages(prev => new Set([...prev, newIndex]))
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
    setLoadingImages(prev => {
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
    setLoadingImages(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
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
        {/* Loading Skeleton */}
        {loadingImages.has(currentIndex) && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse z-10" />
        )}
        
        <Image
          src={validImages[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className={`object-cover transition-opacity duration-300 ${
            loadingImages.has(currentIndex) ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          priority={currentIndex === 0}
          onError={() => handleImageError(images.indexOf(validImages[currentIndex]))}
          onLoad={() => handleImageLoad(currentIndex)}
          unoptimized
        />

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity z-20 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity z-20 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-20">
            {currentIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {validImages.map((image, index) => {
            const originalIndex = images.indexOf(image)
            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setLoadingImages(prev => new Set([...prev, index]))
                }}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-blue-600 ring-2 ring-blue-200 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                {loadingImages.has(index) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
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
