import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { getTranslationServer } from '@/lib/i18n/server'
import { Button } from '@/components/ui/button'

export default async function ContactPage() {
  const { t } = await getTranslationServer()

  return (
    <main className="min-h-screen pb-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <Container className="pt-32 md:pt-40 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[1.05] mb-8 font-heading">
            {t.contact.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            {[
              {
                icon: <Mail className="w-6 h-6 text-primary" />,
                title: t.contact.email,
                values: ['info@slovor.sk', 'support@slovor.sk']
              },
              {
                icon: <Phone className="w-6 h-6 text-blue-500" />,
                title: t.contact.phone,
                values: ['+421 2 123 456 78'],
                extra: 'Mon-Fri: 9:00 - 17:00'
              },
              {
                icon: <MapPin className="w-6 h-6 text-emerald-500" />,
                title: t.contact.office,
                values: ['Slovor Marketplace s.r.o.', 'Námestie slobody 1', '811 06 Bratislava']
              }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all group">
                <div className="mb-6 bg-muted/50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">{item.title}</h3>
                {item.values.map((v, j) => (
                  <p key={j} className="text-lg font-bold text-foreground leading-relaxed">{v}</p>
                ))}
                {item.extra && <p className="text-sm font-medium text-muted-foreground mt-2">{item.extra}</p>}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-10 md:p-12 rounded-[2.5rem] bg-card/60 backdrop-blur-md border border-border/50 shadow-premium relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

              <h2 className="text-3xl font-black text-white mb-8 italic font-heading tracking-tight">{t.contact.sendMessage}</h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">{t.contact.name}</label>
                    <input
                      type="text"
                      className="w-full bg-muted/30 border border-border/50 rounded-2xl py-4 px-6 text-foreground font-bold focus:outline-none focus:border-primary focus:bg-muted/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">Email</label>
                    <input
                      type="email"
                      className="w-full bg-muted/30 border border-border/50 rounded-2xl py-4 px-6 text-foreground font-bold focus:outline-none focus:border-primary focus:bg-muted/50 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">{t.contact.message}</label>
                  <textarea
                    rows={5}
                    className="w-full bg-muted/30 border border-border/50 rounded-2xl py-4 px-6 text-foreground font-bold focus:outline-none focus:border-primary focus:bg-muted/50 transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button size="lg" className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 group">
                  {t.contact.send}
                  <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
