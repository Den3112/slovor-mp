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
    <section className="py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-5xl bg-blue-600 p-12 text-center text-white shadow-xl shadow-blue-200 dark:shadow-none md:p-24"
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="mb-8 inline-block rounded-full bg-white/20 px-5 py-1.5 text-[11px] font-bold tracking-widest text-white uppercase backdrop-blur-sm"
            >
              {t('common:joinCommunity')}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-heading mb-8 text-4xl leading-tight font-black tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              {t('ctaTitle')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mx-auto mb-12 max-w-xl text-lg leading-relaxed font-medium text-blue-50 md:text-2xl"
            >
              {t('ctaSubtitle')}
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
                className="group bg-white text-blue-600 hover:bg-blue-50 h-16 rounded-2xl px-10 text-lg font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <Link href="/post">
                  <Plus className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
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
