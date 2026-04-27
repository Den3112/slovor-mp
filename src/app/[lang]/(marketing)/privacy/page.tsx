import { Container } from '@/shared/ui/container'
import { Shield, Clock } from 'lucide-react'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'
export const dynamic = 'force-static'
export const revalidate = 3600
import { getTranslationServer } from '@/shared/lib/i18n/server'

export default async function PrivacyPage() {
  const { t } = await getTranslationServer(['common', 'footer', 'legal'])
  return (
    <section className="bg-background relative min-h-screen pb-24">
      <Container className="pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl">
          <div className="animate-in fade-in slide-in-from-top-4 mb-12 flex items-center gap-6 duration-700">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <Shield className="h-7 w-7 text-emerald-500" />
            </div>
            <div className="flex-1">
              <Breadcrumbs
                items={[{ label: t('footer:privacy') || 'Privacy Policy' }]}
              />
              <h1 className="font-heading text-foreground text-4xl font-bold tracking-tight uppercase md:text-6xl">
                {t('legal:privacy.title')}
              </h1>
              <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                <Clock className="h-3.5 w-3.5" />
                {t('legal:privacy.updated')}
              </div>
            </div>
          </div>

          <div className="bg-card border-border prose prose-invert prose-zinc max-w-none rounded-2xl border p-8 shadow-sm md:p-12">
            <section className="mb-12">
              <h2 className="text-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                {t('legal:privacy.collectionTitle')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('legal:privacy.collectionText')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                {t('legal:privacy.useTitle')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('legal:privacy.useText')}
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                {t('legal:privacy.securityTitle')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('legal:privacy.securityText')}
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  )
}
