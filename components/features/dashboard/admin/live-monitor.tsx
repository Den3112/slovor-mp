'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Clock } from 'lucide-react'

export function LiveMonitor() {
  const { t } = useTranslation(['admin', 'common'])
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadLogs = async () => {
      const { data } = await adminApi.getActivityLogs(10)
      if (data) setLogs(data)
      setIsLoading(false)
    }

    loadLogs()
    const interval = setInterval(loadLogs, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex animate-pulse gap-3">
            <div className="bg-muted h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="bg-muted h-3 w-3/4 rounded" />
              <div className="bg-muted h-2 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <h4 className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
        <Activity className="text-primary h-3.5 w-3.5" />
        {t('admin:liveActivity')}
      </h4>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex items-start gap-3"
            >
              <div className="bg-muted border-border/40 group-hover:bg-primary/5 relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors">
                <Activity className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 transition-colors" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground mb-1 line-clamp-1 text-xs leading-none font-bold">
                  {log.event_type}
                </p>
                <div className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-medium">
                  <Clock className="h-2.5 w-2.5" />
                  <span>
                    {new Date(log.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>•</span>
                  <span className="truncate">
                    {log.description ||
                      log.payload?.title ||
                      t('admin:systemEvent')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {logs.length === 0 && (
          <div className="py-4 text-center">
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {t('admin:noActivity')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
