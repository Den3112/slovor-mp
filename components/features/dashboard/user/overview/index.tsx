'use client'

import { motion } from 'framer-motion'
import type { DashboardStats } from '@/lib/api/dashboard-stats'

import { PerformanceCard } from './performance-card'
import { RecentActivityTable } from './recent-activity-table'
import { WalletWidget, ActiveOrdersWidget } from '../widgets'
import { DashboardHero } from './dashboard-hero'
import { QuickActionsAndActivity } from './quick-actions'

import { MarketInsightsTile } from './market-insights-tile'
import { SuccessScore } from '../vantage/success-score'
import { SmartNudges } from '../vantage/smart-nudges'
import { BentoGrid, BentoTile } from '@/components/ui/bento'
import { PremiumBackground } from '@/components/ui/premium-background'

import { Listing } from '@/lib/api'
import { User } from '@supabase/supabase-js'

interface UserOverviewViewProps {
  user: User
  stats: DashboardStats
  userListings: Listing[]
  chartData: { date: string; value: number }[]
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
  // Mock orders for now - in real implementation this would come from props
  const recentOrders = [
    {
      id: 'ORD-7829',
      title: 'Translation Srv...',
      price: '€150.00',
      status: 'active',
      date: '2m ago',
    },
    {
      id: 'ORD-7812',
      title: 'Logo Design...',
      price: '€299.00',
      status: 'completed',
      date: '2h ago',
    },
    {
      id: 'ORD-7790',
      title: 'SEO Audit...',
      price: '€850.00',
      status: 'pending',
      date: '1d ago',
    },
  ] as any[]

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
          {/* Main Hero Section - Command Center */}
          <BentoTile
            colSpan={12}
            rowSpan={2} // Increased height for better visual hierarchy
            className="bg-background/20 border-primary/10 backdrop-blur-xl lg:col-span-8"
          >
            <DashboardHero user={user} stats={stats} />
          </BentoTile>

          {/* Success Score & Smart Nudges */}
          <div className="col-span-12 grid h-full grid-rows-2 gap-4 lg:col-span-4 lg:gap-6">
            <BentoTile
              colSpan={12}
              rowSpan={1}
              className="border-none bg-transparent p-0 shadow-none"
            >
              <SuccessScore score={84} percentile={5} trend="up" />
            </BentoTile>
            <BentoTile
              colSpan={12}
              rowSpan={1}
              className="border-none bg-transparent p-0 shadow-none"
            >
              <SmartNudges />
            </BentoTile>
          </div>

          {/* Wallet & Active Orders */}
          <WalletWidget
            balance={stats.walletBalance || 1250.0}
            currency={stats.walletCurrency || 'EUR'}
          />

          <ActiveOrdersWidget orders={recentOrders} />

          <BentoTile
            colSpan={4}
            rowSpan={2}
            className="border-none bg-transparent p-0 shadow-none"
          >
            <QuickActionsAndActivity />
          </BentoTile>

          {/* Market Insights & Performance */}
          <BentoTile colSpan={12} rowSpan={2} className="lg:col-span-8">
            <PerformanceCard data={chartData} />
          </BentoTile>

          <BentoTile colSpan={12} rowSpan={2} className="lg:col-span-4">
            <MarketInsightsTile />
          </BentoTile>

          {/* Recent Listings Activity */}
          <BentoTile
            colSpan={12}
            rowSpan={2}
            className="border-none bg-transparent shadow-none backdrop-blur-none"
          >
            <div className="flex flex-col gap-4">
              <RecentActivityTable listings={userListings} />
            </div>
          </BentoTile>
        </BentoGrid>
      </motion.div>
    </PremiumBackground>
  )
}
