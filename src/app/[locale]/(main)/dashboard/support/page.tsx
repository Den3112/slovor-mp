'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, MessageSquare, Clock, ChevronRight, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { supportApi, type SupportTicket } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/features/dashboard/shared/status-badge'

export default function SupportDashboardPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const { t } = useTranslation(['common', 'dashboard', 'admin'])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTickets() {
      try {
        const { data } = await supportApi.getMyTickets()
        if (data) setTickets(data)
      } catch (error) {
        console.error('Failed to load tickets', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTickets()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-destructive'
      case 'in_progress':
        return 'text-amber-600'
      case 'resolved':
        return 'text-emerald-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-5xl space-y-12 p-4 duration-700 md:p-8">
      <div className="relative overflow-hidden rounded-[2.5rem] p-10">
        <div className="bg-primary/5 absolute inset-0 -z-10 blur-3xl" />
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="space-y-3">
            <h1 className="flex items-center gap-4 text-4xl font-black tracking-tighter uppercase sm:text-5xl">
              <div className="bg-primary/10 border-primary/20 text-primary shadow-primary/5 flex h-10 w-10 items-center justify-center rounded-xl border shadow-lg">
                <MessageSquare className="h-5 w-5 stroke-3" />
              </div>
              {t('dashboard:supportCenter')}
            </h1>
            <p className="text-muted-foreground/60 ml-[80px] text-xs font-bold tracking-[0.3em] uppercase">
              {t('dashboard:supportDescription')}
            </p>
          </div>
          <Button
            asChild
            className="shadow-primary/20 h-14 rounded-2xl px-10 text-[11px] font-black tracking-[0.2em] uppercase shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <Link href={`/${locale}/dashboard/support/create`}>
              <Plus className="mr-3 h-5 w-5 stroke-3" />
              {t('dashboard:createTicket')}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="text-primary h-10 w-10 animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="glass-panel flex flex-col items-center justify-center border-none py-32 text-center shadow-2xl! shadow-black/5">
            <div className="bg-primary/10 shadow-primary/5 mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] shadow-xl">
              <MessageSquare className="text-primary/30 h-10 w-10" />
            </div>
            <div className="space-y-3">
              <h3 className="text-foreground text-3xl font-black tracking-tighter uppercase">
                {t('dashboard:noTickets')}
              </h3>
              <p className="text-muted-foreground/60 mx-auto max-w-sm text-[10px] font-black tracking-[0.3em] uppercase">
                {t('dashboard:noTicketsDesc')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/${locale}/dashboard/support/${ticket.id}`}>
                  <div className="glass-panel hover:bg-primary/2 group cursor-pointer border-none p-6 transition-all duration-300">
                    <div className="bg-primary/0 group-hover:bg-primary/40 absolute inset-y-0 left-0 w-1 transition-all" />

                    <div className="flex items-center justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="group-hover:text-primary text-2xl font-black tracking-tighter uppercase transition-colors">
                            {ticket.subject}
                          </span>
                          <StatusBadge status={ticket.status} />
                        </div>
                        <div className="text-muted-foreground/40 flex items-center gap-4 text-[10px] font-black tracking-[0.2em] uppercase">
                          <span className="bg-muted/50 text-primary/60 rounded-md px-2 py-0.5">
                            ID #{ticket.id.split('-')[0]}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="bg-primary/5 text-primary/60 rounded-md px-2 py-0.5">
                            {ticket.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div
                          className={cn(
                            'hidden items-center gap-3 text-[10px] font-black tracking-[0.2em] uppercase md:flex',
                            getStatusColor(ticket.status)
                          )}
                        >
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                          <span className="hidden opacity-60 lg:inline">
                            {t(
                              `admin:tab${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('_', '')}`
                            )}
                          </span>
                        </div>
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                          <ChevronRight className="text-primary h-6 w-6 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
