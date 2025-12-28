'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { CategoryIcon } from '@/components/category/CategoryIcon'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import { getCategoryName } from '@/lib/utils/category-helpers'

interface HomeCategoriesProps {
    categories: Category[]
}

export function HomeCategories({ categories }: HomeCategoriesProps) {
    const { t, locale } = useTranslation()

    // Take top 8 main categories
    const mainCategories = categories
        .filter(c => !c.parent_id)
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        .slice(0, 8)

    return (
        <section className="py-24 bg-card/30">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-heading italic">
                            {t.home.categoriesTitle}
                        </h2>
                        <p className="text-muted-foreground text-lg font-medium">
                            {t.home.categories.subtitle}
                        </p>
                    </div>
                    <Link
                        href="/categories"
                        className="group inline-flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-colors text-lg"
                    >
                        {t.common.viewAll} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                    {mainCategories.map((category, idx) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                        >
                            <Link
                                href={`/categories/${category.slug}`}
                                className="group relative block aspect-[4/3] md:aspect-square rounded-[2rem] bg-card border border-border/50 hover:border-primary/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                    <div className="mb-4 bg-muted/50 p-4 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-6 transition-all duration-500 group-hover:scale-110">
                                        <CategoryIcon slug={category.slug} className="w-8 h-8 md:w-10 md:h-10" />
                                    </div>
                                    <h3 className="font-black text-base md:text-lg text-foreground group-hover:text-primary transition-colors">
                                        {getCategoryName(category, locale, t)}
                                    </h3>
                                    {category.listing_count !== undefined && (
                                        <p className="mt-1 text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-primary/70 transition-colors">
                                            {category.listing_count} {t.common.listings}
                                        </p>
                                    )}
                                </div>

                                {/* Decorative Pattern */}
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
