'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/auth-provider'
import { listingsApi } from '@/shared/lib/api'
import { useTranslation } from '@/shared/lib/i18n'
import { toast } from 'sonner'
import {
  Zap,
  TrendingUp,
  Check,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Rocket,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { formatPrice } from '@/shared/lib/utils/formatting'
import { supabase } from '@/shared/lib/supabase/client'

interface Props {
  params: Promise<{
    id: string
    lang: string
  }>
}

export default function PromoteListingPage({ params }: Props) {
  const { t } = useTranslation(['dashboard', 'common'])
  const { id, lang } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<
    'free' | 'top' | 'highlight' | null
  >(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const plans = [
    {
      id: 'free',
      title: t('dashboard:promote.plans.free.title'),
      subtitle: t('dashboard:promote.plans.free.subtitle'),
      price: 0,
      icon: ShieldCheck,
      features: t('dashboard:promote.plans.free.features', {
        returnObjects: true,
      }) as string[],
      color: 'zinc',
      type: 'free' as const,
    },
    {
      id: 'top',
      title: t('dashboard:promote.plans.standard.title'),
      subtitle: t('dashboard:promote.plans.standard.subtitle'),
      price: Number(t('dashboard:promote.plans.standard.price')),
      icon: TrendingUp,
      features: t('dashboard:promote.plans.standard.features', {
        returnObjects: true,
      }) as string[],
      color: 'blue',
      type: 'promotion_top' as const,
    },
    {
      id: 'highlight',
      title: t('dashboard:promote.plans.premium.title'),
      subtitle: t('dashboard:promote.plans.premium.subtitle'),
      price: Number(t('dashboard:promote.plans.premium.price')),
      icon: Zap,
      features: t('dashboard:promote.plans.premium.features', {
        returnObjects: true,
      }) as string[],
      color: 'amber',
      type: 'promotion_highlight' as const,
    },
  ]

  const handlePromote = async () => {
    if (!user || !selectedPlan) return
    if (selectedPlan === 'free') {
      router.push(`/${lang}/listings/${id}`)
      return
    }

    setIsSubmitting(true)
    const plan = plans.find((p) => p.id === selectedPlan)!

    try {
      const duration = plan.id === 'top' ? 7 : 14
      const { error: promoteError } = await listingsApi.promote(
        supabase,
        id,
        plan.type as any,
        duration,
        plan.price
      )

      if (promoteError) throw new Error(promoteError)

      toast.success(t('dashboard:promote.success'))
      router.push(`/${lang}/listings/${id}`)
      router.refresh()
    } catch (error) {
      console.error('Promotion failed:', error)
      toast.error(t('dashboard:promote.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="pt-24 md:pt-32">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="bg-primary/10 text-primary border-primary/20 mx-auto flex h-16 w-16 items-center justify-center rounded-xl border">
              <Rocket className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-foreground text-4xl font-bold tracking-tight uppercase md:text-5xl">
              {t('dashboard:promote.title')}
            </h1>
            <p className="text-muted-foreground mx-auto max-w-xl text-lg leading-relaxed font-medium">
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
                  'group relative cursor-pointer overflow-hidden rounded-xl border-2 p-8 transition-all',
                  selectedPlan === plan.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50'
                )}
              >
                {/* Selection indicator */}
                <div
                  className={cn(
                    'absolute top-6 right-6 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
                    selectedPlan === plan.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border group-hover:border-primary/50'
                  )}
                >
                  {selectedPlan === plan.id && (
                    <Check className="h-3.5 w-3.5 stroke-3" />
                  )}
                </div>

                <div className="space-y-6">
                  <div
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-xl border',
                      plan.color === 'blue'
                        ? 'border-blue-200 bg-blue-500/10 text-blue-600 dark:border-blue-900'
                        : plan.color === 'amber'
                          ? 'border-amber-200 bg-amber-500/10 text-amber-600 dark:border-amber-900'
                          : 'border-zinc-200 bg-zinc-500/10 text-zinc-600 dark:border-zinc-900'
                    )}
                  >
                    <plan.icon className="h-7 w-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-foreground text-2xl font-bold tracking-tight uppercase">
                      {plan.title}
                    </h3>
                    <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                      {plan.subtitle}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-foreground text-4xl font-bold">
                      {formatPrice(plan.price, 'EUR')}
                    </span>
                  </div>

                  <div className="bg-border/60 h-px w-full" />

                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li
                        key={i}
                        className="text-foreground/80 flex items-center gap-3 text-sm font-bold"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                          <Check className="h-3 w-3 stroke-3" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.id === 'highlight' && (
                  <div className="absolute top-0 right-0 translate-x-[30px] translate-y-[15px] rotate-45 transform bg-amber-500 px-6 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-sm">
                    {t('dashboard:promote.bestValue')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="border-border/60 flex flex-col items-center gap-6 border-t pt-4">
            <Button
              size="lg"
              disabled={!selectedPlan || isSubmitting}
              onClick={handlePromote}
              className="bg-primary text-primary-foreground h-14 w-full max-w-sm rounded-xl text-xs font-bold tracking-widest uppercase shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
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

            <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
              <ShieldCheck className="h-4 w-4" />
              {t('dashboard:promote.secureCheckout')}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
