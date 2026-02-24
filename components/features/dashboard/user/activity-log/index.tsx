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
// Removed unused EmptyState import

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
      <div className="relative overflow-hidden rounded-[2rem] p-8">
        <div className="border-white/3 absolute inset-0 rounded-[2.5rem] border" />
        <div className="flex flex-col gap-2">
          <h1 className="text-foreground flex items-center gap-4 text-4xl font-black tracking-tight uppercase">
            <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 shadow-xl shadow-primary/10">
              <Activity className="text-primary h-8 w-8" />
            </div>
            {t('dashboard:activityLog.title')}
          </h1>
          <p className="text-muted-foreground/60 ml-[72px] text-xs font-bold tracking-wide uppercase">
            {t('dashboard:activityLog.subtitle')}
          </p>
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="glass-panel hover:bg-primary/2 group relative border-none p-8 shadow-xl! shadow-black/5 transition-all duration-500">
          <div className="divide-border/10 divide-y">
            <AnimatePresence mode="popLayout">
              {logs.map((log) => {
                const { icon: Icon, color, bg } = getActionIcon(log.action)
                return (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group relative hover:bg-primary/2 p-6 transition-all duration-300"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-primary/0 transition-all group-hover:bg-primary/40" />

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                      <div
                        className={cn(
                          'relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3',
                          bg,
                          color
                        )}
                      >
                        <div className="absolute inset-0 -z-10 rounded-2xl bg-white/5 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                        <Icon className="h-7 w-7" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge
                            variant="outline"
                            className="bg-primary/5 text-primary border-primary/20 rounded-xl px-3 py-1 text-[10px] font-black tracking-wide uppercase shadow-sm"
                          >
                            {log.action.replace('_', ' ')}
                          </Badge>
                          <span className="text-muted-foreground/40 flex items-center gap-2 text-[10px] font-bold tracking-wide uppercase">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                          <div className="bg-black/20 border-white/3 shadow-inner! relative flex items-start gap-3 rounded-2xl border p-4 transition-colors group-hover:bg-black/30">
                            <Terminal className="text-primary/40 mt-1 h-4 w-4 shrink-0" />
                            <div className="text-muted-foreground/80 font-mono text-[11px] font-medium leading-relaxed break-all">
                              {JSON.stringify(log.metadata, null, 2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-muted-foreground/30 flex items-center gap-4 text-[10px] font-bold tracking-wide uppercase sm:flex-col sm:items-end sm:gap-2">
                        <div className="bg-muted/30 flex items-center gap-2 rounded-xl px-3 py-1.5 backdrop-blur-sm">
                          <Globe className="h-3.5 w-3.5 opacity-60" />
                          {log.ip_address || t('dashboard:activityLog.internal')}
                        </div>
                        <span className="bg-primary/5 rounded-md px-2 py-0.5 text-[9px] opacity-40 sm:inline">
                          REF #{log.id.slice(0, 8)}
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
        <div className="glass-panel flex flex-col items-center justify-center border-none py-24 shadow-2xl! shadow-black/5">
          <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] shadow-xl shadow-primary/5">
            <Activity className="text-primary/40 h-10 w-10" />
          </div>
          <h3 className="text-foreground text-2xl font-black tracking-tight uppercase">
            {t('dashboard:activityLog.noActivity')}
          </h3>
          <p className="text-muted-foreground/60 mt-2 max-w-xs text-center text-xs font-bold tracking-wide uppercase">
            {t('dashboard:activityLog.noActivityDesc')}
          </p>
        </div>
      )}
    </div>
  )
}
