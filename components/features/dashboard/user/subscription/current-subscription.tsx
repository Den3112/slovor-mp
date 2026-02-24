'use client'

import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type { UserSubscription } from '@/lib/types/database'

interface CurrentSubscriptionProps {
  currentSub: UserSubscription
}

export function CurrentSubscription({ currentSub }: CurrentSubscriptionProps) {
  const { t } = useTranslation(['dashboard'])

  return (
    <div
      className={cn(
        'glass-panel relative overflow-hidden rounded-[2.5rem] border-none p-10',
        currentSub.plan_type === 'free'
          ? 'bg-blue-500/3'
          : 'bg-primary/3'
      )}
    >
      <div className="flex gap-4">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-xl',
            currentSub.plan_type === 'free'
              ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
              : 'border-primary/20 bg-primary/10 text-primary'
          )}
        >
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-1">
          <p
            className={cn(
              'text-lg font-black tracking-tight',
              currentSub.plan_type === 'free'
                ? 'text-blue-400'
                : 'text-foreground'
            )}
          >
            {currentSub.plan_type === 'free'
              ? t('dashboard:subscriptions.upgradePrompt')
              : t('dashboard:subscriptions.currentPlanInfo', {
                plan: currentSub.plan_type.toUpperCase(),
              })}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <p
              className={cn(
                'text-[10px] font-black tracking-widest uppercase',
                currentSub.plan_type === 'free'
                  ? 'text-blue-500'
                  : 'text-primary'
              )}
            >
              {t('dashboard:subscriptions.currentLabel', {
                plan: currentSub.plan_type.toUpperCase(),
              })}
            </p>
            {currentSub.current_period_end && (
              <p className="text-muted-foreground/40 text-[10px] font-black tracking-[0.3em] uppercase">
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
  )
}
