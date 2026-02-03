import { Container } from '@/components/ui/container'
import { FileText, Clock } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { getTranslationServer } from '@/lib/i18n/server'

export default async function TermsPage() {
  const { t } = await getTranslationServer()
  return (
    <main className="relative min-h-screen bg-background pb-24">
      <Container className="pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20">
              <FileText className="text-primary h-7 w-7" />
            </div>
            <div className="flex-1">
              <Breadcrumbs
                items={[{ label: t('footer.terms') || 'Terms of Service' }]}
              />
              <h1 className="font-heading text-foreground text-4xl font-black tracking-tight italic md:text-6xl uppercase">
                Terms of Service
              </h1>
              <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Clock className="h-3.5 w-3.5" />
                Updated: December 26, 2025
              </div>
            </div>
          </div>

          <div className="bg-card border border-border prose prose-invert prose-zinc max-w-none rounded-xl p-8 md:p-12 shadow-sm">
            <section className="mb-12">
              <h2 className="mb-4 text-[10px] font-black tracking-[0.2em] text-foreground uppercase">
                1. Acceptance of Terms
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                By accessing and using Slovor Marketplace, you agree to be bound
                by these Terms of Service. Our platform is designed to provide a
                premium and safe environment for all users.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-4 text-[10px] font-black tracking-[0.2em] text-foreground uppercase">
                2. Use of Platform
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                You agree to use our platform for lawful purposes only and in a
                way that does not infringe the rights of others. Harassment,
                spam, and fraudulent behavior are strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-[10px] font-black tracking-[0.2em] text-foreground uppercase">
                3. Listings
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Users are responsible for the content of their listings. We
                reserve the right to remove any content that violates our
                policies or compromises the quality of the marketplace.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  )
}
