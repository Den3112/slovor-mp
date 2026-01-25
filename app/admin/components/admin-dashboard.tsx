'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Listing } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Eye,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface AdminDashboardProps {
  userEmail: string
}

type ModerationStatus = 'pending' | 'approved' | 'rejected'

interface ListingWithModeration extends Listing {
  moderation_status?: ModerationStatus
}

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
      // Show recently created listings (last 24h)
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

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listingId)

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
          <Button
            variant="outline"
            onClick={fetchListings}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')}
            />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'pending', 'flagged'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
              size="sm"
            >
              {f === 'all' && 'All Listings'}
              {f === 'pending' && 'Pending Review'}
              {f === 'flagged' && 'Flagged'}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border p-4">
            <p className="text-muted-foreground text-sm">Total Listings</p>
            <p className="text-3xl font-bold">{listings.length}</p>
          </div>
          <div className="bg-card rounded-xl border p-4">
            <p className="text-muted-foreground text-sm">Active</p>
            <p className="text-3xl font-bold text-green-500">
              {listings.filter((l) => l.is_active).length}
            </p>
          </div>
          <div className="bg-card rounded-xl border p-4">
            <p className="text-muted-foreground text-sm">Inactive</p>
            <p className="text-3xl font-bold text-red-500">
              {listings.filter((l) => !l.is_active).length}
            </p>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-card overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <Loader2 className="text-muted-foreground mx-auto h-6 w-6 animate-spin" />
                    </td>
                  </tr>
                ) : listings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-muted-foreground px-4 py-8 text-center"
                    >
                      No listings found
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="max-w-xs truncate font-medium">
                          {listing.title}
                        </div>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">
                        {(listing.category as { name?: string })?.name || '-'}
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">
                        {listing.location || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        €{listing.price}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                            listing.is_active
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                          )}
                        >
                          {listing.is_active ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">
                        {new Date(
                          listing.created_at || ''
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/listings/${listing.id}`}
                            target="_blank"
                            className="hover:bg-muted rounded-lg p-2 transition-colors"
                          >
                            <Eye className="text-muted-foreground h-4 w-4" />
                          </Link>

                          {actionLoading === listing.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              {!listing.is_active && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleApprove(listing.id)}
                                  className="text-green-500 hover:bg-green-500/10 hover:text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {listing.is_active && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleReject(listing.id)}
                                  className="text-orange-500 hover:bg-orange-500/10 hover:text-orange-600"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(listing.id)}
                                className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
