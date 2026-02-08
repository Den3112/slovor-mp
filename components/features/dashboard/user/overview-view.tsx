'use client'

import { motion } from 'framer-motion'
import type { DashboardStats } from '@/lib/api/dashboard-stats'

import {
  PerformanceCard,
  RecentActivityTable,
} from './overview/index'
import { WalletCard } from './components/wallet-card'

interface UserOverviewViewProps {
  user: any
  stats: DashboardStats
  userListings: any[]
  chartData: any[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function UserOverviewView({
  user,
  stats,
  userListings,
  chartData,
}: UserOverviewViewProps) {
  return (
    <PremiumBackground variant="mesh" className="min-h-screen p-4 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl space-y-8"
        data-testid="profile-overview-view"
      >
        <BentoGrid>
          {/* Main Hero & Stats Section */}
          <BentoTile colSpan={8} rowSpan={2} className="bg-background/20">
            <DashboardHero user={user} stats={stats} />
          </BentoTile>

          {/* Quick Action Stack */}
          <BentoTile colSpan={4} rowSpan={2} className="bg-primary/5">
            <QuickActionStack />
          </BentoTile>

          {/* Performance Chart */}
          <BentoTile colSpan={8} rowSpan={3}>
            <PerformanceCard data={chartData} />
          </BentoTile>

          {/* Wallet Widget */}
          <BentoTile colSpan={4} rowSpan={1} className="p-0">
            <WalletCard
              balance={stats.walletBalance || 0}
              currency={stats.walletCurrency || 'EUR'}
            />
          </BentoTile>

          {/* Identity Widget */}
          <BentoTile colSpan={4} rowSpan={1} className="p-0">
            <IdentityWidget isVerified={user.user_metadata?.email_confirmed || false} />
          </BentoTile>

          {/* Recent Activity Table - Full Width at bottom for density */}
          <BentoTile colSpan={12} rowSpan={2} className="border-none bg-transparent shadow-none backdrop-blur-none">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-transparent opacity-50" />
            <RecentActivityTable listings={userListings} />
          </BentoTile>
        </BentoGrid>
      </motion.div>
    </PremiumBackground>
  )
}

import { BentoGrid, BentoTile } from '@/components/ui/bento'
import { PremiumBackground } from '@/components/ui/premium-background'
import { DashboardHero } from './overview/dashboard-hero'
import { QuickActionStack } from './overview/quick-action-stack'
import { IdentityWidget } from './identity-widget'
