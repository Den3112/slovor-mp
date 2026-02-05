'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

export function HomeCTA() {
  const { t } = useTranslation(['home', 'common'])

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-muted/20" />
      <div className="absolute top-0 left-0 w-full h-px bg-border/40" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-border/40" />

      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-20 text-center text-white md:px-16 md:py-32 border border-white/5"
        >
          {/* Animated decorative elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />

          <div className="absolute inset-0 bg-white/2" />

          <div className="relative z-10 mx-auto max-w-4xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">
                {t('common:getStarted')}
              </span>
              <h2 className="font-heading text-4xl font-bold tracking-tight md:text-7xl leading-[1.1] uppercase">
                {t('ctaTitle')}
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mx-auto max-w-2xl text-lg font-medium text-slate-400 md:text-xl leading-relaxed"
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
                className="h-16 rounded-xl px-12 text-lg font-bold uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90 border-0"
              >
                <Link href="/post">
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
