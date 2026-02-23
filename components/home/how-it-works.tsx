'use client'

import { motion } from 'framer-motion'
import { PlusCircle, Globe, Zap } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'

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
    <section className="bg-background py-16 md:py-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="font-heading mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            {t('home:howItWorksTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connector line for desktop */}
              {idx < steps.length - 1 && (
                <div className="bg-border absolute top-12 left-[60%] hidden h-px w-[80%] md:block" />
              )}

              <div className="bg-background border-border ring-muted/20 relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border-2 ring-8">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-xl text-white ${step.color}`}
                >
                  {step.icon}
                </div>
                <div className="bg-foreground text-background absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                  {idx + 1}
                </div>
              </div>

              <h3 className="mb-3 text-xl font-bold tracking-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground max-w-xs leading-relaxed font-medium">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
