'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Listing } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import {
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminDashboardProps {
  userEmail: string
}

type ModerationStatus = 'pending' | 'approved' | 'rejected'

interface ListingWithModeration extends Listing {
  moderation_status?: ModerationStatus
}

// Sub-components
import { DashboardStats } from './dashboard/stats'
import { DashboardFilters } from './dashboard/filters'
import { ListingsTable } from './dashboard/table'

export function AdminDashboard({ userEmail }: AdminDashboardProps) {
  const [listings, setListings] = useState<ListingWithModeration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'flagged'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const supabase = createClient()

  const fetchListings = useCallback(async () => {
    setIsLoading(true)

    let query = supabase
      .from('listings')
      .select('*, category:categories(*), user:profiles(*)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (filter === 'pending') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      query = query.gte('created_at', oneDayAgo)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching listings:', error)
    } else {
      setListings(data || [])
    }

    setIsLoading(false)
  }, [supabase, filter])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const handleApprove = async (listingId: string) => {
    setActionLoading(listingId)
    const { error } = await supabase
      .from('listings')
      .update({ is_active: true })
      .eq('id', listingId)

    if (!error) {
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, is_active: true } : l))
      )
    }
    setActionLoading(null)
  }

  const handleReject = async (listingId: string) => {
    setActionLoading(listingId)
    const { error } = await supabase
      .from('listings')
      .update({ is_active: false })
      .eq('id', listingId)

    if (!error) {
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, is_active: false } : l))
      )
    }
    setActionLoading(null)
  }

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    setActionLoading(listingId)
    const { error } = await supabase.from('listings').delete().eq('id', listingId)

    if (!error) {
      setListings((prev) => prev.filter((l) => l.id !== listingId))
    }
    setActionLoading(null)
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Logged in as {userEmail}</p>
          </div>
          <Button variant="outline" onClick={fetchListings} disabled={isLoading}>
            <RefreshCw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        <DashboardFilters filter={filter} setFilter={setFilter} />

        <DashboardStats
          total={listings.length}
          active={listings.filter((l) => l.is_active).length}
          inactive={listings.filter((l) => !l.is_active).length}
        />

        <ListingsTable
          isLoading={isLoading}
          listings={listings}
          actionLoading={actionLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
