'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { History, ArrowRight, User, Terminal, Info, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { adminApi } from '@/lib/api/admin'
import { formatDistanceToNow } from 'date-fns'
import { ru, enUS } from 'date-fns/locale'

interface Action {
  id: string
  action: string
  user: string
  target: string
  timestamp: string
  status: 'success' | 'warning' | 'info'
}

export function ActionStream() {
  const { t, locale } = useTranslation(['admin'])
  const [actions, setActions] = useState<Action[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const { data, error } = await adminApi.getActivityLogs(10)
        if (error) throw new Error(error)

        if (data) {
          const mappedActions: Action[] = data.map((log: any) => {
            // Determine status based on action type
            let status: Action['status'] = 'info'
            if (log.action.includes('error') || log.action.includes('fail') || log.action.includes('ban')) {
              status = 'warning'
            } else if (log.action.includes('success') || log.action.includes('create') || log.action.includes('verify')) {
              status = 'success'
            }

            return {
              id: log.id,
              action: t(`admin:action_${log.action}`) || log.action,
              user: log.profiles?.display_name || t('admin:anonymous'),
              target: log.metadata?.target || log.metadata?.path || '-',
              timestamp: formatDistanceToNow(new Date(log.created_at), {
                addSuffix: true,
                locale: locale === 'ru' ? ru : enUS
              }),
              status
            }
          })
          setActions(mappedActions)
        }
      } catch (err) {
        console.error('Failed to fetch activity logs:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()

    // Refresh every minute
    const interval = setInterval(fetchLogs, 60000)
    return () => clearInterval(interval)
  }, [t, locale])

  return (
    <div className="bg-card border-border/50 flex flex-col overflow-hidden rounded-2xl border shadow-sm">
      <div className="border-border/10 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <History className="text-primary h-4 w-4" />
          <h3 className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('admin:operationalPulse') || 'Action Stream'}
          </h3>
        </div>
        <Terminal className="text-muted-foreground h-3.5 w-3.5 opacity-50" />
      </div>

      <div className="divide-border/5 divide-y">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : actions.length > 0 ? (
          actions.map((action, idx) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group hover:bg-muted/30 relative flex items-center gap-4 px-4 py-3 transition-colors"
            >
              <div
                className={cn(
                  'flex h-2 w-2 rounded-full',
                  action.status === 'success' &&
                  'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]',
                  action.status === 'warning' &&
                  'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
                  action.status === 'info' &&
                  'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                )}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-foreground truncate text-xs font-bold tracking-wider uppercase">
                    {action.action}
                  </span>
                  <span className="text-muted-foreground/60 text-[10px]">
                    {action.timestamp}
                  </span>
                </div>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 overflow-hidden text-[10px]">
                  <div className="flex shrink-0 items-center gap-1">
                    <User className="h-2.5 w-2.5" />
                    <span>{action.user}</span>
                  </div>
                  <ArrowRight className="h-2 w-2 shrink-0 opacity-30" />
                  <span className="truncate italic">{action.target}</span>
                </div>
              </div>

              <button
                className="bg-muted text-muted-foreground/60 group-hover:bg-primary group-hover:text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100"
                aria-label={t('admin:viewDetails') || 'View Details'}
              >
                <Info className="h-3 w-3" />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="text-muted-foreground/40 py-12 text-center text-[10px] font-bold tracking-widest uppercase">
            {t('admin:noActivity') || 'No recent activity'}
          </div>
        )}
      </div>

      <button className="bg-muted/20 text-muted-foreground hover:bg-muted flex w-full items-center justify-center py-3 text-[10px] font-bold tracking-widest uppercase transition-all">
        {t('admin:fullAuditLog') || 'Full Audit Log'}
      </button>
    </div>
  )
}
