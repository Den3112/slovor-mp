'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/api'
import { Activity, User, Clock } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import {
  DataGrid,
  type Column,
} from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function AdminActivityLogView() {
  const { t } = useTranslation(['admin', 'common'])
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLogs = logs.filter(
    (log) =>
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.profiles?.display_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  )

  const loadLogs = useCallback(async () => {
    setIsLoading(true)
    const { data } = await adminApi.getActivityLogs(100)
    if (data) setLogs(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  const columns: Column<any>[] = [
    {
      key: 'user',
      header: t('admin:tableUser'),
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="bg-muted border-border/40 relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border">
            {row.profiles?.avatar_url ? (
              <Image
                src={row.profiles.avatar_url}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <User className="text-muted-foreground/40 absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-foreground text-xs font-bold">
              {row.profiles?.display_name || t('admin:system')}
            </p>
            <p className="text-muted-foreground/60 max-w-[100px] truncate text-[10px]">
              {row.user_id || t('admin:automated')}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      header: t('admin:tableAction'),
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              'flex h-5 items-center gap-1.5 rounded border px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase',
              row.action.includes('error')
                ? 'bg-destructive/10 text-destructive border-destructive/20'
                : row.action.includes('login')
                  ? 'border-blue-500/20 bg-blue-500/10 text-blue-500'
                  : row.action.includes('create')
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-muted text-muted-foreground border-border/40'
            )}
          >
            {/* Map common actions to translated strings */}
            {(() => {
              const actionKey = row.action.split('_')[0] // simple mapping or full check
              return t(`admin:action_${actionKey}`) !==
                `admin:action_${actionKey}`
                ? t(`admin:action_${actionKey}`)
                : row.action.replace('_', ' ')
            })()}
          </Badge>
        </div>
      ),
    },
    {
      key: 'metadata',
      header: t('admin:fullDetails'),
      cell: (row) => (
        <div className="text-muted-foreground max-w-[300px] truncate text-[11px] font-medium">
          {JSON.stringify(row.metadata) !== '{}'
            ? JSON.stringify(row.metadata)
            : t('admin:noExtraData')}
        </div>
      ),
    },
    {
      key: 'ip_address',
      header: t('admin:tableIpSource'),
      cell: (row) => (
        <code className="bg-muted/30 border-border/40 text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-[10px]">
          {row.ip_address || t('admin:internal')}
        </code>
      ),
    },
    {
      key: 'created_at',
      header: t('admin:tableTimestamp'),
      cell: (row) => (
        <div className="text-muted-foreground flex items-center gap-2 text-[11px] font-bold">
          <Clock className="h-3 w-3" />
          {new Date(row.created_at).toLocaleString()}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
            <Activity className="text-primary h-8 w-8" />
            {t('admin:liveMonitor')}
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('admin:auditSystemActions')}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <DataGrid
          data={filteredLogs}
          columns={columns}
          isLoading={isLoading}
          onSearch={setSearchQuery}
          searchPlaceholder={t('admin:searchActivity')}
        />
      </motion.div>
    </div>
  )
}
