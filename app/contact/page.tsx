import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { Button } from '@/components/ui/button'

export default async function ContactPage() {
  const { t } = await getTranslationServer()

  return (
    <main className="relative min-h-screen pb-24 bg-black">
      {/* Architectural Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <Container className="relative z-10 pt-32 md:pt-48">
        <div className="mx-auto mb-24 max-w-4xl text-center">
          <h1 className="mb-10 font-heading text-6xl font-black italic leading-[0.9] tracking-tighter text-white md:text-9xl">
            {t.contact.title}
          </h1>
          <p className="mx-auto max-w-2xl font-sans text-xl font-medium tracking-wide text-zinc-500 leading-relaxed md:text-2xl">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Contact Info */}
          <div className="space-y-8 lg:col-span-5">
            {[
              {
                icon: <Mail className="h-6 w-6 text-primary" />,
                title: t.contact.email,
                values: ['info@slovor.sk', 'support@slovor.sk'],
              },
              {
                icon: <Phone className="h-6 w-6 text-primary" />,
                title: t.contact.phone,
                values: ['+421 2 123 456 78'],
                extra: 'Mon-Fri: 9:00 - 17:00',
              },
              {
                icon: <MapPin className="h-6 w-6 text-primary" />,
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
                className="group border-2 border-primary/10 bg-zinc-950 p-10 transition-all hover:border-primary hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)]"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center border-2 border-primary/20 bg-primary/5 transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="mb-6 font-sans text-xs font-black uppercase tracking-[0.3em] text-zinc-500">
                  {item.title}
                </h3>
                {item.values.map((v, j) => (
                  <p
                    key={j}
                    className="font-sans text-lg font-bold leading-relaxed text-white tracking-wide"
                  >
                    {v}
                  </p>
                ))}
                {item.extra && (
                  <p className="mt-4 font-sans text-[10px] font-bold uppercase tracking-widest text-primary/60">
                    {item.extra}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="relative h-full border-2 border-primary/20 bg-zinc-950 p-10 md:p-20 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)]">
              <h2 className="mb-12 font-heading text-5xl font-black italic tracking-tight text-white">
                {t.contact.sendMessage}
              </h2>

              <form className="space-y-10">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  <div className="space-y-4">
                    <label className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                      {t.contact.name}
                    </label>
                    <input
                      type="text"
                      className="w-full border-b-2 border-primary/10 bg-transparent py-4 font-sans text-lg font-bold text-white transition-all focus:border-primary focus:outline-none placeholder:text-zinc-800"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full border-b-2 border-primary/10 bg-transparent py-4 font-sans text-lg font-bold text-white transition-all focus:border-primary focus:outline-none placeholder:text-zinc-800"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    {t.contact.message}
                  </label>
                  <textarea
                    rows={5}
                    className="w-full resize-none border-2 border-primary/10 bg-zinc-900/30 p-8 font-sans text-lg font-bold text-white transition-all focus:border-primary focus:outline-none placeholder:text-zinc-800"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button
                  size="lg"
                  className="group h-20 w-full rounded-none font-sans text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20"
                >
                  {t.contact.send}
                  <Send className="ml-4 h-5 w-5 transition-transform group-hover:-translate-y-2 group-hover:translate-x-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
