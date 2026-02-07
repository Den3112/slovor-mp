'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { verificationApi, adminApi } from '@/lib/api'
import {
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  FileText,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import {
  DataGrid,
  type Column,
} from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdminVerificationsView() {
  const { t } = useTranslation(['common', 'admin'])
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Sorting state
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const loadRequests = useCallback(async () => {
    setIsLoading(true)
    const { data } = await verificationApi.getAdminAll()
    if (data) setRequests(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  const handleAction = async (
    id: string,
    userId: string,
    status: 'approved' | 'rejected'
  ) => {
    try {
      let result
      if (status === 'approved') {
        result = await verificationApi.approveVerification(id, userId)
      } else {
        result = await verificationApi.rejectVerification(id)
      }

      if (result.error) throw new Error(result.error)
      toast.success(
        status === 'approved'
          ? t('admin:verificationApproved')
          : t('admin:verificationRejected')
      )
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )

      // Log action
      adminApi.logAction({
        target_id: userId,
        target_type: 'user',
        action_type: status === 'approved' ? 'verify' : ('reject' as any),
        reason: `Admin ${status} document verification`,
      })
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  // Filtering & Sorting
  const filteredRequests = useMemo(() => {
    let result = requests

    if (activeTab !== 'all') {
      result = result.filter((r) => r.status === activeTab)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.profile?.display_name?.toLowerCase().includes(query) ||
          r.user_id.toLowerCase().includes(query)
      )
    }

    result.sort((a, b) => {
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
  }, [requests, activeTab, searchQuery, sortColumn, sortDirection])

  const columns: Column<any>[] = [
    {
      key: 'user_id',
      header: t('admin:tableUser'),
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="bg-muted relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            {row.profile?.avatar_url ? (
              <Image
                src={row.profile.avatar_url}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <User className="text-muted-foreground/40 absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-foreground text-sm font-bold">
              {row.profile?.display_name || t('admin:anonymous')}
            </p>
            <p className="text-muted-foreground max-w-[120px] truncate text-[10px]">
              {row.user_id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: t('admin:tableDocuments'),
      cell: (row) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-500">
            <FileText className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {t(`verification:${row.type}`)}
            </span>
          </div>
          <div className="flex max-w-[200px] gap-1 overflow-x-auto">
            {row.document_url && (
              <a
                href={row.document_url}
                target="_blank"
                className="border-border/50 group/img relative h-10 w-10 shrink-0 cursor-zoom-in overflow-hidden rounded-lg border"
              >
                <Image
                  src={row.document_url}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/img:opacity-100">
                  <Eye className="h-4 w-4 text-white" />
                </div>
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: t('admin:tableRequested'),
      sortable: true,
      cell: (row) => (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(row.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'status',
      header: t('admin:tableStatus'),
      cell: (row) => (
        <Badge
          variant="outline"
          className={cn(
            'flex h-6 w-fit items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase',
            row.status === 'pending'
              ? 'bg-warning/10 text-warning border-warning/20'
              : row.status === 'approved'
                ? 'bg-success/10 text-success border-success/20'
                : 'bg-destructive/10 text-destructive border-destructive/20'
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 shrink-0 rounded-full',
              row.status === 'pending'
                ? 'bg-warning'
                : row.status === 'approved'
                  ? 'bg-success'
                  : 'bg-destructive'
            )}
          />
          {t(`admin:${row.status}`)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: t('admin:tableActions'),
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction(row.id, row.user_id, 'approved')}
                className="bg-background hover:bg-success/5 hover:text-success hover:border-success/30 border-border/60 h-8 gap-1.5 rounded-lg px-3 text-[10px] font-bold tracking-widest uppercase transition-all"
                title={t('admin:approve')}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction(row.id, row.user_id, 'rejected')}
                className="bg-background hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 border-border/60 h-8 gap-1.5 rounded-lg px-3 text-[10px] font-bold tracking-widest uppercase transition-all"
                title={t('admin:reject')}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
            <FileText className="text-primary h-8 w-8" />
            {t('admin:identityChecks')}
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('admin:reviewVerifyDocs')}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <TabsList className="bg-muted/40 border-border/40 h-auto flex-wrap justify-start rounded-lg border p-1">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-lg px-4 py-2 text-[9px] font-bold tracking-widest uppercase transition-all data-[state=active]:shadow-sm"
              >
                {tab === 'all' ? t('common:all') : t(`admin:${tab}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <DataGrid
          data={filteredRequests}
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
          searchPlaceholder={t('admin:searchUsers')}
        />
      </motion.div>
    </div>
  )
}
