'use client'

import { useEffect, useState } from 'react'
import { verificationApi, adminApi } from '@/lib/api'
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Search,
    Loader2,
    Calendar,
    User,
    FileText,
    Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminVerificationsPage() {
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

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

            toast.success(status === 'verified' ? 'Verification approved' : 'Verification rejected')
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

    const filteredRequests = requests.filter(r =>
        r.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.user_id.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-indigo-500" />
                        <h1 className="font-heading text-4xl font-black tracking-tight italic text-indigo-500">Identity Checks</h1>
                    </div>
                    <p className="text-muted-foreground font-medium">Review and verify user identity documents.</p>
                </div>
                <div className="relative w-full max-w-sm md:w-80">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-border/50 bg-card w-full rounded-2xl border py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                    />
                </div>
            </div>

            {/* Requests Table */}
            <div className="border-border/50 bg-card overflow-hidden rounded-4xl border shadow-2xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/30">
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">User</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Documents</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Requested</th>
                                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black tracking-widest text-muted-foreground uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="group hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-muted">
                                                {request.profile?.avatar_url ? (
                                                    <Image src={request.profile.avatar_url} alt="" fill className="object-cover" />
                                                ) : (
                                                    <User className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                <p className="font-bold text-foreground text-sm">{request.profile?.display_name || 'Anonymous'}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">{request.user_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-medium text-sm">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-indigo-500">
                                                <FileText className="h-4 w-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{request.document_type.replace('_', ' ')}</span>
                                            </div>
                                            <div className="flex gap-1 overflow-x-auto">
                                                {(request.document_data?.urls || []).map((url: string, i: number) => (
                                                    <a
                                                        key={i}
                                                        href={url}
                                                        target="_blank"
                                                        className="h-10 w-10 rounded-lg border border-border/50 overflow-hidden relative group/img cursor-zoom-in"
                                                    >
                                                        <Image src={url} alt="" fill className="object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                            <Eye className="h-4 w-4 text-white" />
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm font-medium text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest",
                                            request.status === 'pending' ? "bg-amber-500/10 text-amber-500" :
                                                request.status === 'verified' ? "bg-emerald-500/10 text-emerald-500" :
                                                    "bg-destructive/10 text-destructive"
                                        )}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {request.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleAction(request.id, request.user_id, 'verified')}
                                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleAction(request.id, request.user_id, 'rejected')}
                                                        className="text-destructive hover:bg-destructive/10 rounded-xl"
                                                        title="Reject"
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
