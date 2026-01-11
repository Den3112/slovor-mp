'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCategoryIcon } from '@/lib/constants/category-icons'
import { getMainCategories } from '@/lib/supabase/categories'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { motion, AnimatePresence } from 'framer-motion'

interface CategoriesDropdownProps {
    className?: string
}

export function CategoriesDropdown({ className }: CategoriesDropdownProps) {
    const { t, locale } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Fetch categories on mount
    useEffect(() => {
        async function fetchCategories() {
            const { data } = await getMainCategories()
            if (data) setCategories(data)
        }
        fetchCategories()
    }, [])

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close on escape
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    return (
        <div ref={dropdownRef} className={cn('relative', className)}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex h-10 items-center gap-2 rounded-full px-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all',
                    isOpen
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden xl:inline">{t.common.categories}</span>
                <ChevronDown
                    className={cn('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute left-0 top-full z-50 mt-2 w-72 origin-top-left rounded-2xl border border-border/50 bg-card/95 p-2 shadow-2xl backdrop-blur-xl"
                    >
                        {/* Categories Grid */}
                        <div className="grid max-h-[400px] grid-cols-1 gap-0.5 overflow-y-auto">
                            {categories.map((category) => {
                                const Icon = getCategoryIcon(category.slug)
                                return (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-primary/10"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                                            <Icon className="h-4.5 w-4.5" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">
                                            {getLocalizedCategoryName(category, locale, t)}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* View All Link */}
                        <div className="mt-1.5 border-t border-border/50 pt-1.5">
                            <Link
                                href="/categories"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/10"
                            >
                                {t.common.viewAll || 'View All'}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
