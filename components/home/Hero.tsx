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
    <section className="mesh-gradient relative overflow-hidden pb-28 pt-24 md:pb-48 md:pt-36">
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="animate-float-delayed absolute bottom-[-10%] left-[-5%] h-[800px] w-[800px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[url('/grid-pattern.svg')] bg-center opacity-20 [mask-image:radial-gradient(white,transparent_70%)]" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="glass mb-10 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-lg shadow-primary/5">
              <Sparkles className="h-4 w-4" />
              {t.home.heroTagline}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="mb-10 font-heading text-6xl font-black leading-[0.95] tracking-[-0.04em] text-foreground md:text-[7rem]"
          >
            {t.home.heroTitleMain} <br />
            <span className="animate-gradient-x bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              {t.home.heroTitleHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-16 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground opacity-80 md:text-2xl"
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
            className="relative mx-auto max-w-3xl"
          >
            <div className="group relative">
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-primary to-violet-600 opacity-20 blur-2xl transition duration-1000 group-focus-within:opacity-40" />
              <div className="relative flex items-center overflow-hidden rounded-[2.2rem] border border-white/10 bg-card/60 p-2 pr-2 shadow-2xl backdrop-blur-3xl">
                <div className="flex flex-1 items-center pl-6">
                  <Search className="h-6 w-6 shrink-0 text-primary opacity-70" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    className="w-full border-none bg-transparent px-4 py-6 text-xl font-bold placeholder:text-muted-foreground/40 focus:ring-0"
                  />
                </div>
                <Button
                  asChild
                  size="lg"
                  className="h-16 shrink-0 rounded-[1.8rem] px-10 text-lg font-black shadow-xl shadow-primary/30 transition-all hover:shadow-primary/50 active:scale-95"
                >
                  <Link href={`/listings?search=${encodeURIComponent(query)}`}>
                    {t.common.search}
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="mr-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
              {t.home.popularSearches}
            </span>
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/listings?search=${term}`}
                className="rounded-full border border-transparent bg-muted/40 px-6 py-2 text-sm font-bold backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
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
