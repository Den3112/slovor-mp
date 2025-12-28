'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

export function HomeCTA() {
    const { t } = useTranslation()

    return (
        <section className="py-24">
            <Container>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] bg-foreground p-12 md:p-24 text-center text-background overflow-hidden shadow-2xl"
                >
                    {/* Animated Orbs */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-8 font-heading"
                        >
                            {t.home.ctaTitle}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-background/70 text-xl md:text-2xl font-medium mb-12 max-w-xl mx-auto leading-relaxed"
                        >
                            {t.home.ctaSubtitle}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                asChild
                                size="lg"
                                className="h-20 px-12 rounded-full text-xl font-bold bg-background text-foreground hover:bg-muted transition-all hover:scale-105 shadow-2xl group"
                            >
                                <Link href="/post">
                                    <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                                    {t.common.postAd}
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </Container>
        </section>
    )
}
