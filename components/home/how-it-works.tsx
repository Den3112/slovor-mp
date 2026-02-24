'use client'

import { motion } from 'framer-motion'
import { PlusCircle, Globe, Zap } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function HowItWorks() {
  const { t } = useTranslation(['home'])

  const steps = [
    {
      icon: <PlusCircle className="h-8 w-8" />,
      title: t('home:howItWorksStep1'),
      desc: t('home:howItWorksStep1Desc'),
      color: 'bg-step-1',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t('home:howItWorksStep2'),
      desc: t('home:howItWorksStep2Desc'),
      color: 'bg-step-2',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('home:howItWorksStep3'),
      desc: t('home:howItWorksStep3Desc'),
      color: 'bg-step-3',
    },
  ]

  return (
    <section className="bg-background relative overflow-hidden py-24 md:py-32">
      {/* Decorative background grid */}
      <div className="bg-grid-slate-100 mask-[linear-gradient(to_bottom,white,transparent)] absolute inset-0 opacity-20 dark:opacity-10" />

      <Container className="relative z-10">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-pill border-primary/20 bg-primary/5 text-primary mb-4 px-4 py-2">
              <Zap className="mr-2 h-4 w-4" />
              {t('home:howItWorksTitle')}
            </span>
            <h2 className="font-heading text-foreground mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              {t('home:howItWorksTitle')}
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-16">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Connector line for desktop - PRO MAX */}
              {idx < steps.length - 1 && (
                <div className="bg-linear-to-r from-primary/40 to-transparent absolute top-16 left-[60%] hidden h-[2px] w-[80%] md:block">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.2 }}
                    className="h-full w-full origin-left bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                  />
                </div>
              )}

              <div className="relative mb-10">
                {/* Glow behind step */}
                <div className="bg-primary/20 absolute -inset-4 rounded-full blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-40" />

                <div className="bg-card relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border shadow-md transition-all duration-500 group-hover:scale-110 group-hover:shadow-primary/20 sm:h-24 sm:w-24">
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:rotate-6 sm:h-16 sm:w-16",
                    step.color
                  )}>
                    {step.icon}
                  </div>

                  {/* Step Number Badge */}
                  <div className="bg-card text-foreground absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-black shadow-md">
                    {idx + 1}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-foreground group-hover:text-primary text-2xl font-bold tracking-tight transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mx-auto max-w-xs text-base leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
