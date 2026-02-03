import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { Sparkles, Target, Star } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Slovor Marketplace',
  description: 'Learn about Slovor Marketplace, our mission, and why we are built for Slovakia.',
}

export default async function AboutPage() {
  const { t } = await getTranslationServer()

  return (
    <main className="relative min-h-screen overflow-hidden pb-24 bg-background">
      <Container className="pt-32 md:pt-40">
        <div className="mx-auto mb-20 max-w-4xl text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-primary/10 text-primary mx-auto mb-6 inline-flex items-center gap-2 rounded-xl border border-primary/20 px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Our Story
          </div>
          <h1 className="font-heading text-foreground mb-8 text-6xl leading-[1.05] font-black tracking-tight md:text-8xl italic uppercase">
            {t('about.title')}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed font-medium md:text-2xl">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-24">
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
            <div className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-sm transition-colors hover:border-primary/20">
              <div className="bg-primary/10 mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20">
                <Target className="text-primary h-8 w-8" />
              </div>
              <h2 className="font-heading mb-6 text-3xl font-black tracking-tight text-foreground uppercase italic">
                {t('about.mission')}
              </h2>
              <p className="text-lg leading-relaxed font-medium text-muted-foreground">
                {t('about.missionText')}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-sm transition-colors hover:border-primary/20">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                <Star className="h-8 w-8 text-violet-500" />
              </div>
              <h2 className="font-heading mb-6 text-3xl font-black tracking-tight text-foreground uppercase italic">
                {t('about.whyTitle')}
              </h2>
              <p className="text-lg leading-relaxed font-medium text-muted-foreground">
                {t('about.whyText')}
              </p>
            </div>
          </div>

          <div className="bg-muted border border-border rounded-xl p-12 text-center">
            <h3 className="font-heading mb-4 text-2xl font-black text-foreground uppercase italic">
              Built for Slovakia
            </h3>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-muted-foreground">
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
