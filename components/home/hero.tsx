'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import { useRouter } from 'next/navigation'

export function Hero() {
  const { t, locale } = useTranslation(['home', 'common'])
  const router = useRouter()
  const [query, setQuery] = useState('')

  const popularSearches = (t('home:popularSearches.items', {
    returnObjects: true,
  }) || []) as string[]

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/${locale}/listings?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <section className="bg-mesh relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-32 lg:pt-36 lg:pb-48">
      {/* Aurora Background Glows - PRO MAX */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute -top-[20%] -left-[10%] h-[800px] w-[800px] animate-pulse rounded-full blur-[120px]" />
        <div className="bg-primary/5 absolute top-[10%] -right-[15%] h-[600px] w-[600px] rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="badge-pill border-primary/20 bg-primary/5 text-primary px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              {t('heroTagline')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-heading text-foreground mb-6 text-5xl leading-tight font-extrabold tracking-tight sm:text-6xl md:mb-8 md:text-7xl lg:text-8xl"
          >
            {t('heroTitleMain')} <br className="hidden sm:block" />
            <span className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mx-auto mb-10 max-w-2xl px-4 text-lg leading-relaxed font-medium sm:px-0 md:mb-14 md:text-xl lg:text-2xl"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-3xl px-2 sm:px-0"
          >
            <div className="group relative">
              {/* Dynamic Search Box - Pro Max Glass */}
              <div className="bg-primary/20 absolute -inset-1 rounded-[2.5rem] opacity-0 blur-2xl transition duration-1000 group-focus-within:opacity-60 group-hover:opacity-40" />

              <div className="bg-card border-border shadow-card hover:border-primary/30 relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border p-2 transition-all duration-500 sm:flex-row sm:items-center md:rounded-4xl">
                <div className="flex w-full items-center px-4 py-1 sm:flex-1 sm:py-2 sm:pl-6">
                  <Search
                    className="text-muted-foreground group-focus-within:text-primary h-5 w-5 shrink-0 transition-all duration-500 group-focus-within:scale-110 md:h-6 md:w-6"
                    aria-hidden="true"
                  />
                  <Input
                    id="hero-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="placeholder:text-muted-foreground text-foreground h-14 w-full border-none bg-transparent px-3 py-3 text-lg font-bold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-auto sm:py-4 md:px-4 md:text-xl"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch()
                    }}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-14 rounded-2xl px-10 text-lg font-bold shadow-md active:scale-95 sm:w-auto"
                >
                  {t('common:search')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3 px-2"
          >
            <span className="mb-2 w-full text-center text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase sm:mr-4 sm:mb-0 sm:w-auto">
              {t('home:popularSearches.title')}
            </span>
            <div className="flex max-w-full flex-wrap items-center justify-center gap-3">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term)
                    router.push(
                      `/${locale}/listings?search=${encodeURIComponent(term)}`
                    )
                  }}
                  className="bg-primary/5 border-primary/10 hover:border-primary/30 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full border px-6 py-2 text-sm font-bold transition-all hover:shadow-lg active:scale-95"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
