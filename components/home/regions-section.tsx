'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'

const REGIONS = [
  { id: 'bratislava', nameKey: 'home:regions.bratislava', count: 12345 },
  { id: 'kosice', nameKey: 'home:regions.kosice', count: 5678 },
  { id: 'zilina', nameKey: 'home:regions.zilina', count: 3456 },
  { id: 'nitra', nameKey: 'home:regions.nitra', count: 2100 },
  { id: 'bb', nameKey: 'home:regions.banskaBystrica', count: 1800 },
]

export function RegionsSection() {
  const { t, locale } = useTranslation(['home', 'common'])

  return (
    <section className="bg-muted/30 relative overflow-hidden py-24 md:py-32">
      {/* Background elements */}
      <div className="bg-primary/5 absolute top-0 left-1/4 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl" />
      <div className="bg-primary/5 absolute right-1/4 bottom-0 h-96 w-96 translate-y-1/2 rounded-full blur-3xl" />

      <Container className="relative">
        <div className="mb-16 space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-foreground text-4xl font-bold tracking-tighter uppercase md:text-6xl">
              {t('home:regionsTitle')}
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="bg-primary h-1 w-12 rounded-full" />
              <p className="text-muted-foreground text-[10px] font-bold tracking-[0.3em] uppercase">
                {t('home:exploreSlovakia')}
              </p>
              <div className="bg-primary h-1 w-12 rounded-full" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {REGIONS.map((region, idx) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                href={`/${locale}/listings?location=${region.id}`}
                className="group bg-card border-border hover:border-primary/40 shadow-card relative block rounded-2xl border p-6 transition-all hover:-translate-y-2 active:scale-95"
              >
                <div className="space-y-4">
                  <div className="bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground border-primary/10 flex h-12 w-12 items-center justify-center rounded-lg border shadow-sm transition-all group-hover:scale-110 group-hover:rotate-6">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-foreground group-hover:text-primary text-lg font-bold tracking-tight uppercase transition-colors">
                      {t(region.nameKey)}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="bg-border group-hover:bg-primary/50 h-0.5 w-4 transition-all" />
                      <p className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">
                        {region.count.toLocaleString()}{' '}
                        {t('home:popularInRegion')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Abstract accent */}
                <div className="absolute right-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-10">
                  <MapPin className="text-primary h-12 w-12" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
