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
        <div className={cn(
            "relative overflow-hidden rounded-3xl border p-6 transition-all duration-300",
            isVerified
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-border bg-card hover:border-primary/30"
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl border",
                        isVerified
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                            : "border-border bg-muted text-muted-foreground"
                    )}>
                        {isVerified ? (
                            <ShieldCheck className="h-6 w-6" />
                        ) : (
                            <ShieldAlert className="h-6 w-6" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-foreground font-bold tracking-tight uppercase">
                            {t('verification:idTitle', { defaultValue: 'Identity' })}
                        </h3>
                        <p className={cn(
                            "text-[10px] font-bold tracking-widest uppercase",
                            isVerified ? "text-emerald-500" : "text-muted-foreground"
                        )}>
                            {isVerified
                                ? t('verification:verified', { defaultValue: 'Verified' })
                                : t('verification:notVerified', { defaultValue: 'Not Verified' })}
                        </p>
                    </div>
                </div>

                {!isVerified && (
                    <Link href={`/${locale}/dashboard/verification`}>
                        <div className="bg-muted hover:bg-primary/10 hover:text-primary flex h-8 w-8 items-center justify-center rounded-full transition-colors">
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </Link>
                )}
            </div>

            <p className="text-muted-foreground mt-4 text-xs font-medium leading-relaxed">
                {isVerified
                    ? t('verification:verifiedDesc', { defaultValue: 'Your identity is verified. You have full access to all platform features.' })
                    : t('verification:notVerifiedDesc', { defaultValue: 'Verify your identity to increase trust and unlock higher limits.' })}
            </p>
        </div>
    )
}
