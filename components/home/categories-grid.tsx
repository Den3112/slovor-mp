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
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                        >
                            <Link
                                href={`/categories/${category.slug}`}
                                className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl active:scale-[0.98]"
                            >
                                <div className={cn(
                                    "flex h-16 w-16 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
                                    category.color // Use category color if available, though bg-muted is safer default
                                )}>
                                    <CategoryIcon
                                        slug={category.slug}
                                        className="h-8 w-8"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold tracking-tight">
                                        {getLocalizedCategoryName(category, locale, t)}
                                    </h3>
                                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                                        {category.listing_count || 0} {t('common:listings')}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {/* "View All" Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        <Link
                            href="/categories"
                            className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-muted/40 active:scale-[0.98]"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <LayoutGrid className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold tracking-tight">
                                    {t('common:viewAll')}
                                </h3>
                                <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    +20 {t('home:megaMenu.title')}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </Container>
        </section>
    )
}
