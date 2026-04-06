'use client'

import { Check, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/lib/i18n'
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
        'glass-panel hover:bg-primary/2 group relative flex flex-col overflow-hidden rounded-[2.5rem] border-none p-8 shadow-xl! shadow-black/5 transition-all duration-500 hover:scale-[1.02]',
        plan.highlight
          ? 'bg-primary/3 shadow-primary/20 shadow-2xl'
          : 'bg-white/2'
      )}
    >
      {/* Animated Background for Highlighted */}
      {plan.highlight && !isCurrent && (
        <div className="bg-primary/10 absolute -top-24 -right-24 -z-10 h-64 w-64 animate-pulse rounded-full blur-[100px]" />
      )}

      {/* Plan Header */}
      <div className="glass-panel relative overflow-hidden rounded-[2.5rem] border-none p-10">
        <div className="absolute inset-0 -z-10 bg-blue-500/3 blur-3xl" />
        <div className="bg-primary/3 absolute inset-0 -z-10" />
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'relative flex h-16 w-16 items-center justify-center rounded-[1.25rem] border shadow-2xl',
              plan.color === 'blue'
                ? 'border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-blue-500/20'
                : plan.color === 'amber'
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-amber-500/20'
                  : 'border-white/10 bg-white/5 text-white shadow-black/20'
            )}
          >
            <plan.icon className="h-8 w-8" />
          </div>
          {isCurrent ? (
            <Badge className="rounded-xl border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-[10px] font-black tracking-widest text-emerald-400 uppercase shadow-lg">
              {t('dashboard:subscriptions.active')}
            </Badge>
          ) : (
            plan.highlight && (
              <Badge className="bg-primary text-primary-foreground ring-background/50 absolute -top-2 -right-2 rotate-12 rounded-xl px-3 py-1 text-[10px] font-black tracking-widest uppercase shadow-xl ring-4">
                {t('dashboard:subscriptions.mostPopular')}
              </Badge>
            )
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-foreground text-2xl font-black tracking-tighter uppercase sm:text-3xl">
            {t(plan.nameKey)}
          </h3>
          <p className="text-muted-foreground/60 text-xs leading-relaxed font-bold tracking-tight">
            {t(plan.descriptionKey)}
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-foreground text-5xl font-black tracking-tighter">
            €{plan.price}
          </span>
          {(plan.periodKey || plan.durationKey) && (
            <p className="text-primary/40 text-[10px] font-black tracking-widest uppercase">
              {t(plan.periodKey || plan.durationKey || '')}
            </p>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className="border-border/5 mt-auto flex-1 border-t p-8 pt-0">
        <ul className="space-y-5 pt-8">
          {plan.features.map((feature, idx) => (
            <li
              key={idx}
              className="text-foreground/80 flex items-start gap-4 text-[13px] font-bold tracking-tight"
            >
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10">
                <Check className="text-primary h-4 w-4 stroke-4" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Plan Footer / CTA */}
      <div className="p-8 pt-0">
        <Button
          onClick={() => onUpgrade(plan.id)}
          disabled={isCurrent || isSubmitting}
          className={cn(
            'group h-14 w-full rounded-[1.25rem] text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500',
            isCurrent
              ? 'bg-muted/30 text-muted-foreground/40 border-border/10 cursor-default opacity-50'
              : plan.highlight
                ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-2xl hover:scale-[1.05] active:scale-[0.98]'
                : 'bg-foreground text-background hover:bg-foreground/90 shadow-xl shadow-black/20 hover:scale-[1.05] active:scale-[0.98]'
          )}
          variant={isCurrent ? 'outline' : 'default'}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isCurrent ? (
            t(plan.buttonTextKey)
          ) : (
            <>
              {t(plan.buttonTextKey)}
              <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
