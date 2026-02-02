'use client'

import { useState, useMemo, useEffect } from 'react'
import { reportsApi, type ReportWithDetails } from '@/lib/api'
import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    User,
    Calendar,
    ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { DataGrid, type Column } from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdminReportsView() {
    const { t } = useTranslation('common')
    const [reports, setReports] = useState<ReportWithDetails[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('all') // all, pending, resolved, dismissed

    // Sorting state
    const [sortColumn, setSortColumn] = useState('created_at')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    useEffect(() => {
        loadReports()
    }, [])

    const loadReports = async () => {
        setIsLoading(true)
        const { data } = await reportsApi.getAll()
        if (data) setReports(data)
        setIsLoading(false)
    }

    const handleAction = async (id: string, status: 'resolved' | 'dismissed') => {
        const { error } = await reportsApi.updateStatus(id, status)
        if (error) {
            toast.error(error)
        } else {
            toast.success(status === 'resolved' ? t('admin:reportResolved') : t('admin:reportDismissed'))
            setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
        }
    }

    // Filtering & Sorting
    const filteredReports = useMemo(() => {
        let result = reports

        // Tab Filter
        if (activeTab !== 'all') {
            result = result.filter(r => r.status === activeTab)
        }

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(r =>
                r.reason.toLowerCase().includes(query) ||
                r.listing?.title.toLowerCase().includes(query) ||
                r.reporter?.display_name?.toLowerCase().includes(query)
            )
        }

        // Sorting
        result.sort((a: any, b: any) => {
            const aValue = sortColumn === 'created_at' ? new Date(a[sortColumn]).getTime() : a[sortColumn]
            const bValue = sortColumn === 'created_at' ? new Date(b[sortColumn]).getTime() : b[sortColumn]

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [reports, activeTab, searchQuery, sortColumn, sortDirection])

    const columns: Column<ReportWithDetails>[] = [
        {
            key: 'listing_id',
            header: t('admin:tableTarget'),
            cell: (row) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 min-w-[40px] rounded-lg bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-sm transition-transform group-hover:scale-110">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col space-y-0.5">
                        <p className="font-bold text-sm text-foreground line-clamp-1 max-w-[200px] tracking-tight">
                            {row.listing?.title || t('admin:unknownListing')}
                        </p>
                        <Link
                            href={`/listings/${row.listing_id}`}
                            target="_blank"
                            className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 hover:text-primary/80 transition-colors"
                        >
                            {t('admin:viewListing')} <ExternalLink className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
            )
        },
        {
            key: 'reason',
            header: t('admin:tableReason'),
            cell: (row) => (
                <div className="space-y-1.5 max-w-[320px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-destructive/80 leading-none">{row.reason}</p>
                    <p className="text-xs font-medium text-muted-foreground/80 line-clamp-2 leading-relaxed">{row.description}</p>
                </div>
            )
        },
        {
            key: 'reporter_id',
            header: t('admin:tableReporter'),
            cell: (row) => (
                <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-xs tracking-tight text-foreground">
                        <User className="h-3.5 w-3.5 text-muted-foreground/60" />
                        {row.reporter?.display_name || t('admin:anonymous')}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        {new Date(row.created_at).toLocaleDateString()}
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: t('admin:tableStatus'),
            cell: (row) => {
                const statusStyles = {
                    pending: "bg-destructive/10 text-destructive border-destructive/20 dot-destructive",
                    resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dot-emerald-500",
                    dismissed: "bg-muted text-muted-foreground border-border/40 dot-muted-foreground/40"
                }
                const dotStyles = {
                    pending: "bg-destructive",
                    resolved: "bg-emerald-500",
                    dismissed: "bg-muted-foreground/40"
                }
                const currentStatus = row.status as keyof typeof statusStyles

                return (
                    <Badge variant="outline" className={cn("px-2.5 py-0.5 border font-black text-[9px] uppercase tracking-widest rounded-md gap-1.5 flex items-center w-fit h-6", statusStyles[currentStatus] || statusStyles.dismissed)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotStyles[currentStatus] || dotStyles.dismissed)} />
                        {t(`admin:${row.status}`)}
                    </Badge>
                )
            }
        },
        {
            key: 'actions',
            header: <span className="sr-only">{t('admin:tableActions')}</span>,
            className: "text-right",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    {row.status === 'pending' && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAction(row.id, 'resolved')}
                                className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-emerald-500/5 hover:text-emerald-600 hover:border-emerald-500/30 border-border/60 transition-all gap-1.5"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {t('admin:resolve')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAction(row.id, 'dismissed')}
                                className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 border-border/60 transition-all gap-1.5"
                            >
                                <XCircle className="h-3.5 w-3.5" />
                                {t('admin:dismiss')}
                            </Button>
                        </>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">{t('admin:reportsTitle')}</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                        {t('admin:reviewResolveComplaints')}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-muted/40 p-1 rounded-xl h-auto flex-wrap justify-start border border-border/40">
                        {['all', 'pending', 'resolved', 'dismissed'].map(tab => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="rounded-lg px-4 py-2 text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                            >
                                {tab === 'all' ? t('common:all') : t(`admin:${tab}`)}
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
                        data={filteredReports}
                        columns={columns}
                        isLoading={isLoading}
                        onSearch={setSearchQuery}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={(col) => {
                            if (sortColumn === col) {
                                setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
                            } else {
                                setSortColumn(col)
                                setSortDirection('desc')
                            }
                        }}
                        searchPlaceholder={t('admin:searchReports')}
                    />
                </motion.div>
            </Tabs>
        </div>
    )
}
