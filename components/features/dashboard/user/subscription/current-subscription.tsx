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
        'rounded-xl border p-4 transition-all',
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
  )
}
