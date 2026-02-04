'use client'

import { useState, useEffect } from 'react'
import { activityApi, type ActivityLog } from '@/lib/api/activity'
import { useAuth } from '@/components/providers/auth-provider'
import { useTranslation } from '@/lib/i18n'
import {
    Activity,
    Clock,
    Globe,
    Terminal,
    Info,
    CheckCircle2,
    XCircle,
    PlusCircle,
    RefreshCw,
    Loader2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState } from '@/components/ui/empty-state'

export function ActivityLogView() {
    const { t } = useTranslation(['common', 'dashboard'])
    const { user } = useAuth()
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            loadLogs()
        }
    }, [user])

    const loadLogs = async () => {
        setIsLoading(true)
        const { data } = await activityApi.getMyLogs(50)
        if (data) setLogs(data)
        setIsLoading(false)
    }

    const getActionIcon = (action: string) => {
        if (action.includes('create')) return { icon: PlusCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
        if (action.includes('update')) return { icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-500/10' }
        if (action.includes('delete') || action.includes('cancel')) return { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' }
        if (action.includes('purchase') || action.includes('payment')) return { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' }
        return { icon: Info, color: 'text-muted-foreground', bg: 'bg-muted' }
    }

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic flex items-center gap-3">
                    <Activity className="h-8 w-8 text-primary" />
                    {t('dashboard:activityLog.title') || 'Activity Log'}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {t('dashboard:activityLog.subtitle') || 'Audit track of all your major actions and account events'}
                </p>
            </div>

            {logs.length > 0 ? (
                <div className="border border-border/60 rounded-2xl overflow-hidden bg-card shadow-sm">
                    <div className="divide-y divide-border/40">
                        <AnimatePresence mode="popLayout">
                            {logs.map((log) => {
                                const { icon: Icon, color, bg } = getActionIcon(log.action)
                                return (
                                    <motion.div
                                        key={log.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-6 transition-colors hover:bg-muted/30"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl shrink-0 border border-border/10", bg, color)}>
                                                <Icon className="h-6 w-6" />
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border/40 font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md">
                                                        {log.action.replace('_', ' ')}
                                                    </Badge>
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col gap-2 pt-1">
                                                    <div className="flex items-start gap-2 bg-muted/20 p-3 rounded-xl border border-border/40">
                                                        <Terminal className="h-3.5 w-3.5 mt-0.5 text-muted-foreground/60 shrink-0" />
                                                        <div className="text-[11px] font-medium text-muted-foreground break-all font-mono">
                                                            {JSON.stringify(log.metadata)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">
                                                <div className="flex items-center gap-1.5">
                                                    <Globe className="h-3 w-3" />
                                                    {log.ip_address || 'Internal'}
                                                </div>
                                                <span className="hidden sm:inline">Ref: #{log.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon={Activity}
                    title="No activity recorded"
                    description="Your major account events and actions will show up here."
                />
            )}
        </div>
    )
}
