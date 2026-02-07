import { Container } from '@/components/ui/container'
import { Shield, Clock } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { getTranslationServer } from '@/lib/i18n/server'

export default async function PrivacyPage() {
  const { t } = await getTranslationServer()
  return (
    <main className="bg-background relative min-h-screen pb-24">
      <Container className="pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl">
          <div className="animate-in fade-in slide-in-from-top-4 mb-12 flex items-center gap-6 duration-700">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
              <Shield className="h-7 w-7 text-emerald-500" />
            </div>
            <div className="flex-1">
              <Breadcrumbs
                items={[{ label: t('footer:privacy') || 'Privacy Policy' }]}
              />
              <h1 className="font-heading text-foreground text-4xl font-bold tracking-tight uppercase md:text-6xl">
                Privacy Policy
              </h1>
              <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <Clock className="h-3.5 w-3.5" />
                Updated: December 26, 2025
              </div>
            </div>
          </div>

          <div className="bg-card border-border prose prose-invert prose-zinc max-w-none rounded-2xl border p-8 shadow-sm md:p-12">
            <section className="mb-12">
              <h2 className="text-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                1. Data Collection
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We collect information you provide directly to us when you
                create an account, post a listing, or communicate with other
                users. This includes your name, email, and location.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                2. Use of Information
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The data we collect is used to facilitate transactions, improve
                our services, and ensure a safe trading environment. We do not
                sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                3. Security
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We use industry-standard security measures to protect your data.
                However, no method of transmission over the internet is 100%
                secure, and we cannot guarantee absolute security.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  )
}
