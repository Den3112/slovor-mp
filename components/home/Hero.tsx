'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

export function Hero() {
    const { t } = useTranslation()
    const [query, setQuery] = useState('')

    const popularSearches = ['iPhone', 'BMW', 'Byt', 'Kočík', 'Gauč', 'PS5']

    return (
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <Container className="relative">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase border border-primary/20 mb-8">
                            <Sparkles className="w-3.5 h-3.5" />
                            Slovakia's Premium Marketplace
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[1.05] mb-8 font-heading"
                    >
                        Find exactly <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">what you need</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        {t.home.heroSubtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative max-w-2xl mx-auto"
                    >
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-500 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-500" />
                            <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-border/50 rounded-[1.8rem] p-2 pr-2 shadow-2xl overflow-hidden">
                                <div className="flex-1 flex items-center pl-4">
                                    <Search className="w-6 h-6 text-muted-foreground shrink-0" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={t.home.searchPlaceholder}
                                        className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium py-4 px-4 placeholder:text-muted-foreground/60"
                                    />
                                </div>
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-14 px-8 rounded-[1.4rem] text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 shrink-0"
                                >
                                    <Link href={`/listings?search=${encodeURIComponent(query)}`}>
                                        {t.common.search}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-10 flex flex-wrap justify-center items-center gap-3"
                    >
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">{t.home.popularSearches}:</span>
                        {popularSearches.map((term, i) => (
                            <Link
                                key={term}
                                href={`/listings?search=${term}`}
                                className="text-sm font-semibold px-4 py-1.5 bg-muted/50 hover:bg-primary/10 hover:text-primary rounded-full transition-all border border-transparent hover:border-primary/20"
                            >
                                {term}
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </Container>
        </section>
    )
}
