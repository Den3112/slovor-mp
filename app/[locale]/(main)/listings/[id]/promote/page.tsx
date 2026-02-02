'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { transactionsApi, listingsApi } from '@/lib/api'
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
import { toast } from 'sonner'
import { Container } from '@/components/ui/container'

interface Props {
    params: Promise<{
        id: string
    }>
}

export default function PromoteListingPage({ params }: Props) {
    const { id } = use(params)
    const { user } = useAuth()
    const router = useRouter()
    const [selectedPlan, setSelectedPlan] = useState<'top' | 'highlight' | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const plans = [
        {
            id: 'top',
            title: 'Top Position',
            subtitle: 'Boost to top of search',
            price: 4.99,
            icon: TrendingUp,
            features: ['Visible to more buyers', 'Avg. 3x more views', 'Valid for 7 days'],
            color: 'blue',
            type: 'promotion_top' as const,
        },
        {
            id: 'highlight',
            title: 'Premium Highlight',
            subtitle: 'Visual edge over others',
            price: 9.99,
            icon: Zap,
            features: ['Golden visual border', 'Priority in categories', 'Valid for 14 days'],
            color: 'amber',
            type: 'promotion_highlight' as const,
        },
    ]

    const handlePromote = async () => {
        if (!user || !selectedPlan) return

        setIsSubmitting(true)
        const plan = plans.find(p => p.id === selectedPlan)!

        try {
            const { error } = await transactionsApi.create({
                user_id: user.id,
                amount: plan.price,
                currency: 'EUR',
                type: plan.type,
                status: 'completed',
                metadata: {
                    listing_id: id,
                    plan_name: plan.title,
                }
            })

            if (error) throw new Error(error)

            // Update the listing to be promoted
            await listingsApi.update(id, {
                is_highlighted: true,
                promoted_until: new Date(Date.now() + (plan.id === 'top' ? 7 : 14) * 24 * 60 * 60 * 1000).toISOString(),
            })

            toast.success('Listing promoted successfully!')
            router.push(`/listings/${id}`)
        } catch (error) {
            console.error('Promotion failed:', error)
            toast.error('Failed to process promotion')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <Container className="pt-24 md:pt-32">
                <div className="mx-auto max-w-4xl space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                            <Rocket className="h-8 w-8" />
                        </div>
                        <h1 className="font-heading text-4xl font-black tracking-tight md:text-5xl uppercase text-foreground">
                            {/* NOTE: Keep hardcoded text for now or verify keys later. Sticking to structure. */}
                            Promote your <span className="text-primary">Listing</span>
                        </h1>
                        <p className="text-muted-foreground mx-auto max-w-xl text-lg font-medium leading-relaxed">
                            Reach more buyers and sell up to 5x faster with our premium promotion tools.
                        </p>
                    </div>

                    {/* Plan Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id as any)}
                                className={cn(
                                    "group relative cursor-pointer overflow-hidden rounded-xl border-2 p-8 transition-all hover:bg-accent/50",
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
                                            : "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900"
                                    )}>
                                        <plan.icon className="h-7 w-7" />
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">{plan.title}</h3>
                                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">{plan.subtitle}</p>
                                    </div>

                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-foreground">{plan.price}</span>
                                        <span className="text-muted-foreground font-black tracking-widest uppercase text-sm">EUR</span>
                                    </div>

                                    <div className="h-px w-full bg-border" />

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
                                        Best Value
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-6 pt-4 border-t border-border">
                        <Button
                            size="lg"
                            disabled={!selectedPlan || isSubmitting}
                            onClick={handlePromote}
                            className="h-14 w-full max-w-sm rounded-xl text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-sm active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Confirm and Pay
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>

                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                            <ShieldCheck className="h-4 w-4" />
                            Secure Checkout • Satisfaction Guaranteed
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}
