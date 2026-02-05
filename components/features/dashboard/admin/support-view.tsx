'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
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
import { DataGrid, type Column } from '@/components/features/dashboard/shared/data-grid'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdminSupportView() {
    const { t } = useTranslation(['common', 'admin'])
    const [tickets, setTickets] = useState<SupportTicket[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('all') // all, open, in_progress, resolved

    useEffect(() => {
        loadTickets()
    }, [])

    const loadTickets = async () => {
        setIsLoading(true)
        try {
            const { data } = await supportApi.getAllTickets()
            if (data) setTickets(data)
        } catch (error) {
            toast.error('Failed to load support tickets')
        } finally {
            setIsLoading(false)
        }
    }

    const filteredTickets = useMemo(() => {
        let result = tickets
        if (activeTab !== 'all') {
            result = result.filter(t => t.status === activeTab)
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(t =>
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
            header: 'Ticket / Subject',
            className: "min-w-[300px]",
            cell: (row) => (
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-xl border shadow-sm transition-transform group-hover:scale-110",
                        row.status === 'open' ? "bg-destructive/10 text-destructive border-destructive/20" :
                            row.status === 'in_progress' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    )}>
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tight text-foreground line-clamp-1">{row.subject}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0 border-border/40 bg-muted/30">
                                {row.category}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">#{row.id.split('-')[0]}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'user_id',
            header: 'Requested By',
            cell: (row) => (
                <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/40 relative">
                        {row.user?.avatar_url ? (
                            <Image src={row.user.avatar_url} alt="" fill className="object-cover" />
                        ) : (
                            <User className="h-4 w-4 text-muted-foreground/40" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{row.user?.display_name || 'Anonymous'}</span>
                        <span className="text-[9px] font-bold text-muted-foreground/60 tracking-tight">{row.user?.email}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'priority',
            header: 'Priority',
            cell: (row) => {
                const colors = {
                    low: "bg-muted text-muted-foreground border-border/40",
                    medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                    high: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                    urgent: "bg-destructive/10 text-destructive border-destructive/20"
                }
                return (
                    <Badge variant="outline" className={cn("px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md", colors[row.priority])}>
                        {row.priority}
                    </Badge>
                )
            }
        },
        {
            key: 'status',
            header: 'Status',
            cell: (row) => {
                const styles = {
                    open: "bg-destructive/10 text-destructive border-destructive/20",
                    in_progress: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                    resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                    closed: "bg-muted text-muted-foreground border-border/40"
                }
                return (
                    <Badge variant="outline" className={cn("px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md", styles[row.status])}>
                        {row.status.replace('_', ' ')}
                    </Badge>
                )
            }
        },
        {
            key: 'created_at',
            header: 'Last Update',
            cell: (row) => (
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <Calendar className="h-3 w-3" />
                    {new Date(row.updated_at).toLocaleDateString()}
                </div>
            )
        },
        {
            key: 'actions',
            header: '',
            className: "text-right",
            cell: (row) => (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                    asChild
                >
                    <a href={`/admin/support/${row.id}`}>
                        <ChevronRight className="h-4 w-4" />
                    </a>
                </Button>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase flex items-center gap-3">
                        <LifeBuoy className="h-8 w-8 text-primary" />
                        {t('admin:supportTickets') || 'Support Center'}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        {t('admin:manageSupportTickets') || 'Respond to user inquiries and technical issues'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="h-9 px-4 flex items-center gap-2 rounded-xl bg-destructive/5 text-destructive border-destructive/20 font-black uppercase tracking-widest text-[10px]">
                        <Clock className="h-3.5 w-3.5" />
                        Avg. Response Time: 4h
                    </Badge>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-muted/40 p-1 rounded-xl h-auto flex-wrap justify-start border border-border/40">
                        {['all', 'open', 'in_progress', 'resolved', 'closed'].map(tab => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="rounded-lg px-5 py-2.5 text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                            >
                                {tab.replace('_', ' ')}
                                <Badge variant="secondary" className="ml-2 px-1.5 py-0 h-4 min-w-5 border-transparent bg-muted/80 text-[8px] font-black">
                                    {tab === 'all' ? tickets.length : tickets.filter(t => t.status === tab).length}
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
                        searchPlaceholder="Search tickets, users, subjects..."
                        emptyMessage="No support tickets found."
                    />
                </motion.div>
            </Tabs>
        </div>
    )
}
