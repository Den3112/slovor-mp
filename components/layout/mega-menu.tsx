'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { NAV_LINKS } from '@/lib/constants/nav-links'
import { Container } from '@/components/ui/container'

interface MegaMenuProps {
    isOpen: boolean
    onClose: () => void
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    const { t, locale } = useTranslation(['categories', 'home', 'common'])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/40"
                    />

                    {/* Menu Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute inset-x-0 top-16 z-50 border-b border-border bg-background shadow-xl"
                        onMouseLeave={onClose}
                    >
                        <Container className="py-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
                                {NAV_LINKS.categories.slice(0, 10).map((category) => {
                                    const Icon = category.icon
                                    return (
                                        <div key={category.id} className="space-y-4">
                                            <Link
                                                href={`/${locale}${category.href}`}
                                                onClick={onClose}
                                                className="group flex items-center gap-3 transition-colors hover:text-primary"
                                            >
                                                <div className={cn(
                                                    "flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-white/10",
                                                    category.color
                                                )}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-sm font-bold tracking-tight uppercase">
                                                    {t(category.label)}
                                                </h3>
                                            </Link>

                                            <ul className="space-y-2.5 pl-13">
                                                {category.popularSubcategories?.map((sub) => (
                                                    <li key={sub}>
                                                        <Link
                                                            href={`/${locale}/categories/${category.id}/${sub}`}
                                                            onClick={onClose}
                                                            className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                                                        >
                                                            {t(sub)}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-10 flex items-center justify-center border-t border-border pt-6">
                                <Link
                                    href={`/${locale}/categories`}
                                    onClick={onClose}
                                    className="group inline-flex items-center gap-2 text-sm font-bold text-primary transition-opacity hover:opacity-80"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                    {t('home:megaMenu.viewAll')}
                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </Container>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
