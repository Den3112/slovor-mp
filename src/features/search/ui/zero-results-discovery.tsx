'use client'

import { Button } from '@/shared/ui/button'
import { Search, Sparkles, TrendingUp, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/shared/lib/i18n'

interface ZeroResultsDiscoveryProps {
  query?: string
  locale: string
}

export function ZeroResultsDiscovery({
  query,
  locale,
}: ZeroResultsDiscoveryProps) {
  const { t } = useTranslation(['search', 'common'])

  const trendingCategories = [
    { name: 'Electronics', slug: 'electronics', icon: '📱' },
    { name: 'Real Estate', slug: 'real-estate', icon: '🏠' },
    { name: 'Jobs', slug: 'jobs', icon: '💼' },
    { name: 'Auto', slug: 'auto', icon: '🚗' },
  ]

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-primary/5 text-primary mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] shadow-inner"
      >
        <Search className="h-10 w-10 opacity-20" />
      </motion.div>

      <h2 className="font-heading text-foreground mb-4 text-3xl font-black tracking-tight">
        {query ? t('noResultsFor', { query }) : t('noResults')}
      </h2>
      <p className="text-muted-foreground mb-12 max-w-md font-medium">
        {t('noResultsDescription', {
          defaultValue:
            "We couldn't find matches for your search. Try different keywords or browse our trending categories.",
        })}
      </p>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Trending Suggestions */}
        <div className="glass-panel border-primary/10 shadow-primary/5 rounded-[2rem] border p-8 text-left shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="text-primary h-5 w-5" />
            <h3 className="text-foreground text-sm font-black tracking-widest uppercase">
              {t('trendingNow', { defaultValue: 'Trending Now' })}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {trendingCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${locale}/search?category=${cat.slug}`}
                className="bg-primary/2 hover:bg-primary/5 hover:border-primary/20 flex items-center justify-between rounded-2xl border border-transparent p-4 transition-all active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-foreground text-sm font-bold">
                    {cat.name}
                  </span>
                </div>
                <ArrowRight className="text-primary/40 h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Support/Tips */}
        <div className="bg-primary shadow-primary/20 flex flex-col justify-center rounded-[2rem] p-8 text-left text-white shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-sm font-black tracking-widest uppercase opacity-80">
              {t('searchTips', { defaultValue: 'Search Tips' })}
            </h3>
          </div>
          <ul className="space-y-4 font-medium opacity-90">
            <li className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
              <span>
                {t('tip1', {
                  defaultValue: 'Check for typos or spelling errors',
                })}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
              <span>
                {t('tip2', { defaultValue: 'Try more general keywords' })}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
              <span>
                {t('tip3', { defaultValue: 'Broaden your location search' })}
              </span>
            </li>
          </ul>
          <Button
            asChild
            className="mt-8 bg-white font-black text-black hover:bg-white/90"
          >
            <Link href={`/${locale}/`}>
              {t('clearSearch', { defaultValue: 'Back to Home' })}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
