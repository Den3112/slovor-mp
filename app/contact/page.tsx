import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { Button } from '@/components/ui/button'

export default async function ContactPage() {
  const { t } = await getTranslationServer()

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      {/* Background Orbs */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-500/5 blur-[120px]" />

      <Container className="relative z-10 pt-32 md:pt-40">
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <h1 className="mb-8 font-heading text-6xl font-black leading-[1.05] tracking-tight text-foreground md:text-8xl">
            {t.contact.title}
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-muted-foreground md:text-2xl">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Contact Info */}
          <div className="space-y-6 lg:col-span-5">
            {[
              {
                icon: <Mail className="h-6 w-6 text-primary" />,
                title: t.contact.email,
                values: ['info@slovor.sk', 'support@slovor.sk'],
              },
              {
                icon: <Phone className="h-6 w-6 text-blue-500" />,
                title: t.contact.phone,
                values: ['+421 2 123 456 78'],
                extra: 'Mon-Fri: 9:00 - 17:00',
              },
              {
                icon: <MapPin className="h-6 w-6 text-emerald-500" />,
                title: t.contact.office,
                values: [
                  'Slovor Marketplace s.r.o.',
                  'Námestie slobody 1',
                  '811 06 Bratislava',
                ],
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-[2rem] border border-border/50 bg-card/40 p-8 backdrop-blur-sm transition-all hover:border-primary/30"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  {item.icon}
                </div>
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {item.title}
                </h3>
                {item.values.map((v, j) => (
                  <p
                    key={j}
                    className="text-lg font-bold leading-relaxed text-foreground"
                  >
                    {v}
                  </p>
                ))}
                {item.extra && (
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    {item.extra}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="shadow-premium relative h-full overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/60 p-10 backdrop-blur-md md:p-12">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />

              <h2 className="mb-8 font-heading text-3xl font-black italic tracking-tight text-white">
                {t.contact.sendMessage}
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-primary">
                      {t.contact.name}
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-2xl border border-border/50 bg-muted/30 px-6 py-4 font-bold text-foreground transition-all focus:border-primary focus:bg-muted/50 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-primary">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-2xl border border-border/50 bg-muted/30 px-6 py-4 font-bold text-foreground transition-all focus:border-primary focus:bg-muted/50 focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-primary">
                    {t.contact.message}
                  </label>
                  <textarea
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-border/50 bg-muted/30 px-6 py-4 font-bold text-foreground transition-all focus:border-primary focus:bg-muted/50 focus:outline-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button
                  size="lg"
                  className="group h-16 w-full rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
                >
                  {t.contact.send}
                  <Send className="ml-2 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
