'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { listingsApi } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'
import {
    Zap,
    TrendingUp,
    Check,
    ShieldCheck,
    ArrowRight,
    Loader2,
    Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { formatPrice } from '@/lib/utils/formatting'

interface Props {
    params: Promise<{
        id: string
    }>
}

export default function PromoteListingPage({ params }: Props) {
    const { t } = useTranslation(['dashboard', 'common'])
    const { id } = use(params)
    const { user } = useAuth()
    const router = useRouter()
    const [selectedPlan, setSelectedPlan] = useState<'free' | 'top' | 'highlight' | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const plans = [
        {
            id: 'free',
            title: t('dashboard:promote.plans.free.title'),
            subtitle: t('dashboard:promote.plans.free.subtitle'),
            price: 0,
            icon: ShieldCheck,
            features: t('dashboard:promote.plans.free.features', { returnObjects: true }) as string[],
            color: 'zinc',
            type: 'free' as const,
        },
        {
            id: 'top',
            title: t('dashboard:promote.plans.standard.title'),
            subtitle: t('dashboard:promote.plans.standard.subtitle'),
            price: 4.99,
            icon: TrendingUp,
            features: t('dashboard:promote.plans.standard.features', { returnObjects: true }) as string[],
            color: 'blue',
            type: 'promotion_top' as const,
        },
        {
            id: 'highlight',
            title: t('dashboard:promote.plans.premium.title'),
            subtitle: t('dashboard:promote.plans.premium.subtitle'),
            price: 9.99,
            icon: Zap,
            features: t('dashboard:promote.plans.premium.features', { returnObjects: true }) as string[],
            color: 'amber',
            type: 'promotion_highlight' as const,
        },
    ]

    const handlePromote = async () => {
        if (!user || !selectedPlan) return
        if (selectedPlan === 'free') {
            router.push(`/listings/${id}`)
            return
        }

        setIsSubmitting(true)
        const plan = plans.find(p => p.id === selectedPlan)!

        try {
            const duration = plan.id === 'top' ? 7 : 14
            const { error: promoteError } = await listingsApi.promote(id, plan.type as any, duration, plan.price)

            if (promoteError) throw new Error(promoteError)

            toast.success(t('dashboard:promote.success'))
            router.push(`/listings/${id}`)
            router.refresh()
        } catch (error) {
            console.error('Promotion failed:', error)
            toast.error(t('dashboard:promote.error'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <Container className="pt-24 md:pt-32">
                <div className="mx-auto max-w-5xl space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                            <Rocket className="h-8 w-8" />
                        </div>
                        <h1 className="font-heading text-4xl font-black tracking-tight md:text-5xl uppercase text-foreground italic">
                            {t('dashboard:promote.title')}
                        </h1>
                        <p className="text-muted-foreground mx-auto max-w-xl text-lg font-medium leading-relaxed">
                            {t('dashboard:promote.subtitle')}
                        </p>
                    </div>

                    {/* Plan Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id as any)}
                                className={cn(
                                    "group relative cursor-pointer overflow-hidden rounded-xl border-2 p-8 transition-all",
                                    selectedPlan === plan.id
                                        ? "border-primary bg-primary/5"
                                        : "border-border bg-card hover:border-primary/50"
                                )}
                            >
                                {/* Selection indicator */}
                                <div className={cn(
                                    "absolute top-6 right-6 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                                    selectedPlan === plan.id
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border group-hover:border-primary/50"
                                )}>
                                    {selectedPlan === plan.id && <Check className="h-3.5 w-3.5 stroke-3" />}
                                </div>

                                <div className="space-y-6">
                                    <div className={cn(
                                        "flex h-14 w-14 items-center justify-center rounded-xl border",
                                        plan.color === 'blue'
                                            ? "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900"
                                            : plan.color === 'amber'
                                                ? "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900"
                                                : "bg-zinc-500/10 text-zinc-600 border-zinc-200 dark:border-zinc-900"
                                    )}>
                                        <plan.icon className="h-7 w-7" />
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">{plan.title}</h3>
                                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{plan.subtitle}</p>
                                    </div>

                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-foreground">{formatPrice(plan.price, 'EUR')}</span>
                                    </div>

                                    <div className="h-px w-full bg-border/60" />

                                    <ul className="space-y-3">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                                                    <Check className="h-3 w-3 stroke-3" />
                                                </div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {plan.id === 'highlight' && (
                                    <div className="absolute top-0 right-0 bg-amber-500 px-6 py-1 text-[10px] font-black uppercase tracking-widest text-white transform rotate-45 translate-x-[30px] translate-y-[15px] shadow-sm">
                                        {t('dashboard:promote.bestValue')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-6 pt-4 border-t border-border/60">
                        <Button
                            size="lg"
                            disabled={!selectedPlan || isSubmitting}
                            onClick={handlePromote}
                            className="h-14 w-full max-w-sm rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm bg-primary text-primary-foreground"
                        >
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    {t('dashboard:promote.confirmPay')}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>

                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                            <ShieldCheck className="h-4 w-4" />
                            {t('dashboard:promote.secureCheckout')}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}
