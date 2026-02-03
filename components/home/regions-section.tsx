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
        <section className="bg-muted/30 py-16 md:py-24">
            <Container>
                <div className="mb-12 text-center">
                    <h2 className="font-heading mb-4 text-3xl font-black italic tracking-tight md:text-5xl">
                        {t('home:regionsTitle')}
                    </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {REGIONS.map((region, idx) => (
                        <motion.div
                            key={region.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                        >
                            <Link
                                href={`/${locale}/listings?location=${region.id}`}
                                className="group flex flex-col items-center gap-2 rounded-2xl bg-background border border-border px-8 py-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg active:scale-95"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-sm font-bold tracking-tight">
                                        {t(region.nameKey)}
                                    </h3>
                                    <p className="text-2xs font-bold text-muted-foreground uppercase tracking-widest">
                                        {region.count.toLocaleString()} {t('home:popularInRegion')}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
