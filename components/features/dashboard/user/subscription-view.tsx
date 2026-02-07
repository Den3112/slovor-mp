'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import {
  Zap,
  Check,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Gem,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { subscriptionsApi } from '@/lib/api'
import { toast } from 'sonner'
import type { UserSubscription } from '@/lib/types/database'

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

  const plans = [
    {
      id: 'free',
      name: t('dashboard:subscriptions.plans.free.name'),
      price: '0',
      duration: t('dashboard:subscriptions.plans.free.duration'),
      description: t('dashboard:subscriptions.plans.free.description'),
      icon: Sparkles,
      color: 'slate',
      features: [
        'Up to 5 active listings',
        '5 photos per listing',
        'Listing duration: 14 days',
        'Standard support',
        'Basic search visibility',
      ],
      buttonText: t('dashboard:subscriptions.plans.free.cta'),
    },
    {
      id: 'pro',
      name: t('dashboard:subscriptions.plans.pro.name'),
      price: '14.99',
      period: t('dashboard:subscriptions.plans.pro.period'),
      description: t('dashboard:subscriptions.plans.pro.description'),
      icon: Zap,
      color: 'blue',
      highlight: true,
      features: [
        'Up to 50 active listings',
        '15 photos per listing',
        'Listing duration: 30 days',
        'Priority support',
        '2x Search visibility boost',
        'PRO badge on profile',
        'Basic analytics',
      ],
      buttonText: t('dashboard:subscriptions.plans.pro.cta'),
    },
    {
      id: 'business',
      name: t('dashboard:subscriptions.plans.business.name'),
      price: '39.99',
      period: t('dashboard:subscriptions.plans.business.period'),
      description: t('dashboard:subscriptions.plans.business.description'),
      icon: Gem,
      color: 'amber',
      features: [
        'Unlimited active listings',
        '30 photos per listing',
        'Unlimited listing duration',
        'Dedicated account manager',
        '5x Search visibility boost',
        'BUSINESS verified badge',
        'Advanced sales analytics',
        'API access',
      ],
      buttonText: t('dashboard:subscriptions.plans.business.cta'),
    },
  ]

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
      <div className="bg-card border-border flex flex-col gap-2 rounded-lg border p-6 shadow-sm">
        <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
          {t('profile:subscription')}
        </h1>
        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
          {t('dashboard:subscriptions.subtitle')}
        </p>
      </div>

      {/* Current Plan Indicator */}
      <div
        className={cn(
          'rounded-lg border p-4 transition-all',
          currentSub.plan_type === 'free'
            ? 'border-blue-200 bg-blue-500/5 dark:border-blue-900/50'
            : 'border-primary bg-primary/5 shadow-sm'
        )}
      >
        <div className="flex gap-3">
          <AlertCircle
            className={cn(
              'h-5 w-5 shrink-0',
              currentSub.plan_type === 'free'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-primary'
            )}
          />
          <div className="flex-1">
            <p
              className={cn(
                'text-sm font-bold',
                currentSub.plan_type === 'free'
                  ? 'text-blue-900 dark:text-blue-300'
                  : 'text-foreground'
              )}
            >
              {currentSub.plan_type === 'free'
                ? t('dashboard:subscriptions.upgradePrompt')
                : t('dashboard:subscriptions.currentPlanInfo', {
                    plan: currentSub.plan_type.toUpperCase(),
                  })}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <p
                className={cn(
                  'text-[10px] font-bold tracking-widest uppercase',
                  currentSub.plan_type === 'free'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-primary'
                )}
              >
                {t('dashboard:subscriptions.currentLabel', {
                  plan: currentSub.plan_type.toUpperCase(),
                })}
              </p>
              {currentSub.current_period_end && (
                <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                  {t('dashboard:subscriptions.endsOn', {
                    date: new Date(
                      currentSub.current_period_end
                    ).toLocaleDateString(),
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentSub.plan_type === plan.id
          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col overflow-hidden rounded-lg border transition-all duration-300',
                plan.highlight && !isCurrent
                  ? 'border-primary bg-primary/5 shadow-primary/5 scale-[1.02] shadow-lg'
                  : isCurrent
                    ? 'border-primary/40 bg-card ring-primary/20 shadow-sm ring-1'
                    : 'border-border bg-card hover:border-primary/50'
              )}
            >
              {/* Plan Header */}
              <div className="space-y-6 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-lg border',
                      plan.color === 'blue'
                        ? 'border-blue-200 bg-blue-500/10 text-blue-600 dark:border-blue-900'
                        : plan.color === 'amber'
                          ? 'border-amber-200 bg-amber-500/10 text-amber-600 dark:border-amber-900'
                          : 'border-slate-200 bg-slate-500/10 text-slate-600 dark:border-slate-800'
                    )}
                  >
                    <plan.icon className="h-6 w-6" />
                  </div>
                  {isCurrent ? (
                    <Badge className="rounded bg-emerald-500 text-[9px] font-bold tracking-widest text-white uppercase">
                      {t('dashboard:subscriptions.active')}
                    </Badge>
                  ) : (
                    plan.highlight && (
                      <Badge className="bg-primary text-primary-foreground animate-pulse rounded text-[9px] font-bold tracking-widest uppercase">
                        {t('dashboard:subscriptions.mostPopular')}
                      </Badge>
                    )
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-foreground text-xl font-bold tracking-tight uppercase">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-bold">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-foreground text-4xl font-bold">
                    €{plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="border-border/50 mt-4 flex-1 border-t p-6 pt-0 md:p-8">
                <ul className="space-y-4 pt-6">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="text-foreground/80 flex items-center gap-3 text-sm font-bold"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                        <Check className="h-3 w-3 stroke-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plan Footer / CTA */}
              <div className="mt-auto p-6 pt-0 md:p-8">
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || isSubmitting !== null}
                  className={cn(
                    'h-12 w-full rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all',
                    isCurrent
                      ? 'bg-muted text-muted-foreground border-border hover:bg-muted cursor-default'
                      : plan.highlight
                        ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-md hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98]'
                  )}
                  variant={isCurrent ? 'outline' : 'default'}
                >
                  {isSubmitting === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrent ? (
                    plan.buttonText
                  ) : (
                    <>
                      {plan.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
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
