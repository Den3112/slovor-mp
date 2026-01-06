'use client'

import { DashboardFeaturePlaceholder } from '@/components/dashboard/feature-placeholder'
import { Package } from 'lucide-react'

export default function OrdersPage() {
    return (
        <DashboardFeaturePlaceholder
            title="Sales & Orders"
            description="Track your incoming orders, manage shipping status, and handle returns all in one place."
            icon={Package}
        />
    )
}
