import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { Sparkles, Target, Star } from 'lucide-react'

export default async function AboutPage() {
  const { t } = await getTranslationServer()

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
            <Sparkles className="h-3.5 w-3.5" />
            Our Story
          </div>
          <h1 className="mb-8 font-heading text-6xl font-black leading-[1.05] tracking-tight text-foreground md:text-8xl">
            {t.about.title}
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-muted-foreground md:text-2xl">
            {t.about.subtitle}
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-24">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="shadow-premium rounded-[2.5rem] border border-border/50 bg-card/60 p-10 backdrop-blur-md md:p-12">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-6 font-heading text-3xl font-black italic tracking-tight text-white">
                {t.about.mission}
              </h2>
              <p className="text-lg font-medium leading-relaxed text-zinc-400">
                {t.about.missionText}
              </p>
            </div>
            <div className="rounded-[2.5rem] border border-border/50 bg-muted/20 p-10 md:p-12">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                <Star className="h-8 w-8 text-violet-500" />
              </div>
              <h2 className="mb-6 font-heading text-3xl font-black italic tracking-tight text-white">
                {t.about.whyTitle}
              </h2>
              <p className="text-lg font-medium leading-relaxed text-zinc-400">
                {t.about.whyText}
              </p>
            </div>
          </div>

          <div className="rounded-[3rem] border border-primary/20 bg-gradient-to-tr from-primary/10 via-transparent to-violet-500/5 p-12 text-center">
            <h3 className="mb-4 font-heading text-2xl font-black italic text-white">
              Built for Slovakia
            </h3>
            <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-zinc-400">
              Slovor is 100% focused on the Slovak market. We support local
              languages, regions, and currencies to ensure a seamless experience
              for all our users.
            </p>
          </div>
        </div>
      </Container>
    </main >
  )
}
