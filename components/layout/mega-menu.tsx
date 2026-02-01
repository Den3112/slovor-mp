'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Grid3X3 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { NAV_LINKS } from '@/lib/constants/nav-links'

interface MegaMenuProps {
    locale: string
    onClose: () => void
}

export function MegaMenu({ locale, onClose }: MegaMenuProps) {
    const { t } = useTranslation(['common', 'nav', 'categories'])

    const containerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.05
            }
        },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-background/95 fixed inset-x-0 top-20 z-40 mx-auto w-[calc(100%-2rem)] max-w-7xl overflow-hidden rounded-3xl border border-border/40 shadow-2xl backdrop-blur-xl"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
                {/* Sidebar / Categories List */}
                <div className="bg-muted/30 col-span-1 border-r border-border/40 p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <Grid3X3 className="text-primary h-5 w-5" />
                        <h2 className="text-sm font-black tracking-tight uppercase">
                            {t('nav:categories')}
                        </h2>
                    </div>
                    <div className="space-y-1">
                        {NAV_LINKS.categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/${locale}${cat.href}`}
                                onClick={onClose}
                                className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all hover:bg-background hover:shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-white", cat.color)}>
                                        <cat.icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-bold group-hover:text-primary transition-colors">
                                        {t(cat.label)}
                                    </span>
                                </div>
                                <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Content Area / Subcategories */}
                <div className="col-span-3 grid gap-8 p-8 lg:col-span-4">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {NAV_LINKS.categories.slice(0, 6).map((cat) => (
                            <div key={cat.id} className="space-y-4">
                                <Link
                                    href={`/${locale}${cat.href}`}
                                    onClick={onClose}
                                    className="group flex items-center gap-2 text-sm font-black transition-colors hover:text-primary"
                                >
                                    <span className={cn("h-1.5 w-1.5 rounded-full", cat.color.replace('bg-', 'bg-'))} />
                                    {t(cat.label)}
                                    <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                </Link>
                                <div className="grid gap-2">
                                    {cat.popularSubcategories?.map((sub) => (
                                        <Link
                                            key={sub}
                                            href={`/${locale}${cat.href}/${sub}`}
                                            onClick={onClose}
                                            className="text-muted-foreground hover:text-foreground inline-flex text-xs font-medium transition-colors"
                                        >
                                            {sub.charAt(0).toUpperCase() + sub.slice(1).replace('-', ' ')}
                                        </Link>
                                    ))}
                                    <Link
                                        href={`/${locale}${cat.href}`}
                                        onClick={onClose}
                                        className="text-primary mt-1 text-[10px] font-black uppercase hover:underline"
                                    >
                                        {t('viewAll')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ad / Promo Section */}
                    <div className="border-border/40 bg-linear-to-r from-primary/5 to-violet-500/5 mt-4 flex items-center justify-between rounded-2xl border p-6">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black tracking-tight">
                                {t('exploreMarketplace')}
                            </h3>
                            <p className="text-muted-foreground text-sm font-medium">
                                {t('marketplaceSlogan')}
                            </p>
                        </div>
                        <Link
                            href={`/${locale}/post`}
                            onClick={onClose}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105"
                        >
                            {t('nav:postAd')}
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
