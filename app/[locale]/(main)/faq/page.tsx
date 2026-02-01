import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { HelpCircle, ChevronRight } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | Slovor Marketplace',
  description: 'Frequently Asked Questions about buying and selling on Slovor.',
}

export default async function FAQPage() {
  const { t } = await getTranslationServer(['common', 'faq'])

  const faqs = [
    { q: t('faq:q1'), a: t('faq:a1') },
    { q: t('faq:q2'), a: t('faq:a2') },
    { q: t('faq:q3'), a: t('faq:a3') },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 opacity-30">
        <div className="bg-primary/20 absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <Container className="pt-32 md:pt-40">
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <div className="bg-primary/10 text-primary mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase">
            <HelpCircle className="h-3.5 w-3.5" />
            {t('common:help')}
          </div>
          <h1 className="font-heading text-foreground mb-8 text-6xl leading-[1.05] font-black tracking-tight md:text-8xl">
            {t('faq:title')}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed font-medium md:text-2xl">
            {t('faq:subtitle')}
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="group border-border/50 bg-card/40 hover:border-primary/30 cursor-default rounded-4xl border p-8 backdrop-blur-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 group-hover:bg-primary mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300 group-hover:text-white">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-foreground mb-3 text-xl font-black tracking-tight">
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </main>
  )
}
