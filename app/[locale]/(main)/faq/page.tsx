import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { HelpCircle, ChevronRight } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslationServer(['faq'])
  return {
    title: t('faq:title'),
    description: t('faq:subtitle'),
  }
}

export default async function FAQPage() {
  const { t } = await getTranslationServer(['common', 'faq'])

  const faqs = [
    { q: t('faq:q1'), a: t('faq:a1') },
    { q: t('faq:q2'), a: t('faq:a2') },
    { q: t('faq:q3'), a: t('faq:a3') },
  ]

  return (
    <main className="bg-background relative min-h-screen pb-24">
      <Container className="pt-32 md:pt-40">
        <div className="animate-in fade-in slide-in-from-top-4 mx-auto mb-20 max-w-4xl text-center duration-700">
          <div className="bg-primary/10 text-primary border-primary/20 mx-auto mb-6 inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            <HelpCircle className="h-3.5 w-3.5" />
            {t('common:help')}
          </div>
          <h1 className="font-heading text-foreground mb-8 text-6xl leading-[1.05] font-bold tracking-tight uppercase md:text-8xl">
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
              className="group border-border bg-card hover:border-primary/30 cursor-default rounded-xl border p-8 shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="bg-muted group-hover:bg-primary border-border mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 group-hover:text-white">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-foreground mb-3 text-xl font-bold tracking-tight uppercase">
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
