'use client'

import { useState } from 'react'
import { useTranslation } from '@/shared/lib/i18n'
import { supabase } from '@/shared/lib/supabase/client'
import { subscriptionsApi } from '@/shared/lib/api'
import { toast } from 'sonner'
import type { UserSubscription } from '@/shared/lib/types/database'
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
      const { data, error } = await subscriptionsApi.subscribe(
        supabase,
        planId as any
      )
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
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[2rem] p-8">
        <div className="bg-primary/5 absolute inset-0 -z-10 opacity-50 blur-3xl" />
        <div className="flex flex-col gap-2">
          <h1 className="text-foreground text-4xl font-black tracking-tighter uppercase">
            {t('profile:subscription')}
          </h1>
          <p className="text-muted-foreground/60 text-xs font-bold tracking-[0.3em] uppercase">
            {t('dashboard:subscriptions.subtitle')}
          </p>
        </div>
      </div>

      <CurrentSubscription currentSub={currentSub} />

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
      <div className="border-border/10 mt-16 grid grid-cols-1 gap-12 border-t pt-16 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="text-foreground text-[11px] font-black tracking-[0.4em] uppercase opacity-40">
            {t('dashboard:subscriptions.whyUpgrade')}
          </h4>
          <p className="text-muted-foreground/80 text-sm leading-relaxed font-bold tracking-tight">
            {t('dashboard:subscriptions.upgradeDesc')}
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-foreground text-[11px] font-black tracking-[0.4em] uppercase opacity-40">
            {t('dashboard:subscriptions.paymentSafety')}
          </h4>
          <p className="text-muted-foreground/80 text-sm leading-relaxed font-bold tracking-tight">
            {t('dashboard:subscriptions.paymentSafetyDesc')}
          </p>
        </div>
      </div>
    </div>
  )
}
