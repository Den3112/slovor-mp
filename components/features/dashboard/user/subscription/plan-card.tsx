'use client'

import { Check, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import type { PlanConfig } from './plans-config'

interface PlanCardProps {
  plan: PlanConfig
  isCurrent: boolean
  isSubmitting: boolean
  onUpgrade: (planId: string) => void
}

export function PlanCard({
  plan,
  isCurrent,
  isSubmitting,
  onUpgrade,
}: PlanCardProps) {
  const { t } = useTranslation(['dashboard'])

  return (
    <div
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
            {t(plan.nameKey)}
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed font-bold">
            {t(plan.descriptionKey)}
          </p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-foreground text-4xl font-bold">
            €{plan.price}
          </span>
          {(plan.periodKey || plan.durationKey) && (
            <span className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
              {t(plan.periodKey || plan.durationKey || '')}
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
          onClick={() => onUpgrade(plan.id)}
          disabled={isCurrent || isSubmitting}
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
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isCurrent ? (
            t(plan.buttonTextKey)
          ) : (
            <>
              {t(plan.buttonTextKey)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
