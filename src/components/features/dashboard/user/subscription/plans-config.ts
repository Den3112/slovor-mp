import { Sparkles, Zap, Gem, LucideIcon } from 'lucide-react'

export interface PlanConfig {
  id: string
  nameKey: string
  price: string
  periodKey?: string
  durationKey?: string
  descriptionKey: string
  icon: LucideIcon
  color: 'slate' | 'blue' | 'amber'
  highlight?: boolean
  features: string[]
  buttonTextKey: string
}

export const SUBSCRIPTION_PLANS: PlanConfig[] = [
  {
    id: 'free',
    nameKey: 'dashboard:subscriptions.plans.free.name',
    price: '0',
    durationKey: 'dashboard:subscriptions.plans.free.duration',
    descriptionKey: 'dashboard:subscriptions.plans.free.description',
    icon: Sparkles,
    color: 'slate',
    features: [
      'Up to 5 active listings',
      '5 photos per listing',
      'Listing duration: 14 days',
      'Standard support',
      'Basic search visibility',
    ],
    buttonTextKey: 'dashboard:subscriptions.plans.free.cta',
  },
  {
    id: 'pro',
    nameKey: 'dashboard:subscriptions.plans.pro.name',
    price: '14.99',
    periodKey: 'dashboard:subscriptions.plans.pro.period',
    descriptionKey: 'dashboard:subscriptions.plans.pro.description',
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
      'Basic analytics',
    ],
    buttonTextKey: 'dashboard:subscriptions.plans.pro.cta',
  },
  {
    id: 'business',
    nameKey: 'dashboard:subscriptions.plans.business.name',
    price: '39.99',
    periodKey: 'dashboard:subscriptions.plans.business.period',
    descriptionKey: 'dashboard:subscriptions.plans.business.description',
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
      'API access',
    ],
    buttonTextKey: 'dashboard:subscriptions.plans.business.cta',
  },
]
