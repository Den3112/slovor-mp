'use client'

import { DashboardFeaturePlaceholder } from '@/components/profile/feature-placeholder'
import { Star } from 'lucide-react'

export default function ReviewsPage() {
    return (
        <DashboardFeaturePlaceholder
            title="Reputation Manager"
            description="See what others are saying about you. Respond to reviews and build trust with the community."
            icon={Star}
        />
    )
}
