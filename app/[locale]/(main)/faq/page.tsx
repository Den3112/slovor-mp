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
    <main className="relative min-h-screen bg-background pb-24">
      <Container className="pt-32 md:pt-40">
        <div className="mx-auto mb-20 max-w-4xl text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-primary/10 text-primary mx-auto mb-6 inline-flex items-center gap-2 rounded-xl border border-primary/20 px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase">
            <HelpCircle className="h-3.5 w-3.5" />
            {t('common:help')}
          </div>
          <h1 className="font-heading text-foreground mb-8 text-6xl leading-[1.05] font-black tracking-tight md:text-8xl italic uppercase">
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
              className="group border border-border bg-card hover:border-primary/30 cursor-default rounded-xl p-8 transition-all shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="bg-muted group-hover:bg-primary border border-border mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 group-hover:text-white">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-foreground mb-3 text-xl font-black tracking-tight uppercase italic">
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
