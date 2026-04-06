'use client'

import { Progress } from '@/shared/ui/progress'
import { CheckCircle2, Circle, Trophy } from 'lucide-react'
import { useTranslation } from '@/shared/lib/i18n'

interface ProfileStrengthProps {
  percentage: number
  missingFields: string[]
}

export function ProfileStrength({
  percentage,
  missingFields,
}: ProfileStrengthProps) {
  const { t } = useTranslation(['profile'])

  return (
    <div className="bg-card group border-border flex flex-col justify-between overflow-hidden rounded-2xl border p-8 shadow-md">
      <div className="flex items-start justify-between">
        <div className="bg-primary/5 border-primary/5 flex h-14 w-14 items-center justify-center rounded-xl border shadow-inner transition-all duration-500 group-hover:scale-110">
          <Trophy className="text-primary h-7 w-7 stroke-[2.5]" />
        </div>
        <div className="bg-muted text-foreground flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase shadow-sm">
          {percentage}% {t('profileStrength:complete')}
        </div>
      </div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-primary/40 text-[10px] font-black tracking-[0.25em] uppercase">
            {t('profile:strengthTitle', {
              ns: 'profile',
              defaultValue: 'Profile Strength',
            })}
          </h3>
          <span className="text-primary text-2xl font-black tracking-tighter">
            {percentage}%
          </span>
        </div>

        <Progress value={percentage} className="bg-primary/10 h-3" />

        <div className="space-y-3 pt-2">
          {missingFields.length === 0 ? (
            <div className="bg-success/5 border-success/10 text-success flex items-center gap-3 rounded-2xl border p-4 text-xs font-black tracking-tight uppercase">
              <CheckCircle2 className="h-4 w-4 stroke-3" />
              <span>
                {t('profile:allSet', { defaultValue: "You're all set!" })}
              </span>
            </div>
          ) : (
            <>
              <p className="text-primary/30 pl-1 text-[9px] font-black tracking-[0.2em] uppercase">
                {t('profile:completeToBoost', {
                  defaultValue: 'Complete to boost visibility:',
                })}
              </p>
              <ul className="grid gap-2">
                {missingFields.map((field) => (
                  <li
                    key={field}
                    className="glass-panel border-primary/5 bg-primary/5 text-foreground/60 hover:border-primary/20 flex items-center gap-3 rounded-xl border p-3.5 text-[11px] font-black tracking-tight uppercase transition-colors"
                  >
                    <Circle className="text-primary/20 h-3 w-3 stroke-3" />
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
