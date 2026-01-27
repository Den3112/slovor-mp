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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mesh-gradient relative overflow-hidden rounded-[4rem] bg-zinc-950 p-12 text-center text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] md:p-32"
        >
          {/* Decorative Orbs */}
          <div className="animate-float bg-primary/20 absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
          <div className="animate-float-delayed absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] [mask-image:radial-gradient(white,transparent_70%)] bg-center opacity-10" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass mb-10 inline-block rounded-full border-white/10 px-6 py-2 text-[10px] font-black tracking-[0.3em] text-white uppercase"
            >
              {t('common.joinCommunity')}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-heading mb-12 text-6xl leading-[0.9] font-black tracking-tighter md:text-[5.5rem]"
            >
              {t('home.ctaTitle')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mx-auto mb-16 max-w-xl text-xl leading-relaxed font-medium text-white/60 md:text-2xl"
            >
              {t('home.ctaSubtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Button
                asChild
                size="lg"
                className="group bg-card text-foreground hover:bg-card/90 h-20 rounded-4xl px-14 text-xl font-black shadow-2xl transition-all hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)]"
              >
                <Link href="/post">
                  <Plus className="mr-3 h-6 w-6 transition-transform duration-700 group-hover:rotate-90" />
                  {t('common.postAd')}
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
