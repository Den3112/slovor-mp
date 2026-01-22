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
          className="relative overflow-hidden border-2 border-primary/20 bg-background p-12 text-center text-foreground shadow-2xl md:p-32"
        >
          {/* Decorative Orbs */}
          <div className="animate-float absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="animate-float-delayed absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-600/10 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10 [mask-image:radial-gradient(white,transparent_70%)]" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="mb-10 inline-block border border-primary/20 bg-primary/5 px-6 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-primary"
            >
              Join the Community
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-12 font-heading text-6xl font-bold leading-[1] tracking-tighter md:text-[6.5rem]"
            >
              {t.home.ctaTitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mx-auto mb-16 max-w-xl font-sans text-xl font-medium leading-relaxed text-muted-foreground md:text-2xl"
            >
              {t.home.ctaSubtitle}
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
                className="group h-20 rounded-none bg-primary px-14 text-xl font-bold text-primary-foreground shadow-2xl transition-all hover:scale-105 hover:bg-primary/90"
              >
                <Link href="/post">
                  <Plus className="mr-3 h-6 w-6 transition-transform duration-700 group-hover:rotate-90" />
                  {t.common.postAd}
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
