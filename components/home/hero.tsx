'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import { useRouter } from 'next/navigation'
import { useListingSearch } from '@/lib/hooks/use-listing-search'
import { cn } from '@/lib/utils'

export function Hero() {
  const { t, locale } = useTranslation(['home', 'common'])
  const router = useRouter()
  const { query, setQuery, results, isSearching } = useListingSearch()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const popularSearches = (t('home:popularSearches.items', {
    returnObjects: true,
  }) || []) as string[]

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/${locale}/listings?search=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <section className="bg-mesh relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-32 lg:pt-36 lg:pb-48">
      {/* Aurora Background Glows - PRO MAX */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute -top-[20%] -left-[10%] h-[800px] w-[800px] animate-pulse rounded-full blur-[120px]" />
        <div className="bg-primary/5 absolute top-[10%] -right-[15%] h-[600px] w-[600px] rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="badge-pill border-primary/20 bg-primary/5 text-primary px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              {t('heroTagline')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-heading text-foreground mb-6 text-5xl leading-tight font-extrabold tracking-tight sm:text-6xl md:mb-8 md:text-7xl lg:text-8xl"
          >
            {t('heroTitleMain')} <br className="hidden sm:block" />
            <span className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mx-auto mb-10 max-w-2xl px-4 text-lg leading-relaxed font-medium sm:px-0 md:mb-14 md:text-xl lg:text-2xl"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-3xl px-2 sm:px-0"
          >
            <div className="group relative">
              {/* Dynamic Search Box - Pro Max Glass */}
              <div className="bg-primary/20 absolute -inset-1 rounded-[2.5rem] opacity-0 blur-2xl transition duration-1000 group-focus-within:opacity-60 group-hover:opacity-40" />

              <div
                className={cn(
                  'bg-card border-border shadow-card relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border p-2 transition-all duration-500 sm:flex-row sm:items-center md:rounded-4xl',
                  isOpen ? 'border-primary/50 shadow-2xl' : 'hover:border-primary/30'
                )}
              >
                <div className="flex w-full items-center px-4 py-1 sm:flex-1 sm:py-2 sm:pl-6">
                  <Search
                    className={cn(
                      'h-5 w-5 shrink-0 transition-all duration-500 md:h-6 md:w-6',
                      isOpen
                        ? 'text-primary scale-110'
                        : 'text-muted-foreground group-hover:text-primary/70'
                    )}
                    aria-hidden="true"
                  />
                  <Input
                    id="hero-search"
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={t('searchPlaceholder')}
                    className="placeholder:text-muted-foreground text-foreground h-14 w-full border-none bg-transparent px-3 py-3 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-auto sm:py-4 md:px-4 md:text-xl"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch()
                      if (e.key === 'Escape') setIsOpen(false)
                    }}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-14 rounded-2xl px-10 text-lg font-bold shadow-md active:scale-95 sm:w-auto"
                >
                  {t('common:search')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Live Search Results Dropsdown */}
              <AnimatePresence>
                {isOpen && (query.length >= 2 || isSearching) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="border-primary/20 bg-background/95 absolute top-full left-0 z-50 mt-4 w-full overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
                  >
                    <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
                      {isSearching ? (
                        <div className="flex flex-col items-center justify-center py-10">
                          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                          <p className="text-muted-foreground mt-4 text-sm font-medium">
                            {t('common:searching')}...
                          </p>
                        </div>
                      ) : results.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-muted-foreground mb-3 flex items-center gap-2 px-3 text-[10px] font-bold tracking-[0.2em] uppercase">
                            <TrendingUp className="h-3 w-3" />
                            {t('common:searchResults')}
                          </div>
                          {results.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                router.push(`/${locale}/listings/${item.id}`)
                                setIsOpen(false)
                              }}
                              className="hover:bg-primary/5 group flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-all active:scale-[0.98]"
                            >
                              <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                                {item.images?.[0] ? (
                                  <Image
                                    src={item.images[0]}
                                    alt={item.title || ''}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Search className="text-muted-foreground h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <h4 className="text-foreground line-clamp-1 font-bold transition-colors group-hover:text-primary">
                                  {item.title}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <p className="text-primary text-sm font-extrabold">
                                    {item.price?.toLocaleString()} €
                                  </p>
                                  <span className="text-muted-foreground text-[10px]">•</span>
                                  <p className="text-muted-foreground truncate text-xs font-medium">
                                    {item.category?.name || t('common:others')}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="text-primary hidden h-4 w-4 opacity-0 transition-all -translate-x-2 group-hover:block group-hover:opacity-100 group-hover:translate-x-0" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-10 text-center">
                          <p className="text-muted-foreground text-sm font-medium">
                            {t('common:noResultsFound')} &quot;{query}&quot;
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 px-2"
          >
            <span className="mb-2 w-full text-center text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase sm:mr-4 sm:mb-0 sm:w-auto">
              {t('home:popularSearches.title')}
            </span>
            <div className="flex max-w-full flex-wrap items-center justify-center gap-3">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term)
                    router.push(
                      `/${locale}/listings?search=${encodeURIComponent(term)}`
                    )
                  }}
                  className="bg-primary/5 border-primary/10 hover:border-primary/30 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full border px-6 py-2 text-sm font-bold transition-all hover:shadow-lg active:scale-95"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
