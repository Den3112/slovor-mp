import { Container } from '@/components/ui/container'
import { FileText, Clock } from 'lucide-react'

export default function TermsPage() {
    return (
        <main className="min-h-screen pb-24 relative overflow-hidden">
            <Container className="pt-32 md:pt-40">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground font-heading italic">
                                Terms of Service
                            </h1>
                            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mt-1">
                                <Clock className="w-4 h-4" />
                                Updated: December 26, 2025
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-card/40 backdrop-blur-md border border-border/50 shadow-premium prose prose-invert max-w-none prose-zinc">
                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase tracking-widest text-xs">1. Acceptance of Terms</h2>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                By accessing and using Slovor Marketplace, you agree to be bound by these Terms of Service.
                                Our platform is designed to provide a premium and safe environment for all users.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase tracking-widest text-xs">2. Use of Platform</h2>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                You agree to use our platform for lawful purposes only and in a way that does not infringe the rights of others.
                                Harassment, spam, and fraudulent behavior are strictly prohibited.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase tracking-widest text-xs">3. Listings</h2>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                Users are responsible for the content of their listings. We reserve the right to remove any content that violates our policies or compromises the quality of the marketplace.
                            </p>
                        </section>
                    </div>
                </div>
            </Container>
        </main>
    )
}
