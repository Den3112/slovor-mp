'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function Hero() {
  const { t } = useTranslation()
  const router = useRouter()
  const [query, setQuery] = useState('')

  const popularSearches = ['iPhone', 'BMW', 'Byt', 'Kočík', 'Gauč', 'PS5']

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/listings?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <section className="mesh-gradient relative overflow-hidden pb-20 pt-24 md:pb-32 md:pt-36 lg:pb-48 lg:pt-48">
      {/* Decorative Elements - Hidden on mobile for performance */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <div className="animate-float absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="animate-float-delayed absolute bottom-[-10%] left-[-5%] h-[800px] w-[800px] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      {/* Simplified decorative for mobile */}
      <div className="pointer-events-none absolute inset-0 md:hidden">
        <div className="absolute right-0 top-0 h-[300px] w-[300px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/15 blur-[80px]" />
      </div>

      <div className="absolute left-1/2 top-1/2 hidden h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[url('/grid-pattern.svg')] bg-center opacity-20 [mask-image:radial-gradient(white,transparent_70%)] md:block" />

      <Container className="relative">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="mb-6 inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary md:mb-12 md:px-5 md:text-[11px]">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
              {t.home.heroTagline}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="mb-8 font-heading text-[2.75rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:mb-12 md:text-7xl lg:text-[7.5rem] lg:leading-[1.05]"
          >
            {t.home.heroTitleMain} <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent italic">
              {t.home.heroTitleHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-10 max-w-lg px-4 font-sans text-lg font-medium leading-relaxed text-muted-foreground sm:px-0 md:mb-20 md:max-w-2xl md:text-xl lg:text-2xl"
          >
            {t.home.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              type: 'spring',
              damping: 20,
            }}
            className="relative mx-auto max-w-3xl px-2 sm:px-0"
          >
            <div className="group relative">
              <div className="relative flex flex-col gap-3 border-2 border-primary/20 bg-background p-3 transition-all duration-300 focus-within:border-primary sm:flex-row sm:items-center sm:p-2 sm:pr-2">
                <div className="flex flex-1 items-center px-4 py-1">
                  <label htmlFor="hero-search" className="sr-only">Search</label>
                  <Search className="h-5 w-5 shrink-0 text-primary md:h-6 md:w-6" aria-hidden="true" />
                  <input
                    id="hero-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    aria-label={t.home.searchPlaceholder}
                    className="w-full border-none bg-transparent px-3 py-4 font-sans text-lg font-bold placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 active:outline-none active:border-none sm:py-5 md:px-4 md:py-6 md:text-xl"
                    style={{ outline: 'none', boxShadow: 'none' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }
                    }}
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="h-14 w-full shrink-0 rounded-none bg-primary text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] sm:h-14 sm:w-auto sm:px-10 md:h-16 md:px-12 md:text-lg"
                >
                  {t.common.search}
                  <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-2 px-2 md:mt-16 md:gap-4"
          >
            <span className="mb-2 w-full font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:mb-0 sm:mr-4 sm:w-auto md:text-[11px]">
              {t.home.popularSearches}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/listings?search=${term}`}
                  className="border border-primary/10 bg-primary/5 px-4 py-2 font-sans text-xs font-bold transition-all hover:bg-primary/10 hover:text-primary md:px-6 md:text-sm"
                >
                  {term}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
