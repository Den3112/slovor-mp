'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Send,
    Loader2,
    ChevronLeft,
    User,
    CheckCircle2,
    MoreVertical,
    Calendar,
    AlertCircle,
    Shield,
    MessageSquare
} from 'lucide-react'
import { supportApi, type SupportTicket, type SupportMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function TicketDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [ticket, setTicket] = useState<SupportTicket | null>(null)
    const [messages, setMessages] = useState<SupportMessage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [reply, setReply] = useState('')
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    const loadTicket = useCallback(async () => {
        setIsLoading(true)
        try {
            const [ticketRes, messagesRes] = await Promise.all([
                supportApi.getTicket(id as string),
                supportApi.getMessages(id as string)
            ])
            if (ticketRes.data) setTicket(ticketRes.data)
            if (messagesRes.data) setMessages(messagesRes.data)
        } catch (error) {
            toast.error('Failed to load ticket details')
        } finally {
            setIsLoading(false)
        }
    }, [id])

    useEffect(() => {
        if (id) {
            loadTicket()
        }
    }, [id, loadTicket])

    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!reply.trim() || isSending) return

        setIsSending(true)
        try {
            const { data, error } = await supportApi.sendMessage(id as string, reply, true)
            if (error) throw new Error(error)
            if (data) setMessages(prev => [...prev, data])
            setReply('')
            // Also update local ticket status to in_progress if it was open
            if (ticket && ticket.status === 'open') {
                setTicket({ ...ticket, status: 'in_progress' })
            }
        } catch (error) {
            toast.error('Failed to send reply')
        } finally {
            setIsSending(false)
        }
    }

    const handleUpdateStatus = async (status: SupportTicket['status']) => {
        try {
            const { error } = await supportApi.updateStatus(id as string, status)
            if (error) throw new Error(error)
            if (ticket) setTicket({ ...ticket, status })
            toast.success(`Ticket marked as ${status.replace('_', ' ')}`)
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!ticket) return <div className="p-12 text-center font-black uppercase text-muted-foreground">Ticket not found</div>

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-xl border border-border/40 bg-card hover:bg-muted transition-all h-10 w-10 shrink-0"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black tracking-tight text-foreground line-clamp-1">{ticket.subject}</h1>
                            <Badge variant="outline" className={cn(
                                "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md",
                                ticket.status === 'open' ? "bg-destructive/10 text-destructive border-destructive/20" :
                                    ticket.status === 'in_progress' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                        "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            )}>
                                {ticket.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Ticket #{ticket.id.split('-')[0]}</span>
                            <span className="text-muted-foreground/20 text-[10px]">•</span>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                <Calendar className="h-3 w-3" />
                                {new Date(ticket.created_at).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-xl h-11 px-4 font-black uppercase tracking-widest text-[10px] border-border/60">
                                <MoreVertical className="h-4 w-4 mr-2" />
                                Actions
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-border/60 min-w-[180px] p-2">
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus('resolved')}
                                className="rounded-lg font-bold text-xs uppercase tracking-widest p-3 cursor-pointer text-emerald-600 focus:bg-emerald-500/10 focus:text-emerald-600"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus('closed')}
                                className="rounded-lg font-bold text-xs uppercase tracking-widest p-3 cursor-pointer text-muted-foreground focus:bg-muted"
                            >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Close Ticket
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Chat Section */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-border/60 shadow-sm overflow-hidden flex flex-col h-[600px] rounded-2xl">
                        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4 flex-none">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                Communication Thread
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/10">
                            {/* Initial Message */}
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-muted border border-border/40 flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 text-muted-foreground/40" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black uppercase tracking-widest">{ticket.user?.display_name}</span>
                                        <span className="text-[9px] font-bold text-muted-foreground/40">{new Date(ticket.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-card border border-border/60 text-sm font-medium leading-relaxed shadow-sm">
                                        {ticket.message}
                                    </div>
                                </div>
                            </div>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-border/40"></div>
                                </div>
                                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 bg-transparent">
                                    <span className="bg-muted px-4 py-1 rounded-full border border-border/20">Discussion History</span>
                                </div>
                            </div>

                            {/* Replies */}
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={msg.id}
                                    className={cn("flex gap-4", msg.is_admin && "flex-row-reverse")}
                                >
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl border flex items-center justify-center shrink-0",
                                        msg.is_admin ? "bg-primary text-primary-foreground border-primary/20" : "bg-muted border-border/40"
                                    )}>
                                        {msg.is_admin ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5 text-muted-foreground/40" />}
                                    </div>
                                    <div className={cn("flex-1 space-y-2", msg.is_admin && "text-right")}>
                                        <div className={cn("flex items-center gap-3", msg.is_admin && "flex-row-reverse")}>
                                            <span className="text-xs font-black uppercase tracking-widest">
                                                {msg.is_admin ? 'Support Agent' : ticket.user?.display_name}
                                            </span>
                                            <span className="text-[9px] font-bold text-muted-foreground/40">{new Date(msg.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className={cn(
                                            "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm inline-block max-w-[85%] text-left",
                                            msg.is_admin
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-card border border-border/60 rounded-tl-none"
                                        )}>
                                            {msg.message}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </CardContent>

                        {/* Reply Input */}
                        <div className="p-4 border-t border-border/40 bg-card">
                            <form onSubmit={handleSendReply} className="flex gap-3">
                                <Input
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="Type your official response..."
                                    className="flex-1 rounded-xl h-12 bg-muted/30 border-border/60 font-medium"
                                    disabled={ticket.status === 'closed' || ticket.status === 'resolved'}
                                />
                                <Button
                                    type="submit"
                                    disabled={!reply.trim() || isSending || ticket.status === 'closed' || ticket.status === 'resolved'}
                                    className="rounded-xl h-12 px-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                >
                                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                                    Send
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">User Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-border/40">
                                <div className="h-16 w-16 rounded-2xl bg-muted border-2 border-primary/10 flex items-center justify-center overflow-hidden">
                                    {ticket.user?.avatar_url ? (
                                        <img src={ticket.user.avatar_url} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-8 w-8 text-muted-foreground/30" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-black text-foreground uppercase tracking-tight">{ticket.user?.display_name}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">{ticket.user?.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 pt-2">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Category</p>
                                    <p className="text-xs font-bold text-foreground uppercase">{ticket.category}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Priority</p>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest rounded-md border-primary/20 bg-primary/5 text-primary">
                                        {ticket.priority}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">SLA Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase text-emerald-600">Within Limit</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-slate-950 text-white selection:bg-primary/30">
                        <CardHeader className="border-b border-white/5 bg-white/5 px-6 py-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/40">Admin Tools</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <Button variant="outline" className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl border-white/10 h-10 text-[9px] font-black uppercase tracking-widest">
                                View User Profile
                            </Button>
                            <Button variant="outline" className="w-full bg-white/5 hover:bg-white/10 rounded-xl border-white/10 h-10 text-[9px] font-black uppercase tracking-widest text-destructive hover:text-destructive">
                                Block User
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
