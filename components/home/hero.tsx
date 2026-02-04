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
  const { t, locale, i18n } = useTranslation(['home', 'common'])
  const router = useRouter()
  const [query, setQuery] = useState('')

  const popularSearches = ['iPhone', 'BMW', 'Byt', 'Pohovka', 'Bicykel', 'PS5', 'Práca']

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/${locale}/listings?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <section className="bg-background relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-32 lg:pt-36 lg:pb-48">
      {/* Clean Background - SaaS Style */}
      <div className="absolute inset-0 bg-background" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-1.5 text-xs font-black text-primary uppercase tracking-[0.2em] mb-8 border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              {t('heroTagline')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-foreground mb-6 text-4xl leading-tight font-black tracking-tight sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl"
          >
            {t('heroTitleMain')} <br className="hidden sm:block" />
            <span className="text-primary">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mx-auto max-w-3xl px-2 sm:px-0"
          >
            <div className="group relative">
              {/* Clean Search Box - Solid Style */}
              <div className="bg-background relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/60 p-2 transition-all duration-300 hover:border-primary/40 sm:flex-row sm:items-center sm:focus-within:ring-4 ring-primary/10">
                <div className="flex flex-1 items-center px-4 py-2 sm:pl-6">
                  <label htmlFor="hero-search" className="sr-only">
                    Search
                  </label>
                  <Search
                    className="text-muted-foreground h-5 w-5 shrink-0 md:h-6 md:w-6"
                    aria-hidden="true"
                  />
                  <input
                    id="hero-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    aria-label={t('searchPlaceholder')}
                    className="placeholder:text-muted-foreground w-full border-none bg-transparent px-3 py-3 text-base font-semibold text-foreground focus:ring-0 focus:outline-none sm:py-4 md:px-4 md:text-lg"
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
                  className="bg-primary hover:bg-primary/90 h-12 w-full shrink-0 rounded-xl text-base font-bold text-primary-foreground shadow-none transition-all active:scale-[0.98] sm:h-14 sm:w-auto sm:rounded-lg sm:px-8 md:px-10"
                >
                  {t('common:search')}
                  <ArrowRight className="ml-2 h-5 w-5" />
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
            <span className="text-slate-400 mb-2 w-full text-center text-[10px] font-bold tracking-widest uppercase sm:mr-2 sm:mb-0 sm:w-auto">
              {t('popularSearches')}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/${i18n.language || 'en'}/listings?search=${term}`}
                  className="bg-card text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary rounded-lg border border-border px-4 py-1.5 text-sm font-semibold transition-colors"
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
