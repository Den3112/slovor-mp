import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslationServer(['contact'])
  return {
    title: t('contact:title'),
    description: t('contact:subtitle'),
  }
}

export default async function ContactPage() {
  const { t } = await getTranslationServer(['common', 'contact'])

  return (
    <main className="bg-background relative min-h-screen pb-24">
      <Container className="relative z-10 pt-32 md:pt-40">
        <div className="animate-in fade-in slide-in-from-top-4 mx-auto mb-20 max-w-4xl text-center duration-700">
          <h1 className="font-heading text-foreground mb-8 text-6xl leading-[1.05] font-bold tracking-tight uppercase md:text-8xl">
            {t('contact:title')}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed font-medium md:text-2xl">
            {t('contact:subtitle')}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Contact Info */}
          <div className="space-y-6 lg:col-span-5">
            {[
              {
                icon: <Mail className="text-primary h-6 w-6" />,
                title: t('contact:email'),
                values: ['info@slovor.sk', 'support@slovor.sk'],
              },
              {
                icon: <Phone className="h-6 w-6 text-blue-500" />,
                title: t('contact:phone'),
                values: ['+421 2 123 456 78'],
                extra: t('contact:workingHours'),
              },
              {
                icon: <MapPin className="h-6 w-6 text-emerald-500" />,
                title: t('contact:office'),
                values: [
                  'Slovor Marketplace s.r.o.',
                  'Námestie slobody 1',
                  '811 06 Bratislava',
                ],
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group border-border bg-card hover:border-primary/30 rounded-2xl border p-8 shadow-sm transition-all"
              >
                <div className="bg-muted border-border group-hover:bg-primary group-hover:text-primary-foreground mb-6 flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-muted-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {item.title}
                </h3>
                {item.values.map((v, j) => (
                  <p
                    key={j}
                    className="text-foreground text-lg leading-relaxed font-bold uppercase"
                  >
                    {v}
                  </p>
                ))}
                {item.extra && (
                  <p className="text-muted-foreground mt-2 text-sm font-bold tracking-widest uppercase opacity-60">
                    {item.extra}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-card border-border h-full rounded-2xl border p-10 shadow-sm md:p-12">
              <h2 className="font-heading text-foreground mb-8 text-3xl font-bold tracking-tight uppercase">
                {t('contact:sendMessage')}
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                      {t('contact:name')}
                    </label>
                    <Input
                      type="text"
                      className="border-border bg-muted text-foreground focus-visible:border-primary focus-visible:ring-primary/5 h-14 w-full rounded-xl border px-6 py-4 font-bold shadow-none transition-all focus-visible:ring-4"
                      placeholder={t('contact:placeholderName')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                      {t('contact:emailLabel')}
                    </label>
                    <Input
                      type="email"
                      className="border-border bg-muted text-foreground focus-visible:border-primary focus-visible:ring-primary/5 h-14 w-full rounded-xl border px-6 py-4 font-bold shadow-none transition-all focus-visible:ring-4"
                      placeholder={t('contact:placeholderEmail')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground ml-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                    {t('contact:message')}
                  </label>
                  <Textarea
                    rows={5}
                    className="border-border bg-muted text-foreground focus-visible:border-primary focus-visible:ring-primary/5 min-h-[120px] w-full resize-none rounded-xl border px-6 py-4 font-bold shadow-none transition-all focus-visible:ring-4"
                    placeholder={t('contact:placeholderMessage')}
                  />
                </div>

                <Button
                  size="xl"
                  className="w-full rounded-xl font-bold tracking-widest uppercase shadow-sm"
                >
                  {t('contact:send')}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
