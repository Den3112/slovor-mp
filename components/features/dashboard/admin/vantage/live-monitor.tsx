'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Globe,
  Shield,
  User,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { adminApi } from '@/lib/api/admin'

interface Event {
  id: string
  type: 'visit' | 'moderation' | 'user' | 'order' | 'alert'
  label: string
  user?: string
  timestamp: Date
  location?: string
}

export function LiveMonitor() {
  const { t } = useTranslation(['admin'])
  const [events, setEvents] = useState<Event[]>([])

  // Use real data from logs for initial pulse
  useEffect(() => {
    async function loadRecentEvents() {
      try {
        const { data, error } = await adminApi.getActivityLogs(10)
        if (error) throw new Error(error)

        if (data) {
          const mappedEvents: Event[] = data.map((log: any) => {
            let type: Event['type'] = 'visit'
            if (log.action.includes('order')) type = 'order'
            else if (
              log.action.includes('verify') ||
              log.action.includes('moderate')
            )
              type = 'moderation'
            else if (
              log.action.includes('register') ||
              log.action.includes('user')
            )
              type = 'user'
            else if (
              log.action.includes('error') ||
              log.action.includes('fail')
            )
              type = 'alert'

            return {
              id: log.id,
              type,
              label: t(`admin:action_${log.action}`) || log.action,
              timestamp: new Date(log.created_at),
              location: log.ip_address || 'Cloud Environment',
              user: log.profiles?.display_name,
            }
          })
          setEvents(mappedEvents)
        }
      } catch (err) {
        console.error('Failed to load monitor events:', err)
      }
    }

    loadRecentEvents()

    // Simulate real-time pulses mixed with real data for the "Live" feel
    const interval = setInterval(() => {
      const types: Event['type'][] = [
        'visit',
        'moderation',
        'user',
        'order',
        'alert',
      ]
      const labels = [
        'New session started',
        'Heartbeat active',
        'Encryption verified',
        'Node status: Healthy',
      ]

      const type = types[
        Math.floor(Math.random() * types.length)
      ] as Event['type']
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        label: labels[Math.floor(Math.random() * labels.length)] || '',
        timestamp: new Date(),
        location: ['Bratislava', 'Kosice', 'Trnava', 'Berlin', 'Prague'][
          Math.floor(Math.random() * 5)
        ],
      }

      setEvents((prev) => [newEvent, ...prev].slice(0, 10))
    }, 15000)

    return () => clearInterval(interval)
  }, [t])

  return (
    <div className="bg-card border-border/50 flex h-full flex-col items-stretch overflow-hidden rounded-2xl border shadow-sm">
      <div className="border-border/10 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
            <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
          </div>
          <h3 className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('admin:liveMonitor') || 'Live Monitor'}
          </h3>
        </div>
        <Globe className="text-muted-foreground h-3.5 w-3.5 opacity-50" />
      </div>

      <div className="scrollbar-hide flex-1 space-y-3 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20 }}
              className="group flex items-start gap-3"
            >
              <div
                className={cn(
                  'ring-border/50 mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl shadow-xs ring-1 transition-colors',
                  event.type === 'order' && 'bg-green-500/10 text-green-500',
                  event.type === 'alert' && 'bg-red-500/10 text-red-500',
                  event.type === 'moderation' && 'bg-blue-500/10 text-blue-500',
                  event.type === 'user' && 'bg-purple-500/10 text-purple-500',
                  event.type === 'visit' && 'bg-orange-500/10 text-orange-500'
                )}
              >
                {event.type === 'order' && (
                  <ShoppingBag className="h-3.5 w-3.5" />
                )}
                {event.type === 'alert' && (
                  <AlertCircle className="h-3.5 w-3.5" />
                )}
                {event.type === 'moderation' && (
                  <Shield className="h-3.5 w-3.5" />
                )}
                {event.type === 'user' && <User className="h-3.5 w-3.5" />}
                {event.type === 'visit' && <Globe className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-foreground truncate text-xs font-semibold">
                  {event.label}
                </p>
                <div className="text-muted-foreground/60 flex items-center gap-2 text-[10px]">
                  <span className="font-mono">
                    {event.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                  <span className="bg-border/20 h-px w-3" />
                  <span>{event.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <Activity className="mb-2 h-8 w-8 animate-pulse" />
            <p className="text-[10px] font-bold tracking-widest uppercase">
              {t('admin:waitingPulses') || 'Waiting for pulses...'}
            </p>
          </div>
        )}
      </div>

      <div className="bg-muted/30 border-border/10 border-t px-4 py-2">
        <button
          className="text-primary hover:text-primary-foreground hover:bg-primary flex w-full items-center justify-center gap-2 rounded-xl py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all"
          aria-label={t('admin:viewDetailStream') || 'View Detail Stream'}
        >
          {t('admin:viewDetailStream') || 'View Detail Stream'}
        </button>
      </div>
    </div>
  )
}
