'use client'

import { ArrowRight, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NextActionTileProps {
  status: 'pending_verification' | 'low_listings' | 'growth_opportunity'
}

export function NextActionTile({ status }: NextActionTileProps) {
  const config = {
    pending_verification: {
      title: 'Verify Your Identity',
      desc: 'Get a blue badge and increase trust by 40%.',
      icon: ShieldCheck,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      action: 'Verify Now',
    },
    low_listings: {
      title: 'Post Your First Item',
      desc: 'Sellers with at least 3 items sell 2x faster.',
      icon: Sparkles,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      action: 'Create Listing',
    },
    growth_opportunity: {
      title: 'Boost Your Reach',
      desc: 'One of your items is trending. Promote it now.',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      action: 'Boost Item',
    },
  }[status]

  const Icon = config.icon

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="space-y-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${config.bg}`}
        >
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">{config.title}</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {config.desc}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        className="text-primary hover:bg-primary/5 -ml-4 w-fit gap-2 font-bold"
      >
        {config.action}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
