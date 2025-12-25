'use client'

import { CategoryGrid } from '@/components/category/grid'
import { FeaturedListings } from '@/components/listing/featured'
import { useTranslation } from '@/lib/i18n'
import type { Category } from '@/lib/types/database'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Flame, ShieldCheck, Zap, Banknote, Map, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HomeViewProps {
    categories: Category[]
    categoriesError: string | null
}

export function HomeView({
    categories,
    categoriesError
}: HomeViewProps) {
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState('')

    const popularSearches = ['iPhone', 'BMW', 'Byt', 'Kočík', 'Gauč', 'PS5']

    return (
        <div className="flex flex-col gap-12 pb-12 overflow-x-hidden">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 text-white py-24 px-4 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>
                <div className="absolute inset-0 opacity-5 bg-[url('/grid-pattern.svg')]"></div>

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {t.home.heroTitle}
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100/90 mb-12 max-w-3xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {t.home.heroSubtitle}
                    </p>

                    <div className="glass p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="flex-1 flex items-center px-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                            <Search className="text-white/60 mr-3 h-6 w-6" />
                            <input
                                type="text"
                                placeholder={t.home.searchPlaceholder}
                                className="w-full py-5 bg-transparent text-white placeholder-white/50 focus:outline-none font-semibold text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button
                            asChild
                            size="lg"
                            className="bg-white hover:bg-blue-50 text-blue-900 font-bold py-7 px-10 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.97]"
                        >
                            <Link href={`/listings?search=${searchTerm}`}>
                                {t.common.search}
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm font-medium text-blue-100/60">
                        <span className="opacity-80 uppercase tracking-widest text-xs font-bold pt-1">{t.home.popularSearches}:</span>
                        {popularSearches.map(term => (
                            <Link
                                key={term}
                                href={`/listings?search=${term}`}
                                className="px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm border border-white/10"
                            >
                                {term}
                            </Link>
                        ))}
                    </div>

                    {/* Stats Bar */}
                    <div className="flex justify-center gap-12 mt-16 pt-10 border-t border-white/10">
                        <div className="text-center group">
                            <span className="block text-4xl font-extrabold text-white group-hover:scale-110 transition-transform">25+</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-300/80 mt-1">{t.common.categories}</span>
                        </div>
                        <div className="text-center group">
                            <span className="block text-4xl font-extrabold text-white group-hover:scale-110 transition-transform">100k+</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-300/80 mt-1">Users</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 mb-2 leading-tight">
                            {t.home.categoriesTitle}
                        </h2>
                        <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
                    </div>
                    <Link href="/listings" className="group text-blue-600 font-bold hover:text-blue-800 transition flex items-center gap-2 text-lg">
                        {t.common.viewAll} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {categoriesError ? (
                    <div className="p-8 bg-red-50 text-red-600 rounded-3xl border border-red-100 text-center font-bold">
                        {categoriesError}
                    </div>
                ) : (
                    <CategoryGrid categories={categories} />
                )}
            </section>

            {/* Featured Listings Section - Fixed Scroll */}
            <div className="relative overflow-hidden w-full">
                <section className="bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-gray-50 to-white py-24 px-4">
                    <div className="container mx-auto">
                        <div className="flex flex-col items-center text-center mb-12">
                            <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm mb-4">Handpicked Selections</span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Flame className="w-10 h-10 text-orange-500 fill-orange-500" /> {t.home.featuredListings}
                            </h2>
                            <p className="text-gray-500 max-w-2xl text-lg font-medium">
                                Discover the most popular items trending in your area today. Premium quality guaranteed.
                            </p>
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            <FeaturedListings />
                        </div>
                    </div>
                </section>
            </div>

            {/* CTA Section */}
            <section className="container mx-auto px-4 my-16">
                <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            {t.home.ctaTitle}
                        </h2>
                        <p className="text-blue-100/80 mb-12 text-xl font-medium">
                            {t.home.ctaSubtitle}
                        </p>
                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="py-8 px-12 rounded-2xl text-xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl bg-white text-blue-900 hover:bg-blue-50"
                        >
                            <Link href="/post">
                                {t.common.postAd}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Trust Badges - Modern Layout */}
            <section className="container mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: <ShieldCheck className="w-12 h-12 text-blue-600" />, title: t.trust.secure, desc: 'Verified users & payments' },
                        { icon: <Zap className="w-12 h-12 text-yellow-500 fill-yellow-500" />, title: t.trust.fast, desc: 'Post in 2 minutes' },
                        { icon: <Banknote className="w-12 h-12 text-green-500" />, title: t.trust.free, desc: 'No hidden fees' },
                        { icon: <Map className="w-12 h-12 text-blue-400" />, title: t.trust.local, desc: '100% Slovak marketplace' }
                    ].map((badge, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                            <div className="mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
                                {badge.icon}
                            </div>
                            <h3 className="font-black text-xl text-gray-900 mb-2">{badge.title}</h3>
                            <p className="text-gray-500 font-medium">{badge.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
