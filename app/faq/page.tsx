import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { HelpCircle, ChevronRight } from 'lucide-react'

export default async function FAQPage() {
    const { t } = await getTranslationServer()

    const faqs = [
        { q: t.faq.q1, a: t.faq.a1 },
        { q: t.faq.q2, a: t.faq.a2 },
        { q: t.faq.q3, a: t.faq.a3 }
    ]

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
                        <HelpCircle className="w-3.5 h-3.5" />
                        Help Center
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[1.05] mb-8 font-heading">
                        {t.faq.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        {t.faq.subtitle}
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="group p-8 rounded-[2rem] bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all cursor-default"
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white mb-3 tracking-tight">{faq.q}</h3>
                                    <p className="text-lg font-medium text-zinc-400 leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </main>
    )
}
