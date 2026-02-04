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
    Loader2
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

export function SubscriptionView({ currentSubscription: initialSubscription }: SubscriptionViewProps) {
    const { t } = useTranslation(['common', 'profile', 'dashboard'])
    const [currentSub, setCurrentSub] = useState<UserSubscription>(initialSubscription)
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null)

    const plans = [
        {
            id: 'free',
            name: 'Free / Individual',
            price: '0',
            duration: 'Forever',
            description: 'Perfect for casual sellers and starters.',
            icon: Sparkles,
            color: 'slate',
            features: [
                'Up to 5 active listings',
                '5 photos per listing',
                'Listing duration: 14 days',
                'Standard support',
                'Basic search visibility'
            ],
            buttonText: 'Current Plan'
        },
        {
            id: 'pro',
            name: 'Professional',
            price: '14.99',
            period: '/ month',
            description: 'For power users and small businesses.',
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
                'Basic analytics'
            ],
            buttonText: 'Upgrade to Pro'
        },
        {
            id: 'business',
            name: 'Business',
            price: '39.99',
            period: '/ month',
            description: 'Maximum exposure for professional dealers.',
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
                'API access'
            ],
            buttonText: 'Upgrade to Business'
        }
    ]

    const handleUpgrade = async (planId: string) => {
        if (planId === currentSub.plan_type) return

        setIsSubmitting(planId)
        try {
            const { data, error } = await subscriptionsApi.subscribe(planId as any)
            if (error) throw new Error(error)

            if (data) {
                setCurrentSub(data)
                toast.success(`Successfully upgraded to ${planId.toUpperCase()} plan!`)
            }
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setIsSubmitting(null)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-2 bg-card border border-border p-6 rounded-xl shadow-sm">
                <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
                    {t('profile:subscription')}
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    Choose the best plan for your selling needs
                </p>
            </div>

            {/* Current Plan Indicator */}
            <div className={cn(
                "rounded-xl border p-4 transition-all",
                currentSub.plan_type === 'free'
                    ? "border-blue-200 bg-blue-500/5 dark:border-blue-900/50"
                    : "border-primary bg-primary/5 shadow-sm"
            )}>
                <div className="flex gap-3">
                    <AlertCircle className={cn(
                        "h-5 w-5 shrink-0",
                        currentSub.plan_type === 'free' ? "text-blue-600 dark:text-blue-400" : "text-primary"
                    )} />
                    <div className="flex-1">
                        <p className={cn(
                            "text-sm font-bold",
                            currentSub.plan_type === 'free' ? "text-blue-900 dark:text-blue-300" : "text-foreground"
                        )}>
                            {currentSub.plan_type === 'free'
                                ? "Upgrade your plan to unlock more listings and boost your sales!"
                                : `You are currently on the ${currentSub.plan_type.toUpperCase()} plan.`}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <p className={cn(
                                "text-[10px] uppercase font-black tracking-widest",
                                currentSub.plan_type === 'free' ? "text-blue-600 dark:text-blue-400" : "text-primary"
                            )}>
                                Current: {currentSub.plan_type.toUpperCase()} PLAN
                            </p>
                            {currentSub.current_period_end && (
                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                                    Ends on: {new Date(currentSub.current_period_end).toLocaleDateString()}
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
                                "relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300",
                                plan.highlight && !isCurrent
                                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 scale-[1.02]"
                                    : isCurrent
                                        ? "border-primary/40 bg-card shadow-sm ring-1 ring-primary/20"
                                        : "border-border bg-card hover:border-primary/50"
                            )}
                        >
                            {/* Plan Header */}
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className={cn(
                                        "flex h-12 w-12 items-center justify-center rounded-xl border",
                                        plan.color === 'blue' ? "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900" :
                                            plan.color === 'amber' ? "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900" :
                                                "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-800"
                                    )}>
                                        <plan.icon className="h-6 w-6" />
                                    </div>
                                    {isCurrent ? (
                                        <Badge className="bg-emerald-500 text-white font-black uppercase tracking-widest text-[9px] rounded-lg">
                                            Active
                                        </Badge>
                                    ) : plan.highlight && (
                                        <Badge className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-[9px] rounded-lg animate-pulse">
                                            Most Popular
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl font-black uppercase tracking-tight text-foreground">{plan.name}</h3>
                                    <p className="text-muted-foreground text-xs font-bold leading-relaxed">{plan.description}</p>
                                </div>

                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-foreground">€{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-muted-foreground font-black tracking-widest uppercase text-sm">{plan.period}</span>
                                    )}
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="flex-1 p-6 md:p-8 pt-0 border-t border-border/50 mt-4">
                                <ul className="space-y-4 pt-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
                                                <Check className="h-3 w-3 stroke-3" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Plan Footer / CTA */}
                            <div className="p-6 md:p-8 pt-0 mt-auto">
                                <Button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={isCurrent || (isSubmitting !== null)}
                                    className={cn(
                                        "w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        isCurrent
                                            ? "bg-muted text-muted-foreground border-border cursor-default hover:bg-muted"
                                            : plan.highlight
                                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                                                : "bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98]"
                                    )}
                                    variant={isCurrent ? "outline" : "default"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-border mt-12">
                <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Why upgrade?</h4>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                        Slovor Pro accounts give you professional tools to stand out from the crowd.
                        With boosted visibility and priority support, your listings sell on average 3x faster than basic accounts.
                    </p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Payment Safety</h4>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                        All payments are handled securely via Slovor Pay. No credit card details are stored on our servers.
                        You can cancel your subscription at any time from your settings.
                    </p>
                </div>
            </div>
        </div>
    )
}
