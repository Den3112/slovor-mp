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
            toast.success(status === 'resolved' ? t('admin.reportResolved') : t('admin.reportDismissed'))
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
            header: t('admin.tableTarget'),
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 min-w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-bold text-foreground line-clamp-1 max-w-[200px]">
                            {row.listing?.title || t('admin.unknownListing')}
                        </p>
                        <Link
                            href={`/listings/${row.listing_id}`}
                            target="_blank"
                            className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                        >
                            {t('admin.viewListing')} <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                    </div>
                </div>
            )
        },
        {
            key: 'reason',
            header: t('admin.tableReason'),
            cell: (row) => (
                <div className="space-y-1 max-w-[300px]">
                    <p className="font-bold text-sm">{row.reason}</p>
                    <p className="text-muted-foreground text-xs line-clamp-2">{row.description}</p>
                </div>
            )
        },
        {
            key: 'reporter_id',
            header: t('admin.tableReporter'),
            cell: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-bold text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {row.reporter?.display_name || t('admin.anonymous')}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(row.created_at).toLocaleDateString()}
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: t('admin.tableStatus'),
            cell: (row) => (
                <Badge variant={
                    row.status === 'pending' ? 'destructive' :
                        row.status === 'resolved' ? 'success' : 'secondary'
                }>
                    {t(`admin.${row.status}`)}
                </Badge>
            )
        },
        {
            key: 'actions',
            header: t('admin.tableActions'),
            className: "text-right",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    {row.status === 'pending' && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAction(row.id, 'resolved')}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl"
                                title={t('admin.resolve')}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAction(row.id, 'dismissed')}
                                className="text-destructive hover:bg-destructive/10 rounded-xl"
                                title={t('admin.dismiss')}
                            >
                                <XCircle className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-black tracking-tight">{t('admin.reportsTitle')}</h1>
                    <p className="text-muted-foreground">{t('admin.reviewResolveComplaints')}</p>
                </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-muted/50 p-1 rounded-xl">
                        {['all', 'pending', 'resolved', 'dismissed'].map(tab => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="rounded-lg capitalize data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                            >
                                {tab === 'all' ? t('common.all') : t(`admin.${tab}`)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
            </Tabs>

            {/* Stats Cards optional here? Maybe later. */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-border/50 bg-card overflow-hidden shadow-xl"
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
                            setSortDirection('desc') // default new sort to desc usually better for dates
                        }
                    }}
                    searchPlaceholder={t('admin.searchReports')}
                />
            </motion.div>
        </div>
    )
}
