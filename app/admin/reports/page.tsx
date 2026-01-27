'use client'

import { useEffect, useState } from 'react'
import { reportsApi, type ReportWithDetails } from '@/lib/api'
import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Search,
    Loader2,
    Calendar,
    User,
    ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminReportsPage() {
    const [reports, setReports] = useState<ReportWithDetails[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

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
            toast.success(status === 'resolved' ? 'Report resolved' : 'Report dismissed')
            setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
        }
    }

    const filteredReports = reports.filter(r =>
        r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.listing?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reporter?.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="font-heading text-4xl font-black tracking-tight italic">Reports</h1>
                    <p className="text-muted-foreground font-medium">Review and resolve user complaints.</p>
                </div>
                <div className="relative w-full max-w-sm md:w-80">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-border/50 bg-card w-full rounded-2xl border py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                    />
                </div>
            </div>

            {/* Reports Table */}
            <div className="border-border/50 bg-card overflow-hidden rounded-4xl border shadow-2xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/30">
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Target</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Reason</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Reporter</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black tracking-widest text-muted-foreground uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredReports.map((report) => (
                                <tr key={report.id} className="group hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-foreground line-clamp-1">
                                                    {report.listing?.title || 'Unknown Listing'}
                                                </p>
                                                <Link
                                                    href={`/listings/${report.listing_id}`}
                                                    target="_blank"
                                                    className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                                                >
                                                    View Listing <ExternalLink className="h-2.5 w-2.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-medium text-sm">
                                        <div className="space-y-1">
                                            <p className="font-bold">{report.reason}</p>
                                            <p className="text-muted-foreground text-xs line-clamp-2">{report.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm">
                                        <div className="flex items-center gap-2 font-bold">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            {report.reporter?.display_name || 'Anonymous'}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest",
                                            report.status === 'pending' ? "bg-amber-500/10 text-amber-500" :
                                                report.status === 'resolved' ? "bg-emerald-500/10 text-emerald-500" :
                                                    "bg-muted text-muted-foreground"
                                        )}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {report.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleAction(report.id, 'resolved')}
                                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl"
                                                        title="Resolve"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleAction(report.id, 'dismissed')}
                                                        className="text-destructive hover:bg-destructive/10 rounded-xl"
                                                        title="Dismiss"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
