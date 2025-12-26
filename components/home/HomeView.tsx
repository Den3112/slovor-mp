'use client'

import { CategoryGrid } from '@/components/category/grid'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Flame, ShieldCheck, Zap, Banknote, Map, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    const [searchTerm, setSearchTerm] = useState('')

    const popularSearches = ['iPhone', 'BMW', 'Byt', 'Kočík', 'Gauč', 'PS5']

    return (
        <div className="flex flex-col gap-16 pb-16 overflow-x-hidden bg-background">
            {/* Hero Section */}
            <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Structure */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-background" />
                    <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
                </div>

                <div className="container mx-auto max-w-5xl px-4 relative z-10 text-center pt-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider uppercase mb-6 border border-primary/20 animate-in fade-in slide-in-from-bottom-3 duration-500">
                        Slovakia&apos;s #1 Marketplace
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter text-foreground leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {t.home.heroTitle}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-900">
                        {t.home.heroSubtitle}
                    </p>

                    <div className="relative max-w-2xl mx-auto group animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-violet-500 to-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                        <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-2 shadow-2xl">
                            <Search className="text-muted-foreground ml-4 h-6 w-6 shrink-0" />
                            <input
                                type="text"
                                placeholder={t.home.searchPlaceholder}
                                className="w-full py-4 px-4 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none font-medium text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button
                                asChild
                                size="lg"
                                className="h-14 px-8 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
                            >
                                <Link href={`/listings?search=${searchTerm}`}>
                                    {t.common.search}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                        <span className="text-sm font-medium text-muted-foreground flex items-center uppercase tracking-wider text-xs mr-2">{t.home.popularSearches}:</span>
                        {popularSearches.map(term => (
                            <Link
                                key={term}
                                href={`/listings?search=${term}`}
                                className="px-4 py-1.5 text-sm font-medium bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all border border-transparent hover:border-border"
                            >
                                {term}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3 tracking-tight font-heading">
                            {t.home.categoriesTitle}
                        </h2>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                    </div>
                    <Link href="/listings" className="group text-primary font-bold hover:text-primary/80 transition flex items-center gap-2 text-lg">
                        {t.common.viewAll} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {categoriesError ? (
                    <div className="p-8 bg-destructive/10 text-destructive rounded-3xl border border-destructive/20 text-center font-bold">
                        {categoriesError}
                    </div>
                ) : (
                    <CategoryGrid categories={categories} />
                )}
            </section>

            {/* Featured Listings Section */}
            <section className="py-20 bg-muted/30 border-y border-border/50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 px-3 py-1 bg-primary/10 rounded-full">Top Picks</span>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 flex items-center gap-3 font-heading tracking-tight">
                            <Flame className="w-10 h-10 text-orange-500 fill-orange-500/20" /> {t.home.featuredListings}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl text-lg">
                            Curated selection of premium items available near you.
                        </p>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        {children}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <ShieldCheck className="w-8 h-8 text-primary" />, title: t.trust.secure, desc: 'Verified users & payments' },
                        { icon: <Zap className="w-8 h-8 text-yellow-500" />, title: t.trust.fast, desc: 'Post in 2 minutes' },
                        { icon: <Banknote className="w-8 h-8 text-emerald-500" />, title: t.trust.free, desc: 'No hidden fees' },
                        { icon: <Map className="w-8 h-8 text-blue-500" />, title: t.trust.local, desc: '100% Slovak marketplace' }
                    ].map((badge, idx) => (
                        <div key={idx} className="bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all group">
                            <div className="mb-4 bg-muted/50 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                {badge.icon}
                            </div>
                            <h3 className="font-bold text-lg text-foreground mb-1">{badge.title}</h3>
                            <p className="text-muted-foreground text-sm font-medium">{badge.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 mb-20">
                <div className="bg-foreground rounded-[2.5rem] p-12 md:p-24 text-center text-background relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-500/20 rounded-full blur-[100px]" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight font-heading">
                            {t.home.ctaTitle}
                        </h2>
                        <p className="text-background/70 text-xl font-medium max-w-xl mx-auto">
                            {t.home.ctaSubtitle}
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="h-16 px-12 rounded-full text-lg font-bold bg-background text-foreground hover:bg-muted transition-all hover:scale-105 shadow-xl"
                        >
                            <Link href="/post">
                                {t.common.postAd}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
