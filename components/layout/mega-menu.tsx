'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { NAV_LINKS } from '@/lib/constants/nav-links'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface MegaMenuProps {
    isOpen: boolean
    onClose: () => void
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    const { t, locale } = useTranslation(['categories', 'home', 'common', 'nav'])

    // Select the main 8 categories for the mega menu grid
    const mainCategories = NAV_LINKS.categories.slice(0, 8)

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
                        className="fixed inset-0 z-40 bg-black/20"
                    />

                    {/* Menu Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute inset-x-0 top-16 z-50 border-b border-border bg-background shadow-lg"
                        onMouseLeave={onClose}
                    >
                        <Container className="py-12">
                            <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
                                {/* Categories Grid - 4 Columns */}
                                <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                                    {mainCategories.map((category) => {
                                        const Icon = category.icon
                                        return (
                                            <div key={category.id} className="space-y-5">
                                                <Link
                                                    href={`/${locale}/categories/${category.id}`}
                                                    onClick={onClose}
                                                    className="group flex items-center gap-3 transition-all"
                                                >
                                                    <div className={cn(
                                                        "flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md ring-1 ring-white/10 transition-transform group-hover:scale-110 group-hover:rotate-3",
                                                        category.color
                                                    )}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h3 className="text-sm font-bold tracking-tight uppercase leading-none">
                                                            {t(category.label)}
                                                        </h3>
                                                        <span className="text-[10px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-widest group-hover:text-primary transition-colors">
                                                            Explore {t(category.label)}
                                                        </span>
                                                    </div>
                                                </Link>

                                                <ul className="space-y-2.5">
                                                    {category.popularSubcategories?.map((sub) => (
                                                        <li key={sub}>
                                                            <Link
                                                                href={`/${locale}/categories/${category.id}/${sub}`}
                                                                onClick={onClose}
                                                                className="text-xs font-bold text-muted-foreground/70 transition-all hover:text-primary hover:translate-x-1 flex items-center gap-2"
                                                            >
                                                                <span className="h-1 w-1 rounded-full bg-border" />
                                                                {t(sub)}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                    <li>
                                                        <Link
                                                            href={`/${locale}/categories/${category.id}`}
                                                            onClick={onClose}
                                                            className="text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary mt-2 inline-block transition-colors"
                                                        >
                                                            {t('common:viewAll')} →
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Promotional Side Rail */}
                                <div className="lg:col-span-1 space-y-8 border-l border-border/60 pl-10 hidden lg:block">
                                    <div className="relative overflow-hidden rounded-2xl bg-muted/50 dark:bg-slate-950 p-6 text-foreground dark:text-white border border-border/50 dark:border-white/10 group shadow-xl">
                                        <div className="relative z-10 space-y-4">
                                            <Badge className="bg-primary/20 text-primary border-primary/20 text-[9px] font-bold tracking-widest uppercase rounded-sm h-5">
                                                {t('common:featured')}
                                            </Badge>
                                            <h4 className="text-base font-bold tracking-tight leading-tight">
                                                {t('home:promo.title') || 'READY TO SELL FAST?'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground dark:text-slate-400 leading-relaxed font-medium">
                                                {t('home:promo.subtitle') || 'Upgrade to VIP and get 10x more views today.'}
                                            </p>
                                            <Button asChild size="sm" className="w-full font-bold uppercase tracking-widest text-[9px] h-9 rounded-xl bg-primary hover:bg-primary/90 border-0 group-hover:scale-[1.02] transition-transform">
                                                <Link href={`/${locale}/post`}>
                                                    {t('nav:postAd')}
                                                </Link>
                                            </Button>
                                        </div>
                                        {/* Glow effect */}
                                        <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-primary/20 blur-[50px] group-hover:bg-primary/30 transition-colors" />
                                    </div>

                                    <div className="space-y-5">
                                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 text-center">
                                            {t('home:popularNow') || 'POPULAR REGIONS'}
                                        </h5>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['bratislava', 'kosice', 'zilina', 'nitra'].map((cityKey) => (
                                                <Link
                                                    key={cityKey}
                                                    href={`/${locale}/listings?location=${cityKey}`}
                                                    onClick={onClose}
                                                    className="text-[9px] font-bold uppercase tracking-widest text-center px-2 py-2 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all"
                                                >
                                                    {t(`home:regions.${cityKey}`)}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Footer Action */}
                            <div className="mt-12 flex items-center justify-between border-t border-border/40 pt-8">
                                <div className="flex items-center gap-6">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Total: <span className="text-foreground">45,678 listings</span> online
                                    </p>
                                </div>
                                <Link
                                    href={`/${locale}/categories`}
                                    onClick={onClose}
                                    className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary transition-all hover:opacity-80"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                    {t('home:megaMenu.viewAll') || 'VIEW ALL CATEGORIES'}
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
