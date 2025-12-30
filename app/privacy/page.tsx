import { Container } from '@/components/ui/container'
import { Shield, Clock } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pb-24 relative overflow-hidden">
            <Container className="pt-32 md:pt-40">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground font-heading italic">
                                Privacy Policy
                            </h1>
                            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mt-1">
                                <Clock className="w-4 h-4" />
                                Updated: December 26, 2025
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-card/40 backdrop-blur-md border border-border/50 shadow-premium prose prose-invert max-w-none prose-zinc">
                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase tracking-widest text-xs">1. Information Collection</h2>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                We collect information you provide directly to us when you create an account, post a listing, or communicate with us.
                                Your privacy and security are our top priorities.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase tracking-widest text-xs">2. Data Usage</h2>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                Your data is used exclusively to provide and improve our services, facilitate transactions,
                                and ensure the safety and integrity of our marketplace community.
                            </p>
                        </section>
                    </div>
                </div>
            </Container>
        </main>
    )
}
