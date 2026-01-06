import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { HelpCircle, ChevronRight } from 'lucide-react'

export default async function FAQPage() {
  const { t } = await getTranslationServer()

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      {/* Background Decor */}
      <div className="absolute left-1/2 top-0 -z-10 h-full w-full -translate-x-1/2 opacity-30">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <Container className="pt-32 md:pt-40">
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            Help Center
          </div>
          <h1 className="mb-8 font-heading text-6xl font-black leading-[1.05] tracking-tight text-foreground md:text-8xl">
            {t.faq.title}
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-muted-foreground md:text-2xl">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="group cursor-default rounded-[2rem] border border-border/50 bg-card/40 p-8 backdrop-blur-sm transition-all hover:border-primary/30"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-black tracking-tight text-foreground">
                    {faq.q}
                  </h3>
                  <p className="text-lg font-medium leading-relaxed text-muted-foreground">
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
