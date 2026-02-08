'use client'

import { Button } from '@/components/ui/button'
import { ShieldCheck, ShieldAlert } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

interface IdentityWidgetProps {
  isVerified: boolean
}

export function IdentityWidget({ isVerified }: IdentityWidgetProps) {
  const { t } = useTranslation(['trust'])

  if (isVerified) {
    return (
      <div className="bg-card border-border relative overflow-hidden rounded-3xl border p-6 shadow-md">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-500 ring-4 ring-blue-500/10">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-foreground text-lg font-bold tracking-tight uppercase">
              {t('trust:verifiedIdentity', {
                defaultValue: 'Verified Identity',
              })}
            </h3>
            <p className="text-muted-foreground text-xs font-medium">
              {t('trust:trustedMember', {
                defaultValue: 'You are a trusted member.',
              })}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border-border relative overflow-hidden rounded-3xl border p-6 shadow-md transition-all hover:border-amber-500/30">
      <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-transparent opacity-50" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 ring-4 ring-amber-500/10">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-foreground text-lg font-bold tracking-tight uppercase">
              {t('trust:verifyNow', { defaultValue: 'Verify Identity' })}
            </h3>
            <p className="text-muted-foreground text-xs font-medium">
              {t('trust:boostTrust', {
                defaultValue: 'Boost trust & unlock features.',
              })}
            </p>
          </div>
        </div>

        <Link href="/dashboard/settings/verification">
          <Button
            variant="outline"
            className="w-full rounded-xl border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500 sm:w-auto"
          >
            {t('trust:startVerification', { defaultValue: 'Start' })}
          </Button>
        </Link>
      </div>
    </div>
  )
}
