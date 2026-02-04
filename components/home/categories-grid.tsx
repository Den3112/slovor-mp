'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { CategoryIcon } from '@/components/category/category-icon'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { getLocalizedCategoryName } from '@/lib/utils/category-i18n'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface CategoriesGridProps {
    categories: Category[]
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
    const { t, i18n } = useTranslation(['home', 'common'])
    const locale = i18n.language

    // Top 10 main categories
    const mainCategories = categories
        .filter((c) => !c.parent_id)
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        .slice(0, 9)

    return (
        <section className="bg-background py-16 md:py-24">
            <Container>
                <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        <h2 className="font-heading mb-4 text-4xl font-black tracking-tight italic md:text-5xl">
                            {t('home:categoriesGrid')}
                        </h2>
                        <p className="text-muted-foreground text-lg font-medium opacity-70">
                            {t('home:categoriesSubtitle')}
                        </p>
                    </div>
                    <Link
                        href="/categories"
                        className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-all hover:opacity-80"
                    >
                        {t('common:viewAll')}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {mainCategories.map((category, idx) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                        >
                            <Link
                                href={`/categories/${category.slug}`}
                                className="group flex flex-col items-center justify-center gap-6 rounded-2xl border border-border/60 bg-card p-8 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98]"
                            >
                                <div className={cn(
                                    "flex h-20 w-20 items-center justify-center rounded-4xl transition-all duration-300 group-hover:rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground shadow-sm ring-4 ring-muted/50",
                                    category.color || "bg-muted"
                                )}>
                                    <CategoryIcon
                                        slug={category.slug}
                                        className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="space-y-1.5 px-2">
                                    <h3 className="text-sm font-black tracking-tight uppercase group-hover:text-primary transition-colors">
                                        {getLocalizedCategoryName(category, locale, t)}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2">
                                        <Badge variant="secondary" className="bg-muted text-[10px] font-black tracking-widest uppercase border-0 h-5 px-2">
                                            {category.listing_count || 0}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                            Ads
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {/* "View All" Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Link
                            href="/categories"
                            className="group flex flex-col items-center justify-center gap-6 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/10 active:scale-[0.98]"
                        >
                            <div className="flex h-20 w-20 items-center justify-center rounded-4xl bg-primary text-white transition-all duration-300 group-hover:rounded-2xl shadow-lg shadow-primary/20">
                                <LayoutGrid className="h-10 w-10" />
                            </div>
                            <div className="space-y-1.5 px-2">
                                <h3 className="text-sm font-black tracking-tight uppercase text-primary">
                                    {t('common:viewAll')}
                                </h3>
                                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">
                                    +20 {t('home:categoriesGrid')}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </Container>
        </section>
    )
}
