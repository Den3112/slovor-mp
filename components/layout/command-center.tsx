'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Clock, TrendingUp, X, Car, Home, Smartphone, Briefcase, Zap } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { useRouter } from 'next/navigation'
import { NAV_LINKS } from '@/lib/constants/nav-links'

import { useListingSearch } from '@/lib/hooks/use-listing-search'

interface CommandCenterProps {
    locale: string
    onClose?: () => void
}

export function CommandCenter({ locale, onClose }: CommandCenterProps) {
    const { t } = useTranslation('common')
    const router = useRouter()

    // Use shared search hook
    const { query, setQuery, results, isSearching } = useListingSearch()

    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Quick categories for the search overlay
    const quickCategories = NAV_LINKS.categories.slice(0, 4)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/${locale}/listings?q=${encodeURIComponent(query)}`)
            setIsOpen(false)
            onClose?.()
        }
    }

    // Keyboard shortcut (⌘K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(true)
                // Use a small timeout to ensure input is rendered before focusing
                setTimeout(() => {
                    const input = containerRef.current?.querySelector('input')
                    input?.focus()
                }, 10)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                onClose?.()
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    return (
        <div className="relative w-full max-w-2xl" ref={containerRef}>
            <form
                onSubmit={handleSearch}
                className={cn(
                    "relative flex items-center overflow-hidden rounded-2xl border transition-all duration-300",
                    isOpen
                        ? "border-primary/50 bg-background shadow-2xl ring-4 ring-primary/10"
                        : "border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border/60"
                )}
            >
                <Search className={cn(
                    "ml-4 h-5 w-5 transition-colors",
                    isOpen ? "text-primary" : "text-muted-foreground"
                )} />
                <input
                    type="text"
                    placeholder={t('common.searchPlaceholder')}
                    className="w-full bg-transparent px-3 py-3.5 text-sm font-medium focus:outline-hidden"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="text-muted-foreground hover:text-foreground mr-3 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                <div className="mr-4 hidden items-center gap-1.5 md:flex">
                    <kbd className="bg-muted pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </form>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="border-border/40 bg-background/95 absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
                    >
                        <div className="p-4">
                            {/* Popular Categories */}
                            <div className="mb-6">
                                <div className="mb-3 flex items-center gap-2 px-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                    <TrendingUp className="h-3 w-3" />
                                    {t('common.marketTrends')}
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {quickCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                router.push(`/${locale}${cat.href}`)
                                                setIsOpen(false)
                                            }}
                                            className="hover:bg-muted flex flex-col items-center gap-2 rounded-xl border border-border/40 p-3 transition-all hover:scale-105"
                                        >
                                            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-white", cat.color)}>
                                                <cat.icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-center text-[11px] font-bold">
                                                {t(cat.label)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Search Results or Quick/Mock Suggestions */}
                            <div className="space-y-1">
                                {isSearching ? (
                                    <div className="py-8 text-center">
                                        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <p className="mt-2 text-xs text-muted-foreground">{t('common.loading')}</p>
                                    </div>
                                ) : query.length >= 2 ? (
                                    // Real results
                                    <>
                                        <div className="mb-2 px-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                            {t('common.searchResultsFor')} &quot;{query}&quot;
                                        </div>
                                        {results.length > 0 ? results.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    router.push(`/${locale}/listings/${item.id}`)
                                                    setIsOpen(false)
                                                    onClose?.()
                                                }}
                                                className="hover:bg-muted group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors text-left"
                                            >
                                                {item.images?.[0] ? (
                                                    <div className="relative h-8 w-8 overflow-hidden rounded-md bg-muted">
                                                        <Image
                                                            src={item.images[0]}
                                                            alt={item.title || 'Listing'}
                                                            fill
                                                            sizes="32px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                                                        <Search className="h-4 w-4 text-primary" />
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="block text-sm font-medium line-clamp-1">{item.title}</span>
                                                    <span className="block text-xs font-bold text-primary">{item.price} {item.currency}</span>
                                                </div>
                                                <Zap className="text-primary ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        )) : (
                                            <div className="py-4 text-center text-sm text-muted-foreground">
                                                {t('common.noResults')}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    // Default suggestions
                                    <>
                                        <div className="mb-2 px-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                            {t('common.quickSuggestions')}
                                        </div>
                                        {[
                                            { label: "iPhone 15 Pro Max", icon: Smartphone },
                                            { label: "BMW M5 2023", icon: Car },
                                            { label: "Apartment in Bratislava", icon: Home },
                                            { label: "Remote React Developer", icon: Briefcase },
                                        ].map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setQuery(item.label)
                                                    // Trigger search effect automatically via state change
                                                }}
                                                className="hover:bg-muted group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
                                            >
                                                <Clock className="text-muted-foreground group-hover:text-primary h-4 w-4" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                                <Zap className="text-primary ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-muted/50 flex items-center justify-between border-t border-border/40 px-4 py-3">
                            <span className="text-[10px] font-medium text-muted-foreground">
                                Tip: Use filters to narrow down your search
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-primary text-[10px] font-bold hover:underline"
                            >
                                {t('common.advancedSearch')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
