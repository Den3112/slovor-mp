'use client'

import { motion } from 'framer-motion'
import { Eye, MessageSquare, Tag, Wallet, TrendingUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface QuickStatsProps {
  stats: {
    activeListings: number
    totalViews: number
    totalInquiries: number
    walletBalance: number
  }
}

export function QuickStatsGrid({ stats }: QuickStatsProps) {
  const { t } = useTranslation(['dashboard', 'common'])

  const items = [
    {
      label: t('activeListings', { defaultValue: 'Active Listings' }),
      value: stats.activeListings,
      icon: Tag,
      color: 'bg-blue-500/10 text-blue-500',
      trend: '+12%',
    },
    {
      label: t('totalViews', { defaultValue: 'Total Views' }),
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-purple-500/10 text-purple-500',
      trend: '+5.4%',
    },
    {
      label: t('inquiries', { defaultValue: 'Inquiries' }),
      value: stats.totalInquiries,
      icon: MessageSquare,
      color: 'bg-amber-500/10 text-amber-500',
      trend: '+2',
    },
    {
      label: t('balance', { defaultValue: 'Wallet Balance' }),
      value: `€${stats.walletBalance.toFixed(2)}`,
      icon: Wallet,
      color: 'bg-emerald-500/10 text-emerald-500',
      trend: 'Safe',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-panel border-primary/5 hover:border-primary/20 relative overflow-hidden rounded-[2rem] border p-6 shadow-xl transition-all duration-500 hover:scale-[1.02]"
        >
          {/* Subtle background curve */}
          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/5 opacity-50 blur-2xl" />
          
          <div className="flex items-start justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div className="bg-primary/5 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-primary">
              <TrendingUp className="h-3 w-3" />
              {item.trend}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-1">
            <span className="text-foreground text-2xl font-black tracking-tight">
              {item.value}
            </span>
            <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase opacity-60">
              {item.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
