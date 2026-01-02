import { Container } from '@/components/ui/container'
import { Shield, Clock } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      <Container className="pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
              <Shield className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="font-heading text-4xl font-black italic tracking-tight text-foreground md:text-5xl">
                Privacy Policy
              </h1>
              <div className="mt-1 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <Clock className="h-4 w-4" />
                Updated: December 26, 2025
              </div>
            </div>
          </div>

          <div className="shadow-premium prose prose-invert prose-zinc max-w-none rounded-[2.5rem] border border-border/50 bg-card/40 p-8 backdrop-blur-md md:p-12">
            <section className="mb-12">
              <h2 className="mb-4 text-2xl text-xs font-black uppercase tracking-tight tracking-widest text-white">
                1. Information Collection
              </h2>
              <p className="text-lg leading-relaxed text-zinc-400">
                We collect information you provide directly to us when you
                create an account, post a listing, or communicate with us. Your
                privacy and security are our top priorities.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl text-xs font-black uppercase tracking-tight tracking-widest text-white">
                2. Data Usage
              </h2>
              <p className="text-lg leading-relaxed text-zinc-400">
                Your data is used exclusively to provide and improve our
                services, facilitate transactions, and ensure the safety and
                integrity of our marketplace community.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  )
}
