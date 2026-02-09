'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  LifeBuoy,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { supportApi, type SupportTicket } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

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
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <LifeBuoy className="text-primary h-8 w-8" />
            {t('dashboard:supportCenter')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('dashboard:supportDescription')}
          </p>
        </div>
        <Button
          asChild
          className="shadow-primary/20 h-12 rounded-xl px-6 font-bold tracking-widest uppercase shadow-lg transition-all hover:scale-105"
        >
          <Link href={`/${locale}/dashboard/support/create`}>
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard:createTicket')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <Card className="border-border/40 bg-muted/5">
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
              <div className="bg-muted/20 flex h-16 w-16 items-center justify-center rounded-full">
                <MessageSquare className="text-muted-foreground/40 h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {t('dashboard:noTickets')}
                </h3>
                <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                  {t('dashboard:noTicketsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/${locale}/dashboard/support/${ticket.id}`}>
                <Card className="hover:bg-muted/5 border-border/40 hover:border-primary/20 group cursor-pointer transition-all">
                  <CardContent className="flex items-center justify-between gap-4 p-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="group-hover:text-primary text-lg font-bold transition-colors">
                          {ticket.subject}
                        </span>
                        <StatusBadge status={ticket.status} />
                      </div>
                      <div className="text-muted-foreground flex items-center gap-3 text-xs font-medium tracking-wide uppercase">
                        <span>#{ticket.id.split('-')[0]}</span>
                        <span>•</span>
                        <span>
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="text-foreground/80">
                          {ticket.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'hidden items-center gap-2 text-xs font-bold tracking-widest uppercase md:flex',
                          getStatusColor(ticket.status)
                        )}
                      >
                        {getStatusIcon(ticket.status)}
                        <span className="hidden lg:inline">
                          {t(
                            `admin:tab${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('_', '')}`
                          )}
                        </span>
                      </div>
                      <ChevronRight className="text-muted-foreground/30 group-hover:text-primary h-5 w-5 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
