'use client'

import { motion } from 'framer-motion'
import type { DashboardStats } from '@/lib/api/dashboard-stats'

import {
    OverviewHeader,
    OverviewStats,
    PerformanceCard,
    QuickActionsAndActivity,
    RecentActivityTable
} from './overview/index'

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
            staggerChildren: 0.1
        }
    }
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
                <PerformanceCard data={chartData} />
                <QuickActionsAndActivity />
            </div>

            <RecentActivityTable listings={userListings} />
        </motion.div>
    )
}
