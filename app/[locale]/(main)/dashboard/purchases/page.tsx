'use client'

import { DashboardFeaturePlaceholder } from '@/components/seller-profile/feature-placeholder'
import { ShoppingBag } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function PurchasesPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8 shadow-sm md:p-10">
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
            {t('purchases:title')}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {t('purchases:description')}
          </p>
        </div>
      </div>

      <DashboardFeaturePlaceholder
        title={t('purchases.title')}
        description={t('purchases.description')}
        icon={ShoppingBag}
      />
    </div>
  )
}
