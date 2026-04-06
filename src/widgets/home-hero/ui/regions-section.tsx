'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { Container } from '@/shared/ui/container'
import { useTranslation } from '@/shared/lib/i18n'

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
    <section className="bg-mesh relative overflow-hidden py-24 md:py-32">
      {/* Aurora Background Glows - PRO MAX */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute top-0 -left-[10%] h-[600px] w-[600px] animate-pulse rounded-full blur-[100px]" />
        <div className="bg-primary/5 absolute -right-[10%] bottom-0 h-[600px] w-[600px] rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-pill border-primary/20 bg-primary/5 text-primary mb-4 px-4 py-2">
              <MapPin className="mr-2 h-4 w-4" />
              {t('home:exploreSlovakia')}
            </span>
            <h2 className="font-heading text-foreground mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              {t('home:regionsTitle')}
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {REGIONS.map((region, idx) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={`/${locale}/listings?location=${region.id}`}
                className="card-pro group border-border/40 relative flex flex-col items-center justify-center overflow-hidden p-8 text-center shadow-lg transition-all active:scale-[0.98]"
              >
                {/* Hover Glow */}
                <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 mb-6">
                  <div className="bg-primary/5 text-primary border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <MapPin className="h-8 w-8" />
                  </div>
                </div>

                <div className="relative z-10 space-y-2">
                  <h3 className="text-foreground group-hover:text-primary text-xl font-bold tracking-tight transition-colors">
                    {t(region.nameKey)}
                  </h3>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-primary text-xs font-bold tracking-widest uppercase">
                      {region.count.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                      {t('home:popularInRegion')}
                    </p>
                  </div>
                </div>

                {/* Abstract accent */}
                <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-0 transition-all duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:opacity-10">
                  <MapPin className="text-primary h-20 w-20" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
