import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { Sparkles, Target, Star } from 'lucide-react'

export default async function AboutPage() {
    const { t } = await getTranslationServer()

    return (
        <main className="min-h-screen pb-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
            </div>

            <Container className="pt-32 md:pt-40">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-6 mx-auto">
                        <Sparkles className="w-3.5 h-3.5" />
                        Our Story
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[1.05] mb-8 font-heading">
                        {t.about.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        {t.about.subtitle}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="p-10 md:p-12 rounded-[2.5rem] bg-card/60 backdrop-blur-md border border-border/50 shadow-premium">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                                <Target className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-6 italic font-heading tracking-tight">{t.about.mission}</h2>
                            <p className="text-lg font-medium text-zinc-400 leading-relaxed">
                                {t.about.missionText}
                            </p>
                        </div>
                        <div className="p-10 md:p-12 rounded-[2.5rem] border border-border/50 bg-muted/20">
                            <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-8">
                                <Star className="w-8 h-8 text-violet-500" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-6 italic font-heading tracking-tight">{t.about.whyTitle}</h2>
                            <p className="text-lg font-medium text-zinc-400 leading-relaxed">
                                {t.about.whyText}
                            </p>
                        </div>
                    </div>

                    <div className="p-12 rounded-[3rem] bg-gradient-to-tr from-primary/10 via-transparent to-violet-500/5 border border-primary/20 text-center">
                        <h3 className="text-2xl font-black text-white mb-4 italic font-heading">Built for Slovakia</h3>
                        <p className="text-xl font-medium text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Slovor is 100% focused on the Slovak market. We support local languages,
                            regions, and currencies to ensure a seamless experience for all our users.
                        </p>
                    </div>
                </div>
            </Container>
        </main>
    )
}
