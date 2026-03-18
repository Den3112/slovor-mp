'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search,
  TrendingUp,
  X,
  Car,
  Home,
  Smartphone,
  Briefcase,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NAV_LINKS } from '@/lib/constants/nav-links'
import { trackEvent } from '@/lib/utils/analytics'

import { useListingSearch } from '@/lib/hooks/use-listing-search'

interface CommandCenterProps {
  locale: string
  onClose?: () => void
}

export function CommandCenter({ locale, onClose }: CommandCenterProps) {
  const { t } = useTranslation(['common', 'nav'])
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
      trackEvent('search_performed', { query: query.trim() })
      router.push(`/${locale}/listings?search=${encodeURIComponent(query)}`)
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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
          'relative flex items-center overflow-hidden rounded-2xl border transition-all duration-300',
          isOpen
            ? 'border-primary/50 bg-background ring-primary/10 shadow-lg ring-4'
            : 'border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-border/60'
        )}
      >
        <Search
          className={cn(
            'ml-4 h-5 w-5 transition-colors',
            isOpen ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <input
          type="text"
          placeholder={t('common:searchPlaceholder')}
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
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
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
            className="border-primary/20 bg-background absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border-2 shadow-xl ring-1 ring-black/5"
          >
            <div className="p-4">
              {/* Popular Categories */}
              <div className="mb-6">
                <div className="text-muted-foreground mb-3 flex items-center gap-2 px-2 text-[10px] font-bold tracking-widest uppercase">
                  <TrendingUp className="h-3 w-3" />
                  {t('common:marketTrends')}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {quickCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/${locale}${cat.href}`}
                      onClick={() => {
                        setIsOpen(false)
                        onClose?.()
                      }}
                      className="hover:bg-muted border-border/40 flex flex-col items-center gap-2 rounded-xl border p-3 transition-all hover:scale-105 active:scale-95"
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl text-white',
                          cat.color
                        )}
                      >
                        <cat.icon className="h-5 w-5" />
                      </div>
                      <span className="line-clamp-1 w-full px-1 text-center text-[10px] font-bold sm:text-[11px]">
                        {t(cat.label)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              {/* Search Results or Quick/Mock Suggestions */}
              <div className="space-y-1">
                {isSearching ? (
                  <div className="py-8 text-center">
                    <div className="border-primary mx-auto h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                    <p className="text-muted-foreground mt-2 text-xs">
                      {t('common:loading')}
                    </p>
                  </div>
                ) : query.length >= 2 ? (
                  // Real results
                  <>
                    <div className="text-muted-foreground mb-2 px-2 text-[10px] font-bold tracking-widest uppercase">
                      {t('common:searchResultsFor')} &quot;{query}&quot;
                    </div>
                    {results.length > 0 ? (
                      results.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            router.push(`/${locale}/listings/${item.id}`)
                            setIsOpen(false)
                            onClose?.()
                          }}
                          className="hover:bg-muted group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all active:scale-95"
                        >
                          {item.images?.[0] ? (
                            <div className="bg-muted relative h-8 w-8 overflow-hidden rounded-md">
                              <Image
                                src={item.images[0]}
                                alt={item.title || 'Listing'}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                              <Search className="text-primary h-4 w-4" />
                            </div>
                          )}
                          <div>
                            <span className="line-clamp-1 block text-sm font-medium">
                              {item.title}
                            </span>
                            <span className="text-primary block text-xs font-bold">
                              {item.price} {item.currency}
                            </span>
                          </div>
                          <Zap className="text-primary ml-auto h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      ))
                    ) : (
                      <div className="text-muted-foreground py-4 text-center text-sm">
                        {(() => {
                          trackEvent('search_results_empty', { query })
                          return t('common:noResults')
                        })()}
                      </div>
                    )}
                  </>
                ) : (
                  // Default suggestions
                  <>
                    <div className="text-muted-foreground mb-2 px-2 text-[10px] font-bold tracking-widest uppercase">
                      {t('common:quickSuggestions.title')}
                    </div>
                    {(
                      t('common:quickSuggestions.items', {
                        returnObjects: true,
                      }) || []
                    ).map((label: string, idx: number) => {
                      const icons: LucideIcon[] = [
                        Smartphone,
                        Car,
                        Home,
                        Briefcase,
                      ]
                      const Icon = icons[idx % icons.length] as LucideIcon
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setQuery(label)
                          }}
                          className="hover:bg-muted group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all active:scale-95"
                        >
                          <Icon className="text-muted-foreground group-hover:text-primary h-4 w-4" />
                          <span className="text-sm font-medium">{label}</span>
                          <Zap className="text-primary ml-auto h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      )
                    })}
                  </>
                )}
              </div>
            </div>

            <div className="bg-muted/50 border-border/40 flex items-center justify-between border-t px-4 py-3">
              <span className="text-muted-foreground text-[10px] font-medium">
                {t('common:searchTip')}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary text-[10px] font-bold hover:underline"
              >
                {t('common:advancedSearch') || 'Advanced Search'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
