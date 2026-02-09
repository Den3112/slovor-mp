'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'

import {
  CheckCircle2,
  XCircle,
  User,
  FileText,
  Shield,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DataGrid,
  type Column,
} from '@/components/features/dashboard/shared/data-grid'
import { verificationApi, adminApi } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface VerificationRequest {
  id: string
  user_id: string
  type: string
  document_url: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  profile: {
    id: string
    display_name: string
    avatar_url: string | null
    phone: string | null
  }
}

export function AdminVerificationView() {
  const { t } = useTranslation(['common', 'admin', 'dashboard', 'verification'])
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedRequest, setSelectedRequest] =
    useState<VerificationRequest | null>(null)

  // Sorting state
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await verificationApi.getAdminAll()
      if (error) throw error
      if (data) setRequests(data as any)
    } catch (error) {
      toast.error(t('common:errorLoadingData'))
    } finally {
      setIsLoading(false)
    }
  }, [t])

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
      setSelectedRequest(null)

      // Log action
      adminApi.logAction({
        target_id: userId,
        target_type: 'user',
        action_type: status === 'approved' ? 'verify' : ('reject' as any),
        reason: `Admin ${status} document verification`,
      })
    } catch (error) {
      toast.error((error as Error).message || t('common:errorOccurred'))
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

    return [...result].sort((a, b) => {
      const aValue =
        sortColumn === 'created_at'
          ? new Date(a.created_at).getTime()
          : (a as any)[sortColumn]
      const bValue =
        sortColumn === 'created_at'
          ? new Date(b.created_at).getTime()
          : (b as any)[sortColumn]

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [requests, activeTab, searchQuery, sortColumn, sortDirection])

  const columns: Column<VerificationRequest>[] = [
    {
      key: 'user_id',
      header: t('admin:tableUser'),
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="bg-muted border-border/40 relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border">
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
              <User className="text-muted-foreground/30 absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-foreground text-sm font-bold tracking-tight">
              {row.profile?.display_name || t('admin:anonymous')}
            </p>
            <p className="text-muted-foreground max-w-[120px] truncate text-[10px] font-bold tracking-widest uppercase">
              ID: #{row.user_id.split('-')[0]}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: t('admin:tableDocuments'),
      cell: (row) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-indigo-500">
            <FileText className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {t(`verification:${row.type}`)}
            </span>
          </div>
          {row.document_url && (
            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="bg-muted/30 border-border/40 hover:bg-muted/50 h-5 px-1.5 text-[9px] font-bold uppercase transition-colors"
              >
                <LinkIcon className="mr-1 h-2.5 w-2.5" />
                {t('admin:viewDocument')}
              </Badge>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: t('admin:tableRequested'),
      sortable: true,
      cell: (row) => (
        <div className="text-muted-foreground flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase">
          <Clock className="h-3 w-3" />
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
      header: '',
      className: 'text-right',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedRequest(row)}
          className="bg-background hover:bg-muted border-border/60 h-8 rounded-lg px-4 text-[10px] font-bold tracking-widest uppercase transition-all"
        >
          {t('admin:reviewVerifyDocs')}
        </Button>
      ),
    },
  ]

  const stats = [
    { value: 'all', label: t('common:all'), count: requests.length },
    {
      value: 'pending',
      label: t('admin:pending'),
      count: requests.filter((r) => r.status === 'pending').length,
    },
    {
      value: 'approved',
      label: t('admin:approved'),
      count: requests.filter((r) => r.status === 'approved').length,
    },
    {
      value: 'rejected',
      label: t('admin:rejected'),
      count: requests.filter((r) => r.status === 'rejected').length,
    },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
            <Shield className="text-primary h-8 w-8" />
            {t('admin:identityChecks')}
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('admin:reviewVerifyDocs')}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/40 border-border/40 h-auto flex-wrap rounded-xl border p-1">
          {stats.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-lg px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all data-[state=active]:shadow-lg"
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={cn(
                    'ml-3 rounded-lg border px-2 py-0.5 text-[9px] font-bold',
                    tab.value === 'pending'
                      ? 'bg-primary border-primary shadow-primary/20 text-white shadow-lg'
                      : 'bg-muted-foreground/5 text-muted-foreground/40 border-border/40'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
        emptyMessage={t('admin:noVerificationRequests')}
      />

      <Dialog
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      >
        <DialogContent className="border-border/60 bg-background max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight uppercase">
              {t('admin:reviewVerifyDocs')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {selectedRequest?.profile?.display_name} •{' '}
              {selectedRequest && t(`verification:${selectedRequest.type}`)}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-8 py-4">
              <div className="border-border/40 bg-muted group/doc relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border">
                {selectedRequest.document_url ? (
                  <Image
                    src={selectedRequest.document_url}
                    alt="Document"
                    fill
                    className="object-contain transition-transform duration-500 group-hover/doc:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="text-muted-foreground/40 flex flex-col items-center gap-3">
                    <AlertCircle className="h-12 w-12" />
                    <span className="text-xs font-bold tracking-widest uppercase">
                      {t('admin:noDocumentImage')}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-muted/30 border-border/40 flex items-center justify-between rounded-xl border p-6">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">
                    {t('admin:submitted')}
                  </p>
                  <p className="text-sm font-bold tracking-tight">
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase">
                    {t('admin:status')}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      'flex h-6 w-fit items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase',
                      selectedRequest.status === 'pending'
                        ? 'bg-warning/10 text-warning border-warning/20'
                        : selectedRequest.status === 'approved'
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-destructive/10 text-destructive border-destructive/20'
                    )}
                  >
                    {t(`admin:${selectedRequest.status}`)}
                  </Badge>
                </div>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:bg-destructive/5 hover:text-destructive h-12 rounded-xl px-8 text-[11px] font-bold tracking-widest uppercase transition-all"
                    onClick={() =>
                      handleAction(
                        selectedRequest.id,
                        selectedRequest.user_id,
                        'rejected'
                      )
                    }
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {t('admin:reject')}
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90 shadow-primary/20 h-12 rounded-xl px-10 text-[11px] font-bold tracking-widest text-white uppercase shadow-lg transition-all"
                    onClick={() =>
                      handleAction(
                        selectedRequest.id,
                        selectedRequest.user_id,
                        'approved'
                      )
                    }
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t('admin:approve')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LinkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}
