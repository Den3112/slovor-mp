'use client'

import { DashboardFeaturePlaceholder } from '@/components/profile/feature-placeholder'
import { ShoppingBag } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function PurchasesPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="from-background/80 via-background/60 to-background/40 group relative flex flex-col gap-4 overflow-hidden rounded-5xl border border-white/10 bg-linear-to-br p-6 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
          <h1 className="font-heading text-foreground mb-2 text-4xl font-black tracking-tight md:text-5xl">
            {t.purchases.title}
          </h1>
          <p className="text-muted-foreground max-w-lg text-base leading-relaxed font-medium md:text-lg">
            {t.purchases.description}
          </p>
        </div>
      </div>

      <DashboardFeaturePlaceholder
        title={t.purchases.title}
        description={t.purchases.description}
        icon={ShoppingBag}
      />
    </div>
  )
}
