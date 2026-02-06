import { Listing } from '@/lib/api'

export interface AdminListingsViewProps {
    initialListings?: Listing[]
}

export interface SuspicionIssue {
    label: string
    color: string
    icon: any
}

export interface ModerationCardProps {
    listing: Listing
    issues: SuspicionIssue[]
    onAction: (id: string, status: 'active' | 'rejected') => Promise<void>
    locale: string
}

export interface BulkActionsBarProps {
    selectedCount: number
    onAction: (status: 'active' | 'rejected') => Promise<void>
    onClear: () => void
}
