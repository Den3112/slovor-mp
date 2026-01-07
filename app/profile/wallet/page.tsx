'use client'

import { DashboardFeaturePlaceholder } from '@/components/dashboard/feature-placeholder'
import { Wallet } from 'lucide-react'

export default function WalletPage() {
    return (
        <DashboardFeaturePlaceholder
            title="Slovor Wallet"
            description="Securely manage your earnings, request payouts, and view detailed transaction history."
            icon={Wallet}
        />
    )
}
