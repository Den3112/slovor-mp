'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { searchSlovakCities, isValidSlovakLocation } from '@/lib/constants/slovak-cities'
import type { SlovakCity } from '@/lib/constants/slovak-cities'
import { motion, AnimatePresence } from 'framer-motion'

interface LocationComboboxProps {
    value: string
    onChange: (value: string) => void
    error?: string
    placeholder?: string
    className?: string
}

export function LocationCombobox({
    value,
    onChange,
    error,
    placeholder = 'Select city...',
    className,
}: LocationComboboxProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState(value)
    const [suggestions, setSuggestions] = useState<SlovakCity[]>([])
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Update search query when value changes externally
    useEffect(() => {
        setSearchQuery(value)
    }, [value])

    // Search for cities when query changes
    useEffect(() => {
        if (isOpen && searchQuery.length >= 2) {
            const results = searchSlovakCities(searchQuery, 8)
            setSuggestions(results)
            setHighlightedIndex(-1)
        } else {
            setSuggestions([])
        }
    }, [searchQuery, isOpen])

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false)
                // Reset to original value if user didn't select
                if (!isValidSlovakLocation(searchQuery)) {
                    setSearchQuery(value)
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [searchQuery, value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        if (!isOpen) setIsOpen(true)
    }

    const handleSelectCity = (city: SlovakCity) => {
        onChange(city.nameSk)
        setSearchQuery(city.nameSk)
        setIsOpen(false)
        setHighlightedIndex(-1)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true)
                e.preventDefault()
            }
            return
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setHighlightedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
                break
            case 'Enter':
                e.preventDefault()
                if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                    handleSelectCity(suggestions[highlightedIndex])
                }
                break
            case 'Escape':
                setIsOpen(false)
                setSearchQuery(value)
                break
        }
    }

    const isValid = value && isValidSlovakLocation(value)

    return (
        <div className={cn('relative', className)}>
            {/* Input */}
            <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        'h-14 w-full rounded-2xl border bg-white/5 pl-14 pr-12 font-medium outline-none transition-all placeholder:text-muted-foreground/30',
                        'focus:border-primary focus:bg-white/10 focus:ring-4 focus:ring-primary/10',
                        error
                            ? 'border-destructive/50 bg-destructive/5'
                            : 'border-white/10 hover:border-white/20',
                        isValid && 'border-emerald-500/50 bg-emerald-500/5'
                    )}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ChevronDown
                        className={cn(
                            'h-5 w-5 transition-transform duration-200',
                            isOpen && 'rotate-180'
                        )}
                    />
                </button>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && suggestions.length > 0 && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="max-h-64 overflow-y-auto p-1">
                            {suggestions.map((city, index) => (
                                <button
                                    key={`${city.nameSk}-${city.district}`}
                                    type="button"
                                    onClick={() => handleSelectCity(city)}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors',
                                        highlightedIndex === index
                                            ? 'bg-primary/10 text-foreground'
                                            : 'text-foreground/80 hover:bg-muted/50',
                                        city.nameSk === value && 'bg-primary/5'
                                    )}
                                >
                                    <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="font-medium">{city.nameSk}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {city.district}
                                        </div>
                                    </div>
                                    {city.nameSk === value && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* No results message */}
            <AnimatePresence>
                {isOpen && searchQuery.length >= 2 && suggestions.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-border/50 bg-card/95 p-4 text-center text-sm text-muted-foreground shadow-xl backdrop-blur-xl"
                    >
                        No cities found for &quot;{searchQuery}&quot;
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
