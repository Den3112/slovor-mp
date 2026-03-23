'use client'

import { useTranslation } from '@/lib/i18n'
import { Container } from '@/components/ui/container'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

interface SearchHeaderProps {
  query?: string
}

export function SearchHeader({ query }: SearchHeaderProps) {
  const { t } = useTranslation(['search', 'common'])

  return (
    <div className="relative overflow-hidden border-b py-12">
      {/* Background patterns */}
      <div className="bg-primary/5 absolute inset-0 -z-10" />
      <div className="bg-[radial-gradient(circle_at_top_right,var(--primary-rgb)_0%,transparent_25%)] absolute inset-0 -z-10 opacity-10" />
      
      <Container>
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-primary shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg">
              <Search className="h-5 w-5" />
            </div>
            <span className="text-primary/60 text-[10px] font-black tracking-[0.3em] uppercase">
              {t('common:discovery', { defaultValue: 'Discovery' })}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-foreground text-4xl font-black tracking-tight sm:text-5xl"
          >
            {query ? (
              <>
                <span className="opacity-50">{t('searchResultsFor', { defaultValue: 'Results for' })}</span>{' '}
                <span className="text-primary">&quot;{query}&quot;</span>
              </>
            ) : (
              t('common:listings', { defaultValue: 'All Listings' })
            )}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="h-1 w-20 rounded-full bg-primary/20"
          />
        </div>
      </Container>
    </div>
  )
}
