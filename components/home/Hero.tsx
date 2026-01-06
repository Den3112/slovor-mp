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
    <section className="mesh-gradient relative overflow-hidden pb-16 pt-20 md:pb-32 md:pt-28 lg:pb-48 lg:pt-36">
      {/* Decorative Elements - Hidden on mobile for performance */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <div className="animate-float absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="animate-float-delayed absolute bottom-[-10%] left-[-5%] h-[800px] w-[800px] rounded-full bg-violet-600/10 blur-[140px]" />
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
            <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] text-primary shadow-lg shadow-primary/5 md:mb-10 md:px-5 md:text-[10px] md:tracking-[0.2em]">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
              {t.home.heroTagline}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="mb-6 font-heading text-[2.5rem] font-black leading-[1] tracking-[-0.03em] text-foreground sm:text-5xl md:mb-10 md:text-6xl lg:text-[7rem] lg:leading-[0.95] lg:tracking-[-0.04em]"
          >
            {t.home.heroTitleMain} <br className="hidden sm:block" />
            <span className="animate-gradient-x bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              {t.home.heroTitleHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-8 max-w-lg px-4 text-base font-medium leading-relaxed text-muted-foreground opacity-80 sm:px-0 md:mb-16 md:max-w-2xl md:text-xl lg:text-2xl"
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
              {/* Glow effect - hidden on mobile */}
              <div className="absolute -inset-1 hidden rounded-[2rem] bg-gradient-to-r from-primary to-violet-600 opacity-20 blur-2xl transition duration-1000 group-focus-within:opacity-40 md:block md:rounded-[2.5rem]" />

              <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/30 bg-card/60 p-3 shadow-xl backdrop-blur-3xl transition-all duration-300 sm:focus-within:border-primary/50 sm:focus-within:ring-4 sm:focus-within:ring-primary/10 sm:flex-row sm:items-center sm:rounded-[2rem] sm:p-2 sm:pr-2 md:rounded-[2.2rem] md:shadow-2xl">
                <div className="flex flex-1 items-center px-4 py-1 rounded-xl transition-colors focus-within:bg-primary/5 sm:pl-4 sm:focus-within:bg-transparent md:pl-6">
                  <label htmlFor="hero-search" className="sr-only">Search</label>
                  <Search className="h-5 w-5 shrink-0 text-primary opacity-70 md:h-6 md:w-6" aria-hidden="true" />
                  <input
                    id="hero-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    aria-label={t.home.searchPlaceholder}
                    className="w-full border-none bg-transparent px-3 py-4 text-base font-bold placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 active:outline-none active:border-none sm:py-5 md:px-4 md:py-6 md:text-xl"
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
                  className="h-14 w-full shrink-0 rounded-xl text-base font-black shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 active:scale-[0.98] sm:h-14 sm:w-auto sm:rounded-[1.5rem] sm:px-8 md:h-16 md:rounded-[1.8rem] md:px-10 md:text-lg"
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
            className="mt-8 flex flex-wrap items-center justify-center gap-2 px-2 md:mt-14 md:gap-3"
          >
            <span className="mb-2 w-full text-center text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground opacity-60 sm:mb-0 sm:mr-4 sm:w-auto md:text-[10px] md:tracking-[0.2em]">
              {t.home.popularSearches}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/listings?search=${term}`}
                  className="rounded-full border border-transparent bg-muted/40 px-4 py-2 text-xs font-bold backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary active:scale-95 md:px-6 md:text-sm"
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
