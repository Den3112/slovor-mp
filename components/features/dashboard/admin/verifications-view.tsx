'use client'

import { useState, useEffect, useMemo } from 'react'
import { verificationApi, adminApi } from '@/lib/api'
import {
    CheckCircle2,
    XCircle,
    User,
    Calendar,
    FileText,
    Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { DataGrid, type Column } from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdminVerificationsView() {
    const { t } = useTranslation('common')
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('all')

    // Sorting state
    const [sortColumn, setSortColumn] = useState('created_at')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    useEffect(() => {
        loadRequests()
    }, [])

    const loadRequests = async () => {
        setIsLoading(true)
        const { data } = await verificationApi.getAdminAll()
        if (data) setRequests(data)
        setIsLoading(false)
    }

    const handleAction = async (id: string, userId: string, status: 'verified' | 'rejected') => {
        try {
            let result;
            if (status === 'verified') {
                result = await verificationApi.approveVerification(id, userId)
            } else {
                result = await verificationApi.rejectVerification(id)
            }

            if (result.error) throw new Error(result.error)
            toast.success(status === 'verified' ? t('admin.verificationApproved') : t('admin.verificationRejected'))
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))

            // Log action
            adminApi.logAction({
                target_id: userId,
                target_type: 'user',
                action_type: status === 'verified' ? 'verify' : 'reject' as any,
                reason: `Admin ${status} document verification`
            })
        } catch (error) {
            toast.error((error as Error).message)
        }
    }

    // Filtering & Sorting
    const filteredRequests = useMemo(() => {
        let result = requests

        if (activeTab !== 'all') {
            result = result.filter(r => r.status === activeTab)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(r =>
                r.profile?.display_name?.toLowerCase().includes(query) ||
                r.user_id.toLowerCase().includes(query)
            )
        }

        result.sort((a, b) => {
            const aValue = sortColumn === 'created_at' ? new Date(a[sortColumn]).getTime() : a[sortColumn]
            const bValue = sortColumn === 'created_at' ? new Date(b[sortColumn]).getTime() : b[sortColumn]

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [requests, activeTab, searchQuery, sortColumn, sortDirection])

    const columns: Column<any>[] = [
        {
            key: 'user_id',
            header: t('admin.tableUser'),
            cell: (row) => (
                <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {row.profile?.avatar_url ? (
                            <Image src={row.profile.avatar_url} alt="" fill className="object-cover" unoptimized />
                        ) : (
                            <User className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="font-bold text-foreground text-sm">{row.profile?.display_name || t('admin.anonymous')}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{row.user_id}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'document_type',
            header: t('admin.tableDocuments'),
            cell: (row) => (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-indigo-500">
                        <FileText className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{row.document_type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex gap-1 overflow-x-auto max-w-[200px]">
                        {(row.document_data?.urls || []).map((url: string, i: number) => (
                            <a
                                key={i}
                                href={url}
                                target="_blank"
                                className="h-10 w-10 shrink-0 rounded-lg border border-border/50 overflow-hidden relative group/img cursor-zoom-in"
                            >
                                <Image src={url} alt="" fill className="object-cover" unoptimized />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye className="h-4 w-4 text-white" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )
        },
        {
            key: 'created_at',
            header: t('admin.tableRequested'),
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(row.created_at).toLocaleDateString()}
                </div>
            )
        },
        {
            key: 'status',
            header: t('admin.tableStatus'),
            cell: (row) => (
                <Badge variant="outline" className={cn(
                    "px-2.5 py-0.5 border font-black text-[9px] uppercase tracking-widest rounded-md gap-1.5 flex items-center w-fit h-6",
                    row.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' :
                        row.status === 'verified' ? 'bg-success/10 text-success border-success/20' :
                            'bg-destructive/10 text-destructive border-destructive/20'
                )}>
                    <span className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        row.status === 'pending' ? 'bg-warning' :
                            row.status === 'verified' ? 'bg-success' :
                                'bg-destructive'
                    )} />
                    {t(`admin:${row.status}`)}
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
                                variant="outline"
                                size="sm"
                                onClick={() => handleAction(row.id, row.user_id, 'verified')}
                                className="h-8 px-3 text-[10px] font-black uppercase tracking-widest bg-background hover:bg-success/5 hover:text-success hover:border-success/30 border-border/60 transition-all gap-1.5 rounded-lg"
                                title={t('admin:approve')}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAction(row.id, row.user_id, 'rejected')}
                                className="h-8 px-3 text-[10px] font-black uppercase tracking-widest bg-background hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 border-border/60 transition-all gap-1.5 rounded-lg"
                                title={t('admin:reject')}
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
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        {t('admin:identityChecks')}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        {t('admin:reviewVerifyDocs')}
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-muted/40 p-1 rounded-xl h-auto flex-wrap justify-start border border-border/40">
                        {['all', 'pending', 'verified', 'rejected'].map(tab => (
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
            </Tabs>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <DataGrid
                    data={filteredRequests}
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
                    searchPlaceholder={t('admin:users')}
                />
            </motion.div>
        </div>
    )
}
