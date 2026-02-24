'use client'

import { ShieldCheck, ShieldAlert, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface IdentityWidgetProps {
  isVerified: boolean
}

export function IdentityWidget({ isVerified }: IdentityWidgetProps) {
  const { t, locale } = useTranslation(['verification', 'profile'])

  return (
    <div
      className={cn(
        'glass-panel shadow-primary/5 relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500',
        isVerified
          ? 'border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/5'
          : 'border-primary/10 bg-background/20 hover:shadow-primary/10'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-[1.25rem] border shadow-inner transition-transform duration-700 hover:scale-110',
              isVerified
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                : 'border-primary/5 bg-primary/5 text-primary/20'
            )}
          >
            {isVerified ? (
              <ShieldCheck className="h-7 w-7 stroke-3" />
            ) : (
              <ShieldAlert className="h-7 w-7 stroke-3" />
            )}
          </div>
          <div>
            <h3 className="text-primary/40 pl-1 text-[10px] font-black tracking-widest uppercase">
              {t('verification:idTitle', { defaultValue: 'Identity' })}
            </h3>
            <p
              className={cn(
                'text-xl font-black tracking-tighter uppercase',
                isVerified ? 'text-emerald-500' : 'text-foreground/60'
              )}
            >
              {isVerified
                ? t('verification:verified', { defaultValue: 'Verified' })
                : t('verification:notVerified', {
                    defaultValue: 'Not Verified',
                  })}
            </p>
          </div>
        </div>

        {!isVerified && (
          <Link href={`/${locale}/dashboard/verification`}>
            <div className="border-border/40 bg-primary/5 hover:bg-primary group/btn flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:text-white active:scale-95">
              <ChevronRight className="h-5 w-5 stroke-3 transition-transform group-hover/btn:translate-x-0.5" />
            </div>
          </Link>
        )}
      </div>

      <p className="text-foreground/40 mt-6 text-[11px] leading-relaxed font-black tracking-tight uppercase">
        {isVerified
          ? t('verification:verifiedDesc', {
              defaultValue:
                'Your identity is verified. You have full access to all platform features.',
            })
          : t('verification:notVerifiedDesc', {
              defaultValue:
                'Verify your identity to increase trust and unlock higher limits.',
            })}
      </p>
    </div>
  )
}
