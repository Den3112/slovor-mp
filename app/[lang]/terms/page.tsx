import { Container } from '@/components/ui/container'
import { FileText, Clock } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { getTranslationServer } from '@/lib/i18n/server'

export default async function TermsPage() {
  const { t } = await getTranslationServer()
  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      <Container className="pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
              <FileText className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1">
              <Breadcrumbs
                items={[{ label: t('footer.terms') || 'Terms of Service' }]}
              />
              <h1 className="font-heading text-foreground text-4xl font-black tracking-tight italic md:text-5xl">
                Terms of Service
              </h1>
              <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm font-bold">
                <Clock className="h-4 w-4" />
                Updated: December 26, 2025
              </div>
            </div>
          </div>

          <div className="shadow-premium prose prose-invert prose-zinc border-border/50 bg-card/40 max-w-none rounded-[2.5rem] border p-8 backdrop-blur-md md:p-12">
            <section className="mb-12">
              <h2 className="mb-4 text-xs font-black tracking-widest text-white uppercase">
                1. Acceptance of Terms
              </h2>
              <p className="text-lg leading-relaxed text-zinc-400">
                By accessing and using Slovor Marketplace, you agree to be bound
                by these Terms of Service. Our platform is designed to provide a
                premium and safe environment for all users.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-4 text-xs font-black tracking-widest text-white uppercase">
                2. Use of Platform
              </h2>
              <p className="text-lg leading-relaxed text-zinc-400">
                You agree to use our platform for lawful purposes only and in a
                way that does not infringe the rights of others. Harassment,
                spam, and fraudulent behavior are strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xs font-black tracking-widest text-white uppercase">
                3. Listings
              </h2>
              <p className="text-lg leading-relaxed text-zinc-400">
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
