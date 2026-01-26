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
    <section className="mesh-gradient relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-32 lg:pt-36 lg:pb-48">
      {/* Decorative Elements - Hidden on mobile for performance */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <div className="animate-float bg-primary/20 absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full blur-[120px]" />
        <div className="animate-float-delayed absolute bottom-[-10%] left-[-5%] h-[800px] w-[800px] rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      {/* Simplified decorative for mobile */}
      <div className="pointer-events-none absolute inset-0 md:hidden">
        <div className="bg-primary/15 absolute top-0 right-0 h-[300px] w-[300px] translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
      </div>

      <div className="absolute top-1/2 left-1/2 hidden h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[url('/grid-pattern.svg')] [mask-image:radial-gradient(white,transparent_70%)] bg-center opacity-20 md:block" />

      <Container className="relative">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="glass text-primary shadow-primary/5 mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[9px] font-black tracking-widest uppercase shadow-lg md:mb-10 md:px-5 md:text-[10px] md:tracking-[0.2em]">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
              {t.home.heroTagline}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="font-heading text-foreground mb-6 text-[2.5rem] leading-[1] font-black tracking-[-0.03em] sm:text-5xl md:mb-10 md:text-6xl lg:text-[7rem] lg:leading-[0.95] lg:tracking-[-0.04em]"
          >
            {t.home.heroTitleMain} <br className="hidden sm:block" />
            <span className="animate-gradient-x from-primary bg-linear-to-r via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              {t.home.heroTitleHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground mx-auto mb-8 max-w-lg px-4 text-base leading-relaxed font-medium opacity-80 sm:px-0 md:mb-16 md:max-w-2xl md:text-xl lg:text-2xl"
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
              <div className="from-primary absolute -inset-1 hidden rounded-4xl bg-linear-to-r to-violet-600 opacity-20 blur-2xl transition duration-1000 group-focus-within:opacity-40 md:block md:rounded-[2.5rem]" />

              <div className="border-border/30 bg-card/60 sm:focus-within:border-primary/50 sm:focus-within:ring-primary/10 relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-3 shadow-xl backdrop-blur-3xl transition-all duration-300 sm:flex-row sm:items-center sm:rounded-4xl sm:p-2 sm:pr-2 sm:focus-within:ring-4 md:rounded-[2.2rem] md:shadow-2xl">
                <div className="focus-within:bg-primary/5 flex flex-1 items-center rounded-xl px-4 py-1 transition-colors sm:pl-4 sm:focus-within:bg-transparent md:pl-6">
                  <label htmlFor="hero-search" className="sr-only">
                    Search
                  </label>
                  <Search
                    className="text-primary h-5 w-5 shrink-0 opacity-70 md:h-6 md:w-6"
                    aria-hidden="true"
                  />
                  <input
                    id="hero-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    aria-label={t.home.searchPlaceholder}
                    className="placeholder:text-muted-foreground/40 w-full border-none bg-transparent px-3 py-4 text-base font-bold focus:ring-0 focus:outline-none active:border-none active:outline-none sm:py-5 md:px-4 md:py-6 md:text-xl"
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
                  className="shadow-primary/30 hover:shadow-primary/50 h-14 w-full shrink-0 rounded-xl text-base font-black shadow-lg transition-all active:scale-[0.98] sm:h-14 sm:w-auto sm:rounded-[1.5rem] sm:px-8 md:h-16 md:rounded-[1.8rem] md:px-10 md:text-lg"
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
            <span className="text-muted-foreground mb-2 w-full text-center text-[9px] font-black tracking-widest uppercase opacity-60 sm:mr-4 sm:mb-0 sm:w-auto md:text-[10px] md:tracking-[0.2em]">
              {t.home.popularSearches}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/listings?search=${term}`}
                  className="bg-muted/40 hover:border-primary/20 hover:bg-primary/10 hover:text-primary rounded-full border border-transparent px-4 py-2 text-xs font-bold backdrop-blur-sm transition-all active:scale-95 md:px-6 md:text-sm"
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
