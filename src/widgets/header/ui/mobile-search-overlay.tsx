'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/shared/lib/i18n'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { NAV_LINKS } from '@/shared/lib/constants/nav-links'

import { useListingSearch } from '@/shared/hooks'

interface MobileSearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSearchOverlay({
  isOpen,
  onClose,
}: MobileSearchOverlayProps) {
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const { filters, updateFilter, listings, isLoading } = useListingSearch()
  const query = filters.query
  const setQuery = (q: string) => updateFilter({ query: q })

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      router.push(`/${locale}/listings?q=${encodeURIComponent(query)}`)
      onClose()
    }
  }

  // Prevent body scroll when open and focus input
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Small delay to ensure animation has started or is near completion
      timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      if (timer) clearTimeout(timer)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-background fixed inset-0 z-9999"
        >
          <div className="safe-top flex h-full flex-col">
            {/* Header */}
            <div className="border-border flex items-center gap-3 border-b p-4">
              <div className="bg-muted flex flex-1 items-center rounded-xl px-3 py-2">
                <Search className="text-muted-foreground h-5 w-5" />
                <form onSubmit={handleSearch} className="flex-1">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={t('common:searchPlaceholder')}
                    className="h-auto w-full border-none bg-transparent px-3 py-1 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </form>
                {query && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 hover:bg-transparent"
                    onClick={() => setQuery('')}
                  >
                    <X className="text-muted-foreground h-5 w-5" />
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-primary h-auto px-2 text-sm font-bold hover:bg-transparent"
              >
                {t('common:cancel')}
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Recent Searches / Trends */}
              {!query && (
                <div className="space-y-8">
                  <section>
                    <h3 className="text-muted-foreground mb-4 text-[10px] font-bold tracking-widest uppercase">
                      {t('common:marketTrends')}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {NAV_LINKS.categories.slice(0, 4).map((cat) => (
                        <Button
                          variant="ghost"
                          key={cat.id}
                          onClick={() => {
                            router.push(`/${locale}${cat.href}`)
                            onClose()
                          }}
                          className="border-border transition-active hover:bg-accent hover:text-accent-foreground flex h-auto w-full items-center justify-start gap-3 rounded-xl border p-3 text-left active:scale-95"
                        >
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-xl text-white',
                              cat.color
                            )}
                          >
                            <cat.icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-bold">
                            {t(cat.label)}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-muted-foreground mb-4 text-[10px] font-bold tracking-widest uppercase">
                      {t('common:quickSuggestions')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'iPhone',
                        'BMW',
                        'Apartment',
                        'Kitchen',
                        'Table',
                        'Jobs',
                      ].map((tag) => (
                        <Button
                          variant="ghost"
                          key={tag}
                          onClick={() => {
                            setQuery(tag)
                            // Optionally trigger search immediately
                          }}
                          className="bg-muted hover:bg-muted/80 h-auto rounded-full px-4 py-2 text-sm font-medium transition-colors active:scale-95"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {/* Live results could go here */}
              {query && (
                <div className="space-y-4">
                  <div className="text-muted-foreground flex items-center gap-3">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">
                      {t('common:searchingFor')} &quot;{query}&quot;...
                    </span>
                  </div>
                  {/* Real live results */}
                  {isLoading ? (
                    <div className="flex items-center gap-2 py-4">
                      <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      <span className="text-muted-foreground text-sm">
                        {t('common:loading')}
                      </span>
                    </div>
                  ) : listings.length > 0 ? (
                    listings.map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.id) {
                            router.push(`/${locale}/listings/${item.id}`)
                            onClose()
                          }
                        }}
                        className="border-border active:bg-muted/50 flex cursor-pointer items-center justify-between border-b py-3"
                      >
                        <div className="flex items-center gap-3">
                          {item.images?.[0] ? (
                            <div className="bg-muted relative h-10 w-10 overflow-hidden rounded-md">
                              <Image
                                src={item.images[0]}
                                alt={item.title || 'Listing'}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-md">
                              <Search className="text-primary h-4 w-4" />
                            </div>
                          )}
                          <div>
                            <p className="line-clamp-1 text-sm font-bold">
                              {item.title}
                            </p>
                            <p className="text-primary text-xs font-medium">
                              {item.price} {item.currency}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="text-muted-foreground h-4 w-4" />
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground py-4 text-sm">
                      {t('common:noResults')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
