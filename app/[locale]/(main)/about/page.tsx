import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { Sparkles, Target, Star } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Slovor Marketplace',
  description:
    'Learn about Slovor Marketplace, our mission, and why we are built for Slovakia.',
}

export default async function AboutPage() {
  const { t } = await getTranslationServer()

  return (
    <main className="bg-background relative min-h-screen overflow-hidden pb-24">
      <Container className="pt-32 md:pt-40">
        <div className="animate-in fade-in slide-in-from-top-4 mx-auto mb-20 max-w-4xl text-center duration-700">
          <div className="bg-primary/10 text-primary border-primary/20 mx-auto mb-6 inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Our Story
          </div>
          <h1 className="font-heading text-foreground mb-8 text-6xl leading-[1.05] font-bold tracking-tight uppercase md:text-8xl">
            {t('about:title')}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed font-medium md:text-2xl">
            {t('about:subtitle')}
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-24">
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
            <div className="bg-card border-border hover:border-primary/20 rounded-2xl border p-8 shadow-sm transition-colors md:p-12">
              <div className="bg-primary/10 border-primary/20 mb-8 flex h-14 w-14 items-center justify-center rounded-lg border">
                <Target className="text-primary h-8 w-8" />
              </div>
              <h2 className="font-heading text-foreground mb-6 text-3xl font-bold tracking-tight uppercase">
                {t('about:mission')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                {t('about:missionText')}
              </p>
            </div>
            <div className="bg-card border-border hover:border-primary/20 rounded-2xl border p-8 shadow-sm transition-colors md:p-12">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                <Star className="h-8 w-8 text-violet-500" />
              </div>
              <h2 className="font-heading text-foreground mb-6 text-3xl font-bold tracking-tight uppercase">
                {t('about:whyTitle')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                {t('about:whyText')}
              </p>
            </div>
          </div>

          <div className="bg-muted border-border rounded-2xl border p-12 text-center">
            <h3 className="font-heading text-foreground mb-4 text-2xl font-bold uppercase">
              Built for Slovakia
            </h3>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed font-medium">
              Slovor is 100% focused on the Slovak market. We support local
              languages, regions, and currencies to ensure a seamless experience
              for all our users.
            </p>
          </div>
        </div>
      </Container>
    </main>
  )
}
