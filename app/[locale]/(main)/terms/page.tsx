import { Container } from '@/components/ui/container'
import { FileText, Clock } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { getTranslationServer } from '@/lib/i18n/server'

export default async function TermsPage() {
  const { t } = await getTranslationServer(['common', 'footer', 'legal'])
  return (
    <main className="bg-background relative min-h-screen pb-24">
      <Container className="pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl">
          <div className="animate-in fade-in slide-in-from-top-4 mb-12 flex items-center gap-6 duration-700">
            <div className="bg-primary/10 border-primary/20 flex h-14 w-14 items-center justify-center rounded-xl border">
              <FileText className="text-primary h-7 w-7" />
            </div>
            <div className="flex-1">
              <Breadcrumbs
                items={[{ label: t('footer:terms') || 'Terms of Service' }]}
              />
              <h1 className="font-heading text-foreground text-4xl font-bold tracking-tight uppercase md:text-6xl">
                {t('legal:terms.title')}
              </h1>
              <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <Clock className="h-3.5 w-3.5" />
                {t('legal:terms.updated')}
              </div>
            </div>
          </div>

          <div className="bg-card border-border prose prose-invert prose-zinc max-w-none rounded-xl border p-8 shadow-sm md:p-12">
            <section className="mb-12">
              <h2 className="text-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                {t('legal:terms.acceptanceTitle')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('legal:terms.acceptanceText')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                {t('legal:terms.useTitle')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('legal:terms.useText')}
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                {t('legal:terms.listingsTitle')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('legal:terms.listingsText')}
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  )
}
