'use client'

import { useState, useEffect } from 'react'
import { activityApi, type ActivityLog } from '@/lib/api/activity'
import { useAuth } from '@/components/providers/auth-provider'
import { useTranslation } from '@/lib/i18n'
import {
  Activity,
  Clock,
  Globe,
  Terminal,
  Info,
  CheckCircle2,
  XCircle,
  PlusCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState } from '@/components/ui/empty-state'

export function ActivityLogView() {
  const { t } = useTranslation(['common', 'dashboard'])
  const { user } = useAuth()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadLogs()
    }
  }, [user])

  const loadLogs = async () => {
    setIsLoading(true)
    const { data } = await activityApi.getMyLogs(50)
    if (data) setLogs(data)
    setIsLoading(false)
  }

  const getActionIcon = (action: string) => {
    if (action.includes('create'))
      return {
        icon: PlusCircle,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
      }
    if (action.includes('update'))
      return { icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-500/10' }
    if (action.includes('delete') || action.includes('cancel'))
      return {
        icon: XCircle,
        color: 'text-destructive',
        bg: 'bg-destructive/10',
      }
    if (action.includes('purchase') || action.includes('payment'))
      return { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' }
    return { icon: Info, color: 'text-muted-foreground', bg: 'bg-muted' }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
          <Activity className="text-primary h-8 w-8" />
          {t('dashboard:activityLog.title')}
        </h1>
        <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
          {t('dashboard:activityLog.subtitle')}
        </p>
      </div>

      {logs.length > 0 ? (
        <div className="border-border/60 bg-card overflow-hidden rounded-2xl border shadow-sm">
          <div className="divide-border/40 divide-y">
            <AnimatePresence mode="popLayout">
              {logs.map((log) => {
                const { icon: Icon, color, bg } = getActionIcon(log.action)
                return (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/30 p-6 transition-colors"
                  >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                      <div
                        className={cn(
                          'border-border/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border',
                          bg,
                          color
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge
                            variant="outline"
                            className="bg-muted text-muted-foreground border-border/40 rounded-md px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
                          >
                            {log.action.replace('_', ' ')}
                          </Badge>
                          <span className="text-muted-foreground/60 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
                            <Clock className="h-3 w-3" />
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                          <div className="bg-muted/20 border-border/40 flex items-start gap-2 rounded-lg border p-3">
                            <Terminal className="text-muted-foreground/60 mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <div className="text-muted-foreground font-mono text-[11px] font-medium break-all">
                              {JSON.stringify(log.metadata)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-muted-foreground/30 flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase sm:flex-col sm:items-end sm:gap-1">
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3 w-3" />
                          {log.ip_address ||
                            t('dashboard:activityLog.internal')}
                        </div>
                        <span className="hidden sm:inline">
                          Ref: #{log.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          title={t('dashboard:activityLog.noActivity')}
          description={t('dashboard:activityLog.noActivityDesc')}
        />
      )}
    </div>
  )
}
