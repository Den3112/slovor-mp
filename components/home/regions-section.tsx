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
        <section className="bg-muted/30 py-24 md:py-32 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2" />

            <Container className="relative">
                <div className="mb-16 text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-heading text-4xl font-bold tracking-tighter md:text-6xl text-foreground uppercase">
                            {t('home:regionsTitle')}
                        </h2>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <div className="h-1 w-12 bg-primary rounded-full" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                                {t('home:exploreSlovakia')}
                            </p>
                            <div className="h-1 w-12 bg-primary rounded-full" />
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                                className="group block relative rounded-2xl bg-card border border-border p-6 transition-all hover:-translate-y-2 hover:border-primary/40 shadow-card active:scale-95"
                            >
                                <div className="space-y-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-6 shadow-sm border border-primary/10">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold tracking-tight text-foreground uppercase group-hover:text-primary transition-colors">
                                            {t(region.nameKey)}
                                        </h3>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="h-0.5 w-4 bg-border group-hover:bg-primary/50 transition-all" />
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                {region.count.toLocaleString()} {t('home:popularInRegion')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Abstract accent */}
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-10 transition-opacity">
                                    <MapPin className="h-12 w-12 text-primary" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
