'use client'

import { Hero } from './Hero'
import { HomeCategories } from './HomeCategories'
import { Features } from './Features'
import { HomeCTA } from './HomeCTA'
import { Flame, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface HomeViewProps {
    categories: Category[]
    categoriesError: string | null
    children?: React.ReactNode
}

export function HomeView({
    categories,
    categoriesError,
    children
}: HomeViewProps) {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col overflow-x-hidden">
            <Hero />

            {!categoriesError ? (
                <HomeCategories categories={categories} />
            ) : (
                <Container className="py-20">
                    <div className="p-12 bg-destructive/5 text-destructive rounded-[2rem] border border-destructive/10 text-center font-bold">
                        {categoriesError}
                    </div>
                </Container>
            )}

            {/* Featured Listings Section */}
            <section className="py-24 border-y border-border/40 bg-muted/20">
                <Container>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-black tracking-widest uppercase mb-4">
                                <Flame className="w-3.5 h-3.5 fill-orange-600/20" />
                                Trending Now
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-heading italic">
                                {t.home.featuredListings}
                            </h2>
                            <p className="text-muted-foreground text-lg font-medium">
                                Hand-picked selection of premium items recently published.
                            </p>
                        </div>
                        <Link
                            href="/listings"
                            className="group inline-flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-colors text-lg"
                        >
                            Explore All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        {children}
                    </motion.div>
                </Container>
            </section>

            <Features />

            <HomeCTA />
        </div>
    )
}
