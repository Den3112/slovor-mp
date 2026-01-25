import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { Sparkles, Target, Star } from 'lucide-react'

export default async function AboutPage() {
  const { t } = await getTranslationServer()

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
            <Sparkles className="h-3.5 w-3.5" />
            Our Story
          </div>
          <h1 className="font-heading text-foreground mb-8 text-6xl leading-[1.05] font-black tracking-tight md:text-8xl">
            {t.about.title}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed font-medium md:text-2xl">
            {t.about.subtitle}
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-24">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="shadow-premium border-border/50 bg-card/60 rounded-[2.5rem] border p-10 backdrop-blur-md md:p-12">
              <div className="bg-primary/10 mb-8 flex h-14 w-14 items-center justify-center rounded-2xl">
                <Target className="text-primary h-8 w-8" />
              </div>
              <h2 className="font-heading mb-6 text-3xl font-black tracking-tight text-white italic">
                {t.about.mission}
              </h2>
              <p className="text-lg leading-relaxed font-medium text-zinc-400">
                {t.about.missionText}
              </p>
            </div>
            <div className="border-border/50 bg-muted/20 rounded-[2.5rem] border p-10 md:p-12">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                <Star className="h-8 w-8 text-violet-500" />
              </div>
              <h2 className="font-heading mb-6 text-3xl font-black tracking-tight text-white italic">
                {t.about.whyTitle}
              </h2>
              <p className="text-lg leading-relaxed font-medium text-zinc-400">
                {t.about.whyText}
              </p>
            </div>
          </div>

          <div className="border-primary/20 from-primary/10 rounded-[3rem] border bg-linear-to-tr via-transparent to-violet-500/5 p-12 text-center">
            <h3 className="font-heading mb-4 text-2xl font-black text-white italic">
              Built for Slovakia
            </h3>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-zinc-400">
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
