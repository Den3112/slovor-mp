'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

export function HomeCTA() {
  const { t, locale } = useTranslation(['home', 'common'])

  return (
    <section className="relative overflow-hidden py-32">
      {/* Background patterns */}
      <div className="bg-muted/20 absolute inset-0" />
      <div className="bg-border/40 absolute top-0 left-0 h-px w-full" />
      <div className="bg-border/40 absolute bottom-0 left-0 h-px w-full" />

      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'circOut' }}
          className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950 px-6 py-20 text-center text-white md:px-16 md:py-32"
        >
          {/* Animated decorative elements */}
          <div className="bg-primary/10 absolute -top-24 -right-24 h-64 w-64 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />

          <div className="absolute inset-0 bg-white/2" />

          <div className="relative z-10 mx-auto max-w-4xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="badge-pill bg-primary/10 border-primary/20 text-primary mb-6">
                {t('common:getStarted')}
              </span>
              <h2 className="font-heading text-4xl leading-[1.1] font-bold tracking-tight uppercase md:text-7xl">
                {t('ctaTitle')}
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-slate-400 md:text-xl"
            >
              {t('ctaSubtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="pt-4"
            >
              <Button
                asChild
                size="lg"
                className="shadow-primary/20 bg-primary hover:bg-primary/90 h-16 rounded-xl border-0 px-12 text-lg font-bold tracking-widest uppercase shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <Link href={`/${locale}/post`}>
                  <Plus className="mr-3 h-6 w-6" />
                  {t('common:postAd')}
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
