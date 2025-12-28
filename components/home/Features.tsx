'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Banknote, Map, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'

export function Features() {
    const { t } = useTranslation()

    const features = [
        {
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
            title: t.trust.secure,
            desc: 'Verified users & protected communications.'
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            title: t.trust.fast,
            desc: 'Lightning fast listing creation process.'
        },
        {
            icon: <Banknote className="w-8 h-8 text-emerald-500" />,
            title: t.trust.free,
            desc: 'No commissions. 100% profit stays with you.'
        },
        {
            icon: <Map className="w-8 h-8 text-blue-500" />,
            title: t.trust.local,
            desc: 'Focusing exclusively on the Slovak market.'
        }
    ]

    return (
        <section className="py-24 overflow-hidden">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1] font-heading">
                            Marketplace <span className="text-primary italic">Reimagined</span> for Slovakia
                        </h2>
                        <div className="space-y-6">
                            {[
                                'Smart filtering for precise results',
                                'Zero hidden fees or commissions',
                                'Advanced fraud protection measures',
                                'Direct contact between buyers and sellers'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-lg font-semibold text-foreground/80">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="p-8 rounded-[2rem] bg-card border border-border/50 hover:border-primary/30 transition-all group"
                            >
                                <div className="mb-6 bg-muted/50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="font-black text-xl text-foreground mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}
