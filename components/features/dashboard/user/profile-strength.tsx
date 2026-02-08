'use client'

import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

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
    <div className="bg-card border-border relative overflow-hidden rounded-3xl border p-6 shadow-md">
      <div className="from-primary/10 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-50" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-lg font-bold tracking-tight uppercase">
            {t('profile:strengthTitle', {
              ns: 'profile',
              defaultValue: 'Profile Strength',
            })}
          </h3>
          <span className="text-primary font-black">{percentage}%</span>
        </div>

        <Progress value={percentage} className="h-2" />

        <div className="space-y-2 pt-2">
          {missingFields.length === 0 ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm italic">
              <CheckCircle2 className="text-primary h-4 w-4" />
              <span>
                {t('profile:allSet', { defaultValue: "You're all set!" })}
              </span>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground/80 text-xs font-bold tracking-widest uppercase">
                {t('profile:completeToBoost', {
                  defaultValue: 'Complete to boost visibility:',
                })}
              </p>
              <ul className="space-y-1">
                {missingFields.map((field) => (
                  <li
                    key={field}
                    className="text-muted-foreground flex items-center gap-2 text-sm"
                  >
                    <Circle className="h-3 w-3 opacity-50" />
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
