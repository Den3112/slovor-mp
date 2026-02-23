'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { subscriptionsApi } from '@/lib/api'
import { toast } from 'sonner'
import type { UserSubscription } from '@/lib/types/database'
import { SUBSCRIPTION_PLANS } from './plans-config'
import { PlanCard } from './plan-card'
import { CurrentSubscription } from './current-subscription'

interface SubscriptionViewProps {
  currentSubscription: UserSubscription
}

export function SubscriptionView({
  currentSubscription: initialSubscription,
}: SubscriptionViewProps) {
  const { t } = useTranslation(['common', 'profile', 'dashboard'])
  const [currentSub, setCurrentSub] =
    useState<UserSubscription>(initialSubscription)
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (planId === currentSub.plan_type) return

    setIsSubmitting(planId)
    try {
      const { data, error } = await subscriptionsApi.subscribe(planId as any)
      if (error) throw new Error(error)

      if (data) {
        setCurrentSub(data)
        toast.success(t('common:success'))
      }
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsSubmitting(null)
    }
  }

  return (
    <div className="animate-in fade-in space-y-8 duration-700">
      {/* Header Section */}
      <div className="bg-card border-border flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
        <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          {t('profile:subscription')}
        </h1>
        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
          {t('dashboard:subscriptions.subtitle')}
        </p>
      </div>

      <CurrentSubscription currentSub={currentSub} />

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={currentSub.plan_type === plan.id}
            isSubmitting={isSubmitting === plan.id}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>

      {/* Comparison Table Footer Info */}
      <div className="border-border mt-12 grid grid-cols-1 gap-8 border-t pt-12 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="text-foreground text-sm font-bold tracking-widest uppercase">
            {t('dashboard:subscriptions.whyUpgrade')}
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed font-bold">
            {t('dashboard:subscriptions.upgradeDesc')}
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-foreground text-sm font-bold tracking-widest uppercase">
            {t('dashboard:subscriptions.paymentSafety')}
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed font-bold">
            {t('dashboard:subscriptions.paymentSafetyDesc')}
          </p>
        </div>
      </div>
    </div>
  )
}
