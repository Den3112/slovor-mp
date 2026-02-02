'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, Grid3X3, ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCategoryIcon } from '@/lib/constants/category-icons'
import { getCategoriesWithCounts } from '@/lib/supabase/categories'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { motion, AnimatePresence } from 'framer-motion'

interface CategoriesDropdownProps {
  className?: string
}

export function CategoriesDropdown({ className }: CategoriesDropdownProps) {
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch categories with counts on mount
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await getCategoriesWithCounts()
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keydown for accessibility
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-10 items-center gap-2 rounded-full px-4 text-[10px] font-black tracking-widest uppercase transition-all',
          isOpen
            ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-lg'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="hidden lg:inline">{t('categories')}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* MegaMenu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="border-border/60 bg-card absolute top-full left-0 z-50 mt-4 w-[640px] origin-top-left overflow-hidden rounded-xl border shadow-xl"
          >
            <div className="flex h-full min-h-[400px]">
              {/* Left Side: Category Grid */}
              <div className="flex-1 p-6 lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-sm font-black tracking-[0.2em] text-muted-foreground uppercase">
                    {t('cat.title') || 'Marketplace Categories'}
                  </h3>
                  <Link
                    href="/categories"
                    onClick={() => setIsOpen(false)}
                    className="text-primary hover:text-primary/80 flex items-center gap-1.5 text-xs font-bold transition-colors"
                  >
                    {t('viewAll')}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {categories.slice(0, 10).map((category) => {
                    const Icon = getCategoryIcon(category.slug)
                    return (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-4 rounded-xl p-2.5 transition-all hover:bg-muted/50 active:scale-95"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground shadow-inner transition-all group-hover:bg-primary/10 group-hover:text-primary group-hover:shadow-primary/10">
                          <Icon className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                            {getLocalizedCategoryName(category, locale, t)}
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
                            {category.listings_count || category.listing_count || 0} {t('listings')}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Right Side: Featured/Actions */}
              <div className="bg-muted/30 border-border/50 w-56 border-l p-6 lg:p-8">
                <div className="space-y-8">
                  {/* Promo Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-[10px] font-black tracking-widest uppercase">
                        {t('featured')}
                      </span>
                    </div>
                    <div className="group/item relative overflow-hidden rounded-xl bg-primary/10 p-4 transition-all hover:bg-primary/20">
                      <p className="relative z-10 text-xs font-bold leading-relaxed text-foreground">
                        {t('home.heroSubtitle').split('.')[0]}
                      </p>
                      <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover/item:scale-110">
                        <TrendingUp className="h-16 w-16 rotate-12" />
                      </div>
                    </div>
                  </div>

                  {/* Hot Categories? */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                      Quick Start
                    </h4>
                    <nav className="flex flex-col gap-3">
                      <Link
                        href="/post"
                        onClick={() => setIsOpen(false)}
                        className="text-foreground hover:text-primary flex items-center gap-2 text-xs font-bold transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {t('postAd')}
                      </Link>
                      <Link
                        href="/listings?sort=newest"
                        onClick={() => setIsOpen(false)}
                        className="text-foreground hover:text-primary flex items-center gap-2 text-xs font-bold transition-colors"
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                        {t('newest')}
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-muted/10 border-border/50 border-t p-4 px-8">
              <p className="text-center text-[10px] font-medium text-muted-foreground/50">
                {t('footer.description')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Plus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
}
