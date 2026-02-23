'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import {
  Users,
  CheckCircle2,
  XCircle,
  Tag,
  AlertTriangle,
  UserPlus,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { listingsApi, adminApi, type Listing } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type Column } from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/utils/formatting'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Sub-components
import { ListingsHeader } from './listings-header'
import { BulkActionsBar } from './bulk-actions-bar'
import { ModerationQueue } from './moderation-queue'
import { AdminListingsTable } from './admin-listings-table'
import { AdminListingsViewProps, SuspicionIssue } from './types'

export { ListingsHeader, BulkActionsBar, ModerationQueue, AdminListingsTable }
export * from './types'
export * from './moderation-card'

export function AdminListingsView({
  initialListings = [],
}: AdminListingsViewProps) {
  const { t, i18n } = useTranslation(['common', 'admin', 'profile'])
  const locale = i18n.language || 'en'
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [isLoading, setIsLoading] = useState(initialListings.length === 0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Sorting state
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const loadListings = useCallback(async () => {
    setIsLoading(true)
    const { data } = await listingsApi.getAdminAll()
    if (data) setListings(data)
    setIsLoading(false)
  }, [])

  // Load listings if not provided
  useEffect(() => {
    if (initialListings.length === 0) {
      loadListings()
    }
  }, [initialListings.length, loadListings])

  const handleAction = async (id: string, status: 'active' | 'rejected') => {
    const { error } = await listingsApi.update(id, { status })
    if (error) {
      toast.error(error)
    } else {
      const successMsg =
        status === 'active'
          ? t('admin:listingApproved')
          : t('admin:listingRejected')

      toast.success(successMsg)
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l))
      )

      adminApi.logAction({
        target_id: id,
        target_type: 'listing',
        action_type: status === 'active' ? 'approve' : 'reject',
        reason:
          status === 'active'
            ? 'Admin approved listing'
            : `Admin set status to ${status}`,
      })
    }
  }

  const handleBulkAction = async (status: 'active' | 'rejected') => {
    toast.promise(
      Promise.all(selectedIds.map((id) => listingsApi.update(id, { status }))),
      {
        loading: t('admin:processingBulk'),
        success: () => {
          setListings((prev) =>
            prev.map((l) => (selectedIds.includes(l.id) ? { ...l, status } : l))
          )
          setSelectedIds([])
          return t('admin:bulkSuccess')
        },
        error: t('admin:bulkError'),
      }
    )
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredListings.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredListings.map((l) => l.id))
    }
  }

  // Suspicion Logic
  const getSuspicion = (listing: Listing): SuspicionIssue[] => {
    const issues: SuspicionIssue[] = []
    if (listing.price < 50 && listing.price > 0 && listing.currency === 'EUR') {
      issues.push({
        label: t('admin:suspiciousPrice'),
        color: 'bg-amber-500',
        icon: AlertTriangle,
      })
    }
    if (!listing.images || listing.images.length === 0) {
      issues.push({
        label: t('admin:noImages'),
        color: 'bg-destructive',
        icon: Tag,
      })
    }
    const userCreatedAt = listing.user?.created_at
    const createdDate = userCreatedAt ? new Date(userCreatedAt) : null
    const daysOld =
      createdDate && !isNaN(createdDate.getTime())
        ? (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
        : 100 // Assume old if no valid date
    if (daysOld < 2) {
      issues.push({
        label: t('admin:newSeller'),
        color: 'bg-blue-500',
        icon: UserPlus,
      })
    }
    return issues
  }

  // Filtering & Sorting
  const filteredListings = useMemo(() => {
    let result = listings

    if (activeTab !== 'all') {
      if (activeTab === 'pending')
        result = result.filter(
          (l) => l.status === 'draft' || l.status === 'pending'
        )
      else result = result.filter((l) => l.status === activeTab)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.user?.display_name?.toLowerCase() || '').includes(q)
      )
    }

    return [...result].sort((a, b) => {
      const aValue = a[sortColumn as keyof Listing]
      const bValue = b[sortColumn as keyof Listing]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      return sortDirection === 'asc'
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1
    })
  }, [listings, activeTab, searchQuery, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const columns: Column<Listing>[] = [
    {
      key: 'select',
      header: (
        <Checkbox
          checked={
            filteredListings.length > 0 &&
            selectedIds.length === filteredListings.length
          }
          onCheckedChange={toggleSelectAll}
          aria-label={t('common:selectAll')}
          className="border-border/60"
        />
      ),
      cell: (row) => (
        <Checkbox
          checked={selectedIds.includes(row.id)}
          onCheckedChange={() => toggleSelect(row.id)}
          aria-label={`Select ${row.title}`}
          className="border-border/60"
        />
      ),
      className: 'w-[40px]',
    },
    {
      key: 'title',
      header: t('admin:tableListing'),
      sortable: true,
      className: 'min-w-[400px]',
      cell: (row) => (
        <div className="group/item flex items-center gap-4">
          <div className="bg-muted border-border/40 group-hover/item:border-primary/30 relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition-all">
            {row.images?.[0] ? (
              <Image
                src={row.images[0]}
                alt={row.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="text-muted-foreground/30 flex h-full w-full items-center justify-center">
                <Tag className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Link
              href={`/${locale}/listings/${row.id}`}
              target="_blank"
              className="hover:text-primary line-clamp-1 flex items-center gap-2 text-sm leading-tight font-bold tracking-tight transition-colors"
            >
              {row.title}
              <Eye className="h-3 w-3 opacity-0 group-hover/item:opacity-40" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-primary text-[11px] font-bold tracking-wider uppercase">
                {formatPrice(row.price)} {row.currency}
              </span>
              <span className="text-muted-foreground/20 text-[11px] font-bold">
                •
              </span>
              <span className="text-muted-foreground/50 text-[10px] font-bold tracking-widest uppercase">
                {row.category_id}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      header: t('admin:tableSeller'),
      className: 'min-w-[160px]',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground border-border/40 flex h-8 w-8 items-center justify-center rounded-xl border">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="max-w-[120px] truncate text-sm font-bold tracking-tight">
              {row.user?.display_name || 'User'}
            </span>
            <span className="text-muted-foreground/40 text-[9px] font-bold tracking-wider uppercase">
              {row.user?.created_at &&
              !isNaN(new Date(row.user.created_at).getTime())
                ? new Date(row.user.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: t('admin:tableStatus'),
      sortable: true,
      cell: (row) => {
        const statusObj = {
          active: {
            bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            label: t('admin:statusActive'),
          },
          pending: {
            bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
            label: t('admin:statusPending'),
          },
          draft: {
            bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
            label: t('admin:statusDraft'),
          },
          rejected: {
            bg: 'bg-destructive/10 text-destructive border-destructive/20',
            label: t('admin:statusRejected'),
          },
        }
        const current = (statusObj as any)[row.status] || statusObj.draft
        return (
          <Badge
            variant="outline"
            className={cn(
              'rounded-md border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase',
              current.bg
            )}
          >
            {current.label}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleAction(row.id, 'active')}
            className="border-border/40 h-8 w-8 rounded-xl transition-all hover:border-emerald-500/20 hover:bg-emerald-500/5 hover:text-emerald-500"
            title={t('admin:approve')}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleAction(row.id, 'rejected')}
            className="border-border/40 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 h-8 w-8 rounded-xl transition-all"
            title={t('admin:reject')}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const stats = [
    { value: 'all', label: t('admin:allListings'), count: listings.length },
    {
      value: 'pending',
      label: t('admin:pendingReview'),
      count: listings.filter(
        (l) => l.status === 'draft' || l.status === 'pending'
      ).length,
    },
    {
      value: 'active',
      label: t('admin:statusActive'),
      count: listings.filter((l) => l.status === 'active').length,
    },
    {
      value: 'rejected',
      label: t('admin:statusRejected'),
      count: listings.filter((l) => l.status === 'rejected').length,
    },
  ]

  return (
    <div className="space-y-8 pb-32">
      <ListingsHeader />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-8"
      >
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <TabsList className="bg-muted/40 border-border/40 h-auto flex-wrap rounded-xl border p-1">
            {stats.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-xl px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:shadow-lg"
              >
                {tab.label}
                <span
                  className={cn(
                    'ml-3 rounded-xl border px-2 py-0.5 text-[9px] font-bold',
                    tab.value === 'pending' && tab.count > 0
                      ? 'bg-primary border-primary shadow-primary/20 text-white shadow-lg'
                      : 'bg-muted-foreground/5 text-muted-foreground/40 border-border/40'
                  )}
                >
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {activeTab === 'pending' ? (
          <ModerationQueue
            listings={filteredListings}
            isLoading={isLoading}
            getSuspicion={getSuspicion}
            handleAction={handleAction}
            locale={locale}
          />
        ) : (
          <AdminListingsTable
            columns={columns}
            data={filteredListings}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSearch={setSearchQuery}
            isLoading={isLoading}
          />
        )}
      </Tabs>

      <AnimatePresence>
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onAction={handleBulkAction}
          onClear={() => setSelectedIds([])}
        />
      </AnimatePresence>
    </div>
  )
}
