import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { Sparkles, Target, Star } from 'lucide-react'

export default async function AboutPage() {
  const { t } = await getTranslationServer()

  return (
    <main className="relative min-h-screen pb-24 bg-black">
      {/* Architectural Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <Container className="pt-32 md:pt-48">
        <div className="mx-auto mb-24 max-w-4xl text-center">
          <div className="mx-auto mb-8 inline-flex items-center gap-3 border-2 border-primary/20 bg-primary/10 px-6 py-2 font-sans text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-4 w-4" />
            Our Story
          </div>
          <h1 className="mb-10 font-heading text-6xl font-black italic leading-[0.9] tracking-tighter text-white md:text-9xl">
            {t.about.title}
          </h1>
          <p className="mx-auto max-w-2xl font-sans text-xl font-medium tracking-wide text-zinc-500 leading-relaxed md:text-2xl">
            {t.about.subtitle}
          </p>
        </div>

        <div className="mx-auto max-w-5xl space-y-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="border-2 border-primary/20 bg-zinc-950 p-10 md:p-16 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)]">
              <div className="mb-10 flex h-16 w-16 items-center justify-center border-2 border-primary/20 bg-primary/5">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-8 font-heading text-4xl font-bold italic tracking-tight text-white">
                {t.about.mission}
              </h2>
              <p className="font-sans text-lg font-medium leading-relaxed text-zinc-400">
                {t.about.missionText}
              </p>
            </div>
            <div className="border-2 border-primary/10 bg-zinc-950 p-10 md:p-16 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.3)]">
              <div className="mb-10 flex h-16 w-16 items-center justify-center border-2 border-violet-500/20 bg-violet-500/5">
                <Star className="h-8 w-8 text-violet-500" />
              </div>
              <h2 className="mb-8 font-heading text-4xl font-bold italic tracking-tight text-white">
                {t.about.whyTitle}
              </h2>
              <p className="font-sans text-lg font-medium leading-relaxed text-zinc-400">
                {t.about.whyText}
              </p>
            </div>
          </div>

          <div className="border-2 border-primary/20 bg-zinc-950 p-12 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <h3 className="mb-6 font-heading text-4xl font-black italic tracking-tight text-white">
              Built for Slovakia
            </h3>
            <p className="mx-auto max-w-3xl font-sans text-xl font-medium leading-relaxed tracking-wide text-zinc-400">
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
