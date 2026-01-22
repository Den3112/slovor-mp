'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, ImageOff, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileImageGalleryProps {
    images: string[]
    alt: string
}

export function MobileImageGallery({ images, alt }: MobileImageGalleryProps) {
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
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-muted/50 md:aspect-[16/10] md:rounded-[3rem]">
                <div className="text-center text-muted-foreground/40">
                    <ImageOff className="mx-auto mb-3 h-12 w-12" />
                    <p className="text-sm font-bold">No images</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-3 md:space-y-6">
                {/* Main Gallery */}
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg md:rounded-[3rem] md:shadow-2xl md:shadow-primary/5">
                    {/* Carousel */}
                    <div ref={emblaRef} className="overflow-hidden">
                        <div className="flex touch-pan-y">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] md:aspect-[16/10]"
                                >
                                    {!imageErrors.has(index) ? (
                                        <Image
                                            src={image}
                                            alt={`${alt} - ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                            onError={() => handleImageError(index)}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-muted/50">
                                            <ImageOff className="h-12 w-12 text-muted-foreground/40" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows - Desktop only */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={scrollPrev}
                                className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/50 group-hover:opacity-100 md:flex"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={scrollNext}
                                className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/50 group-hover:opacity-100 md:flex"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    {/* Fullscreen Button - Desktop only */}
                    <button
                        onClick={() => setFullscreen(true)}
                        className="glass absolute bottom-4 right-4 z-10 hidden h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110 md:flex"
                    >
                        <ZoomIn className="h-5 w-5" />
                    </button>

                    {/* Dots Indicator */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-6">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => emblaApi?.scrollTo(index)}
                                    className={cn(
                                        "h-2 rounded-full transition-all",
                                        selectedIndex === index
                                            ? "w-6 bg-white"
                                            : "w-2 bg-white/50 hover:bg-white/70"
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    {/* Image Counter - Mobile */}
                    {images.length > 1 && (
                        <div className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-black text-foreground md:hidden">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    )}
                </div>

                {/* Thumbnails - Desktop only */}
                {images.length > 1 && (
                    <div className="hidden gap-3 overflow-x-auto pb-2 md:flex">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => emblaApi?.scrollTo(index)}
                                className={cn(
                                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all lg:h-24 lg:w-24",
                                    selectedIndex === index
                                        ? "scale-105 border-primary shadow-lg"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                {!imageErrors.has(index) ? (
                                    <Image
                                        src={image}
                                        alt={`${alt} thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted">
                                        <ImageOff className="h-4 w-4 text-muted-foreground/40" />
                                    </div>
                                )}
                            </button>
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
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
                    >
                        <button
                            onClick={() => setFullscreen(false)}
                            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                        >
                            <X className="h-6 w-6" />
                        </button>

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
                                <button
                                    onClick={scrollPrev}
                                    className="absolute left-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                                >
                                    <ChevronLeft className="h-8 w-8" />
                                </button>
                                <button
                                    onClick={scrollNext}
                                    className="absolute right-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                                >
                                    <ChevronRight className="h-8 w-8" />
                                </button>
                            </>
                        )}

                        {/* Fullscreen Dots */}
                        {images.length > 1 && (
                            <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => emblaApi?.scrollTo(index)}
                                        className={cn(
                                            "h-3 rounded-full transition-all",
                                            selectedIndex === index
                                                ? "w-8 bg-white"
                                                : "w-3 bg-white/50 hover:bg-white/70"
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
