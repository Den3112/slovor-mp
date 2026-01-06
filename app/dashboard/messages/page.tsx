'use client'

import { DashboardFeaturePlaceholder } from '@/components/dashboard/feature-placeholder'
import { MessageCircle } from 'lucide-react'

export default function InboxPage() {
    return (
        <DashboardFeaturePlaceholder
            title="Unified Inbox"
            description="Chat with buyers and sellers in real-time. Negotiate prices, ask questions, and close deals securely."
            icon={MessageCircle}
        />
    )
}
