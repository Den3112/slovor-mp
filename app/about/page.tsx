import { Container } from '@/components/ui/container'

export default function AboutPage() {
    return (
        <div className="py-20 lg:py-32 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
            </div>

            <Container>
                <div className="max-w-3xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                            About Slovor Marketplace
                        </h1>
                        <p className="text-xl text-zinc-400">
                            Slovakia's most modern platform for buying and selling locally.
                        </p>
                    </div>

                    <div className="prose prose-invert prose-zinc max-w-none space-y-8 text-zinc-300">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                            <p>
                                At Slovor, we believe that buying and selling locally should be beautiful, safe, and effortless.
                                We've built a platform that combines state-of-the-art technology with an intuitive user experience
                                to connect communities across Slovakia.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Why Slovor?</h2>
                            <p>
                                Unlike traditional classifieds sites, Slovor focuses on the experience. From our "Avant-Garde"
                                design system to our lightning-fast search fueled by modern tech stack, every detail is crafted
                                to help you find what you need and sell what you don't.
                            </p>
                        </section>

                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <h3 className="text-white font-bold mb-2">Built for Slovakia</h3>
                            <p className="text-sm">
                                Slovor is 100% focused on the Slovak market. We support local languages,
                                regions, and currencies to ensure a seamless experience for all our users.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

function Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`container mx-auto px-4 ${className}`}>
            {children}
        </div>
    )
}
