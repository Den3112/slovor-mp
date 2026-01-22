'use client'



import type { Listing } from '@/lib/types/database'

interface AdminStatsProps {
    listings: Listing[]
}

export function AdminStats({ listings }: AdminStatsProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Total Listings</p>
                <p className="text-3xl font-bold">{listings.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-green-500">
                    {listings.filter(l => l.is_active).length}
                </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-3xl font-bold text-red-500">
                    {listings.filter(l => !l.is_active).length}
                </p>
            </div>
        </div>
    )
}
