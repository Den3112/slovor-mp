'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { reportsApi, type ReportWithDetails } from '@/lib/api'
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import {
  DataGrid,
  type Column,
} from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdminReportsView() {
  const { t } = useTranslation(['common', 'admin'])
  const [reports, setReports] = useState<ReportWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all') // all, pending, resolved, dismissed

  // Sorting state
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const loadReports = useCallback(async () => {
    setIsLoading(true)
    const { data } = await reportsApi.getAll()
    if (data) setReports(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const handleAction = async (id: string, status: 'resolved' | 'dismissed') => {
    const { error } = await reportsApi.updateStatus(id, status)
    if (error) {
      toast.error(error)
    } else {
      toast.success(
        status === 'resolved'
          ? t('admin:reportResolved')
          : t('admin:reportDismissed')
      )
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
    }
  }

  // Filtering & Sorting
  const filteredReports = useMemo(() => {
    let result = reports

    // Tab Filter
    if (activeTab !== 'all') {
      result = result.filter((r) => r.status === activeTab)
    }

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.reason.toLowerCase().includes(query) ||
          r.listing?.title.toLowerCase().includes(query) ||
          r.reporter?.display_name?.toLowerCase().includes(query)
      )
    }

    // Sorting
    result.sort((a: any, b: any) => {
      const aValue =
        sortColumn === 'created_at'
          ? new Date(a[sortColumn]).getTime()
          : a[sortColumn]
      const bValue =
        sortColumn === 'created_at'
          ? new Date(b[sortColumn]).getTime()
          : b[sortColumn]

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [reports, activeTab, searchQuery, sortColumn, sortDirection])

  const columns: Column<ReportWithDetails>[] = [
    {
      key: 'listing_id',
      header: t('admin:tableTarget'),
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="bg-muted relative h-10 w-10 min-w-[40px] shrink-0 overflow-hidden rounded-xl border">
            {row.listing ? (
              row.listing.images && row.listing.images[0] ? (
                <Image
                  src={row.listing.images[0]}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                  <ExternalLink className="h-4 w-4" />
                </div>
              )
            ) : row.reported_user ? (
              row.reported_user.avatar_url ? (
                <Image
                  src={row.reported_user.avatar_url}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              )
            ) : (
              <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-0.5">
            <p className="text-foreground line-clamp-1 max-w-[200px] text-sm font-bold tracking-tight">
              {row.listing?.title ||
                row.reported_user?.display_name ||
                t('admin:unknownTarget')}
            </p>
            {row.listing ? (
              <Link
                href={`/listings/${row.listing.id}`}
                target="_blank"
                className="text-primary hover:text-primary/80 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors"
              >
                {t('admin:viewListing')} <ExternalLink className="h-3 w-3" />
              </Link>
            ) : row.reported_user ? (
              <Link
                href={`/users/${row.reported_user_id}`}
                target="_blank"
                className="text-primary hover:text-primary/80 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors"
              >
                {t('admin:viewUserProfile')} <User className="h-3 w-3" />
              </Link>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      key: 'reason',
      header: t('admin:tableReason'),
      cell: (row) => (
        <div className="max-w-[320px] space-y-1.5">
          <p className="text-destructive/80 text-[10px] leading-none font-bold tracking-widest uppercase">
            {row.reason}
          </p>
          <p className="text-muted-foreground/80 line-clamp-2 text-xs leading-relaxed font-medium">
            {row.description}
          </p>
        </div>
      ),
    },
    {
      key: 'reporter_id',
      header: t('admin:tableReporter'),
      cell: (row) => (
        <div className="flex flex-col space-y-1.5">
          <div className="text-foreground flex items-center gap-2 text-xs font-bold tracking-tight">
            <User className="text-muted-foreground/60 h-3.5 w-3.5" />
            {row.reporter?.display_name || t('admin:anonymous')}
          </div>
          <div className="text-muted-foreground/40 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
            <Calendar className="h-3 w-3" />
            {new Date(row.created_at).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: t('admin:tableStatus'),
      cell: (row) => {
        const statusStyles = {
          pending:
            'bg-destructive/10 text-destructive border-destructive/20 dot-destructive',
          resolved:
            'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dot-emerald-500',
          dismissed:
            'bg-muted text-muted-foreground border-border/40 dot-muted-foreground/40',
        }
        const dotStyles = {
          pending: 'bg-destructive',
          resolved: 'bg-emerald-500',
          dismissed: 'bg-muted-foreground/40',
        }
        const currentStatus = row.status as keyof typeof statusStyles

        return (
          <Badge
            variant="outline"
            className={cn(
              'flex h-6 w-fit items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase',
              statusStyles[currentStatus] || statusStyles.dismissed
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                dotStyles[currentStatus] || dotStyles.dismissed
              )}
            />
            {t(`admin:${row.status}`)}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      header: <span className="sr-only">{t('admin:tableActions')}</span>,
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction(row.id, 'resolved')}
                className="bg-background border-border/60 h-8 gap-1.5 px-3 text-[10px] font-bold tracking-widest uppercase transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-600"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t('admin:resolve')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction(row.id, 'dismissed')}
                className="bg-background hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 border-border/60 h-8 gap-1.5 px-3 text-[10px] font-bold tracking-widest uppercase transition-all"
              >
                <XCircle className="h-3.5 w-3.5" />
                {t('admin:dismiss')}
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground text-3xl font-bold tracking-tight uppercase">
            {t('admin:reportsTitle')}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
            <AlertTriangle className="text-destructive h-3.5 w-3.5" />
            {t('admin:reviewResolveComplaints')}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <TabsList className="bg-muted/40 border-border/40 h-auto flex-wrap justify-start rounded-xl border p-1">
            {['all', 'pending', 'resolved', 'dismissed'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-xl px-4 py-2 text-[9px] font-bold tracking-widest uppercase transition-all data-[state=active]:shadow-sm"
              >
                {tab === 'all' ? t('common:all') : t(`admin:${tab}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DataGrid
            data={filteredReports}
            columns={columns}
            isLoading={isLoading}
            onSearch={setSearchQuery}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={(col) => {
              if (sortColumn === col) {
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              } else {
                setSortColumn(col)
                setSortDirection('desc')
              }
            }}
            searchPlaceholder={t('admin:searchReports')}
          />
        </motion.div>
      </Tabs>
    </div>
  )
}
