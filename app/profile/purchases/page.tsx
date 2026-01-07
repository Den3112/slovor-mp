'use client'

import { DashboardFeaturePlaceholder } from '@/components/dashboard/feature-placeholder'
import { ShoppingBag } from 'lucide-react'

export default function PurchasesPage() {
    return (
        <DashboardFeaturePlaceholder
            title="My Purchases"
            description="Keep track of everything you've bought, view receipts, and easily reorder your favorite items."
            icon={ShoppingBag}
        />
    )
}
