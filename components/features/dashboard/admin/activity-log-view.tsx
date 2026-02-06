'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'
import {
    Activity,
    User,
    Clock,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { DataGrid, type Column } from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function AdminActivityLogView() {
    const { t } = useTranslation('common')
    const [logs, setLogs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredLogs = logs.filter(log =>
        log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {
        loadLogs()
    }, [])

    const loadLogs = async () => {
        setIsLoading(true)
        const { data } = await adminApi.getActivityLogs(100)
        if (data) setLogs(data)
        setIsLoading(false)
    }

    const columns: Column<any>[] = [
        {
            key: 'user',
            header: 'User',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-muted border border-border/40">
                        {row.profiles?.avatar_url ? (
                            <Image src={row.profiles.avatar_url} alt="" fill className="object-cover" unoptimized />
                        ) : (
                            <User className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-foreground text-xs">{row.profiles?.display_name || 'System'}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate max-w-[100px]">{row.user_id || 'automated'}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'action',
            header: 'Action',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn(
                        "px-2 py-0.5 border font-bold text-[9px] uppercase tracking-widest rounded flex items-center gap-1.5 h-5",
                        row.action.includes('error') ? 'bg-destructive/10 text-destructive border-destructive/20' :
                            row.action.includes('login') ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                row.action.includes('create') ? 'bg-success/10 text-success border-success/20' :
                                    'bg-muted text-muted-foreground border-border/40'
                    )}>
                        {row.action.replace('_', ' ')}
                    </Badge>
                </div>
            )
        },
        {
            key: 'metadata',
            header: 'Details',
            cell: (row) => (
                <div className="max-w-[300px] truncate text-[11px] font-medium text-muted-foreground">
                    {JSON.stringify(row.metadata) !== '{}' ? JSON.stringify(row.metadata) : 'No extra data'}
                </div>
            )
        },
        {
            key: 'ip_address',
            header: 'IP / Source',
            cell: (row) => (
                <code className="text-[10px] bg-muted/30 px-1.5 py-0.5 rounded border border-border/40 font-mono text-muted-foreground">
                    {row.ip_address || 'internal'}
                </code>
            )
        },
        {
            key: 'created_at',
            header: 'Timestamp',
            cell: (row) => (
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(row.created_at).toLocaleString()}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase flex items-center gap-3 ">
                        <Activity className="h-8 w-8 text-primary" />
                        {t('admin:activityLog') || 'Activity Log'}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        {t('admin:auditSystemActions') || 'Audit system events and user actions'}
                    </p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <DataGrid
                    data={filteredLogs}
                    columns={columns}
                    isLoading={isLoading}
                    onSearch={setSearchQuery}
                    searchPlaceholder="Search by user or action..."
                />
            </motion.div>
        </div>
    )
}
