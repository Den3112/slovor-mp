'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Clock, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { listingsApi, verificationApi, reportsApi } from '@/lib/api'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export function PriorityQueueTile() {
  const { t } = useTranslation(['admin'])
  const [stats, setStats] = useState({
    reports: 0,
    pendingListings: 0,
    pendingVerifications: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [listingsRes, reportsRes, verificationsRes] = await Promise.all([
          listingsApi.getPendingCount(),
          reportsApi.getAll(),
          verificationApi.getAdminAll()
        ])

        // Reports specifically from the reports table
        const reportsCount = reportsRes.data?.filter(r => r.status === 'pending').length || 0
        const pendingListingsCount = listingsRes.data || 0
        const pendingVerificationsCount = verificationsRes.data?.filter(v => v.status === 'pending').length || 0

        setStats({
          reports: reportsCount,
          pendingListings: pendingListingsCount,
          pendingVerifications: pendingVerificationsCount
        })
      } catch (error) {
        console.error('Failed to load priority queue stats', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  const priorities = [
    {
      id: 1,
      type: 'report',
      label: t('admin:userReports'),
      count: stats.reports,
      icon: ShieldAlert,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      link: '/admin/reports'
    },
    {
      id: 2,
      type: 'moderation',
      label: t('admin:pendingListings'),
      count: stats.pendingListings,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      link: '/admin/listings?status=pending'
    },
    {
      id: 3,
      type: 'verification',
      label: t('admin:idVerification'),
      count: stats.pendingVerifications,
      icon: CheckCircle2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      link: '/admin/verification'
    },
  ]

  const totalIssues = stats.reports + stats.pendingListings + stats.pendingVerifications

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-bold tracking-tight uppercase opacity-60">
              {t('admin:priorityQueue')}
            </h3>
          </div>
          {totalIssues > 0 && (
            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500 animate-pulse">
              {t('admin:actionRequired')}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/30" />
            </div>
          ) : (
            priorities.map((item) => (
              <Link
                href={item.link}
                key={item.id}
                className="bg-background/40 hover:bg-background/60 border-border/20 flex items-center justify-between rounded-xl border p-3 transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`${item.bg} flex h-8 w-8 items-center justify-center rounded-lg group-hover:bg-opacity-80 transition-colors`}
                  >
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className={cn("text-sm font-bold", item.count > 0 ? "text-foreground" : "text-muted-foreground/40")}>
                  {item.count}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      <Button
        variant="outline"
        className="mt-4 w-full border-rose-500/20 font-bold hover:bg-rose-500/5 hover:text-rose-500"
        asChild
      >
        <Link href="/admin/support">
          {t('admin:resolveAllIssues')}
        </Link>
      </Button>
    </div>
  )
}

