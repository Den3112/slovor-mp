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
      title: t('trust.secure'),
      desc: 'Verified users & protected communications.',
      color: 'text-primary',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('trust.fast'),
      desc: 'Lightning fast listing creation process.',
      color: 'text-violet-500',
    },
    {
      icon: <Banknote className="h-8 w-8" />,
      title: t('trust.free'),
      desc: 'No commissions. 100% profit stays with you.',
      color: 'text-indigo-500',
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: t('trust.local'),
      desc: 'Focusing exclusively on the Slovak market.',
      color: 'text-sky-500',
    },
  ]

  return (
    <section className="bg-background py-24">
      <Container>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-32"
          >
            <span className="text-primary mb-4 block text-[10px] font-black tracking-[0.3em] uppercase">
              Our Excellence
            </span>
            <h2 className="font-heading text-4xl font-black tracking-tight md:text-5xl lg:text-6xl mb-6">
              <span className="block text-foreground">
                <span className="text-primary">
                  {t('home.features.reimagined')}
                </span>{' '}
                <br />
                <span className="opacity-40">
                  {t('home.features.forSlovakia')}
                </span>
              </span>
            </h2>
            <div className="space-y-6">
              {[
                'Advanced fraud protection measures',
                'Direct contact between buyers and sellers',
              ].map((item, i) => (
                <div key={i} className="group flex items-center gap-4">
                  <div className="bg-primary/10 group-hover:bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all group-hover:scale-110">
                    <CheckCircle2 className="text-primary h-4 w-4 group-hover:text-white" />
                  </div>
                  <span className="text-foreground/80 group-hover:text-primary text-xl font-bold transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/50"
              >
                <div
                  className={cn(
                    'bg-muted group-hover:bg-primary group-hover:text-primary-foreground mb-6 flex h-14 w-14 items-center justify-center rounded-lg shadow-sm transition-all duration-300',
                    feature.color
                  )}
                >
                  {feature.icon}
                </div>
                <h3 className="text-foreground mb-3 text-xl font-bold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
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
