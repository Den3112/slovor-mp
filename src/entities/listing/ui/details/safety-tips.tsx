'use client'

import { ShieldAlert, Handshake, ShieldCheck, HelpCircle } from 'lucide-react'
import { useTranslation } from '@/shared/lib/i18n'

export function SafetyTips() {
  const { t } = useTranslation(['common', 'listing'])

  const tips = [
    {
      icon: Handshake,
      title: 'Osobné stretnutie',
      description:
        'Uprednostnite osobné prevzatie tovaru na verejnom a bezpečnom mieste.',
      color: 'text-blue-500',
    },
    {
      icon: ShieldCheck,
      title: 'Platba pri prevzatí',
      description:
        'Nikdy neposielajte peniaze vopred neznámym osobám bez záruky.',
      color: 'text-emerald-500',
    },
    {
      icon: ShieldAlert,
      title: 'Buďte obozretní',
      description:
        'Ak ponuka znie až príliš dobre, aby to bola pravda, zvyčajne nie je.',
      color: 'text-amber-500',
    },
  ]

  return (
    <div className="bg-muted/30 border-border space-y-4 rounded-2xl border border-dashed p-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="text-primary h-5 w-5" />
        <h4 className="text-sm font-black tracking-tight uppercase">
          {t('listing:safetyTips')}
        </h4>
      </div>

      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-3">
            <div className={`mt-0.5 shrink-0 ${tip.color}`}>
              <tip.icon className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] leading-none font-black tracking-tight uppercase">
                {tip.title}
              </p>
              <p className="text-muted-foreground text-[11px] leading-tight">
                {tip.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border/40 border-t pt-2">
        <p className="text-muted-foreground text-[10px] leading-tight italic">
          Slovor marketplace nikdy nežiada vaše údaje o karte cez SMS alebo
          e-mail.
        </p>
      </div>
    </div>
  )
}
