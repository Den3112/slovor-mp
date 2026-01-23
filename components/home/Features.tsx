'use client'

import { motion, useScroll } from 'framer-motion'
import { ShieldCheck, Zap, Banknote, Map, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function Features() {
  const { t } = useTranslation()
  useScroll() // Keep for potential future use

  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: t.trust.secure,
      desc: 'Verified users & protected communications.',
      color: 'text-primary',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t.trust.fast,
      desc: 'Lightning fast listing creation process.',
      color: 'text-violet-500',
    },
    {
      icon: <Banknote className="h-8 w-8" />,
      title: t.trust.free,
      desc: 'No commissions. 100% profit stays with you.',
      color: 'text-indigo-500',
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: t.trust.local,
      desc: 'Focusing exclusively on the Slovak market.',
      color: 'text-sky-500',
    },
  ]

  return (
    <section className="overflow-hidden bg-card/5 py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Our Excellence
            </span>
            <h2 className="font-heading text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
              <span className="block text-white">
                <span className="text-primary">{t.home.features.reimagined}</span> <br />
                <span className="opacity-40">{t.home.features.forSlovakia}</span>
              </span>
            </h2>
            <div className="space-y-6">
              {[
                'Advanced fraud protection measures',
                'Direct contact between buyers and sellers',
              ].map((item, i) => (
                <div key={i} className="group flex items-center gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:scale-110 group-hover:bg-primary">
                    <CheckCircle2 className="h-4 w-4 text-primary group-hover:text-white" />
                  </div>
                  <span className="text-xl font-bold text-foreground/80 transition-colors group-hover:text-primary">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/60 p-10 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-colors duration-700 group-hover:bg-primary/20" />

                <div
                  className={cn(
                    'mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/40 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground',
                    feature.color
                  )}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-2xl font-black tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="font-medium leading-relaxed text-muted-foreground opacity-70">
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
