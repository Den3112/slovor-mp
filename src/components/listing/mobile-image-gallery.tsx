'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, ImageOff, X, ZoomIn } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileImageGalleryProps {
  images: string[]
  alt: string
}

import { Button } from '@/components/ui/button'

export function MobileImageGallery({ images, alt }: MobileImageGalleryProps) {
  const { t } = useTranslation(['listing'])
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index))
  }

  if (!images || images.length === 0) {
    return (
      <div className="bg-muted/50 flex aspect-4/3 items-center justify-center rounded-xl md:aspect-16/10">
        <div className="text-muted-foreground/40 text-center">
          <ImageOff className="mx-auto mb-3 h-12 w-12" />
          <p className="text-sm font-bold">{t('listing:noImage')}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3 md:space-y-6">
        {/* Main Gallery */}
        <div className="group border-border bg-card relative overflow-hidden rounded-xl border shadow-sm">
          {/* Carousel */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex touch-pan-y">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-4/3 min-w-0 flex-[0_0_100%] md:aspect-16/10"
                >
                  {!imageErrors.has(index) ? (
                    <Image
                      src={image}
                      alt={`${alt} - ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-cover"
                      priority={index === 0}
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <div className="bg-muted/50 flex h-full w-full items-center justify-center">
                      <ImageOff className="text-muted-foreground/40 h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Desktop only */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollPrev}
                className="absolute top-1/2 left-4 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-black/70 md:flex"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollNext}
                className="absolute top-1/2 right-4 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-black/70 md:flex"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Fullscreen Button - Desktop only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFullscreen(true)}
            className="bg-background/80 border-border text-foreground hover:bg-background/90 absolute right-4 bottom-4 z-10 hidden h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all hover:scale-110 md:flex"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-6">
              {images.map((_, index) => (
                <Button
                  variant="ghost"
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={cn(
                    'h-2 min-w-0 rounded-full p-0 transition-all hover:bg-white/70',
                    selectedIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  )}
                />
              ))}
            </div>
          )}

          {/* Image Counter - Mobile */}
          {images.length > 1 && (
            <div className="bg-background/80 border-border text-foreground absolute top-4 left-4 rounded-full border px-3 py-1.5 text-xs font-bold md:hidden">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails - Desktop only */}
        {images.length > 1 && (
          <div className="hidden gap-3 overflow-x-auto pb-2 md:flex">
            {images.map((image, index) => (
              <Button
                variant="ghost"
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 p-0 transition-all hover:opacity-100 lg:h-24 lg:w-24',
                  selectedIndex === index
                    ? 'border-primary scale-105 opacity-100 shadow-lg'
                    : 'border-transparent opacity-60'
                )}
              >
                {!imageErrors.has(index) ? (
                  <Image
                    src={image}
                    alt={`${alt} thumbnail ${index + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-muted flex h-full w-full items-center justify-center">
                    <ImageOff className="text-muted-foreground/40 h-4 w-4" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="relative h-full w-full">
              {images[selectedIndex] && !imageErrors.has(selectedIndex) && (
                <Image
                  src={images[selectedIndex]}
                  alt={alt}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={scrollPrev}
                  className="absolute top-1/2 left-4 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={scrollNext}
                  className="absolute top-1/2 right-4 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Fullscreen Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {images.map((_, index) => (
                  <Button
                    variant="ghost"
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={cn(
                      'h-3 min-w-0 rounded-full p-0 transition-all hover:bg-white/70',
                      selectedIndex === index
                        ? 'w-8 bg-white'
                        : 'w-3 bg-white/50'
                    )}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
