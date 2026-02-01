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
          className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground md:px-12 md:py-20"
        >
          <div className="relative z-10 mx-auto max-w-4xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-heading mb-6 text-3xl font-bold tracking-tight md:text-5xl"
            >
              {t('ctaTitle')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mx-auto mb-10 max-w-2xl text-lg font-medium text-primary-foreground/90 md:text-xl"
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
                variant="secondary"
                className="h-14 rounded-xl px-8 text-lg font-semibold shadow-sm transition-transform hover:scale-105"
              >
                <Link href="/post">
                  <Plus className="mr-2 h-5 w-5" />
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
