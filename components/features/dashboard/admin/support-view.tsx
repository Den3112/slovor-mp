'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  ChevronRight,
  User,
  Calendar,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { supportApi, type SupportTicket } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  DataGrid,
  type Column,
} from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdminSupportView() {
  const { t, locale } = useTranslation(['common', 'admin'])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all') // all, open, in_progress, resolved

  const loadTickets = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await supportApi.getAllTickets()
      if (data) setTickets(data)
    } catch (error) {
      toast.error(t('admin:loadTicketsError'))
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  const filteredTickets = useMemo(() => {
    let result = tickets
    if (activeTab !== 'all') {
      result = result.filter((t) => t.status === activeTab)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.user?.display_name?.toLowerCase().includes(q) ||
          t.user?.email?.toLowerCase().includes(q)
      )
    }
    return result
  }, [tickets, activeTab, searchQuery])

  const columns: Column<SupportTicket>[] = [
    {
      key: 'subject',
      header: t('admin:tableTicketSubject'),
      className: 'min-w-[300px]',
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-transform group-hover:scale-110',
              row.status === 'open'
                ? 'bg-destructive/10 text-destructive border-destructive/20'
                : row.status === 'in_progress'
                  ? 'border-amber-500/20 bg-amber-500/10 text-amber-600'
                  : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
            )}
          >
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-foreground line-clamp-1 text-sm font-bold tracking-tight">
              {row.subject}
            </span>
            <div className="mt-0.5 flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-border/40 bg-muted/30 px-1.5 py-0 text-[8px] font-bold tracking-widest uppercase"
              >
                {row.category}
              </Badge>
              <span className="text-muted-foreground/40 text-[10px] font-bold tracking-widest uppercase">
                #{row.id.split('-')[0]}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'user_id',
      header: t('admin:tableRequestedBy'),
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="bg-muted border-border/40 relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border">
            {row.user?.avatar_url ? (
              <Image
                src={row.user.avatar_url}
                alt=""
                fill
                className="object-cover"
              />
            ) : (
              <User className="text-muted-foreground/40 h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-foreground text-xs font-bold">
              {row.user?.display_name || t('admin:anonymous')}
            </span>
            <span className="text-muted-foreground/60 text-[9px] font-bold tracking-tight">
              {row.user?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: t('admin:tablePriority'),
      cell: (row) => {
        const colors = {
          low: 'bg-muted text-muted-foreground border-border/40',
          medium: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          high: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          urgent: 'bg-destructive/10 text-destructive border-destructive/20',
        }
        return (
          <Badge
            variant="outline"
            className={cn(
              'rounded-md px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase',
              colors[row.priority]
            )}
          >
            {t(
              `admin:priority${row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}`
            )}
          </Badge>
        )
      },
    },
    {
      key: 'status',
      header: t('admin:tableStatus'),
      cell: (row) => {
        const styles = {
          open: 'bg-destructive/10 text-destructive border-destructive/20',
          in_progress: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          resolved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
          closed: 'bg-muted text-muted-foreground border-border/40',
        }
        return (
          <Badge
            variant="outline"
            className={cn(
              'rounded-md px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase',
              styles[row.status]
            )}
          >
            {t(
              `admin:tab${row.status
                .split('_')
                .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
                .join('')}`
            )}
          </Badge>
        )
      },
    },
    {
      key: 'created_at',
      header: t('admin:tableLastUpdate'),
      cell: (row) => (
        <div className="text-muted-foreground/60 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
          <Calendar className="h-3 w-3" />
          {new Date(row.updated_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      cell: (row) => (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-lg transition-all"
          asChild
        >
          <Link href={`/${locale}/admin/support/${row.id}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
            <LifeBuoy className="text-primary h-8 w-8" />
            {t('admin:supportCenter')}
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
            {t('admin:manageSupportTickets')}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-destructive/5 text-destructive border-destructive/20 flex h-9 items-center gap-2 rounded-xl px-4 text-[10px] font-bold tracking-widest uppercase"
          >
            <Clock className="h-3.5 w-3.5" />
            {t('admin:avgResponseTime', { time: '4h' })}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <TabsList className="bg-muted/40 border-border/40 h-auto flex-wrap justify-start rounded-xl border p-1">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-background data-[state=active]:text-primary rounded-lg px-5 py-2.5 text-[9px] font-bold tracking-widest uppercase transition-all data-[state=active]:shadow-sm"
              >
                {t(
                  `admin:tab${tab
                    .split('_')
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join('')}`
                )}
                <Badge
                  variant="secondary"
                  className="bg-muted/80 ml-2 h-4 min-w-5 border-transparent px-1.5 py-0 text-[8px] font-bold"
                >
                  {tab === 'all'
                    ? tickets.length
                    : tickets.filter((t) => t.status === tab).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DataGrid
            data={filteredTickets}
            columns={columns}
            isLoading={isLoading}
            onSearch={setSearchQuery}
            searchPlaceholder={t('admin:searchTickets')}
            emptyMessage={t('admin:noTickets')}
          />
        </motion.div>
      </Tabs>
    </div>
  )
}
