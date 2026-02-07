'use client'

import { motion } from 'framer-motion'
import type { DashboardStats } from '@/lib/api/dashboard-stats'

import {
  OverviewHeader,
  OverviewStats,
  PerformanceCard,
  QuickActionsAndActivity,
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
      data-testid="profile-overview-view"
    >
      <OverviewHeader user={user} />

      <OverviewStats stats={stats} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Main Column */}
        <div className="space-y-8 lg:col-span-2">
          <PerformanceCard data={chartData} />
          <RecentActivityTable listings={userListings} />
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
          {/* Wallet Widget moved here for better layout */}
          <WalletCard
            balance={stats.walletBalance || 0}
            currency={stats.walletCurrency || 'EUR'}
          />
          <QuickActionsAndActivity />
        </div>
      </div>
    </motion.div>
  )
}
