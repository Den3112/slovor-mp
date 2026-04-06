'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { useTranslation } from '@/shared/lib/i18n'
import Link from 'next/link'

export function HomeCTA() {
  const { t, locale } = useTranslation(['home', 'common'])

  return (
    <section className="relative overflow-hidden py-32">
      {/* Background patterns - Premium Mesh */}
      <div className="bg-mesh absolute inset-0 opacity-40" />
      <div className="via-background/50 to-background absolute inset-0 bg-linear-to-b from-transparent" />

      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border-border shadow-card hover:border-primary/30 relative overflow-hidden rounded-4xl border px-6 py-24 text-center text-white transition-all duration-700 md:px-16 md:py-32"
        >
          {/* Animated decorative elements - Deep Glows */}
          <div className="bg-primary/10 absolute -top-40 -right-40 h-[500px] w-[500px] animate-pulse rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />

          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />

          <div className="relative z-10 mx-auto max-w-4xl space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="badge-pill text-primary-foreground mb-8 border-white/10 bg-white/5">
                {t('common:getStarted')}
              </span>
              <h2 className="font-heading text-5xl leading-[1.05] font-black tracking-tight uppercase md:text-8xl">
                {t('ctaTitle')}
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-slate-400 md:text-2xl"
            >
              {t('ctaSubtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="pt-6"
            >
              <Button
                asChild
                variant="default"
                size="xl"
                className="shadow-primary/20 h-20 rounded-2xl px-16 text-xl font-black tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
              >
                <Link href={`/${locale}/post`}>
                  <Plus className="mr-4 h-8 w-8" />
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
