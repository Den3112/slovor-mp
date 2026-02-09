'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Send,
  Loader2,
  ChevronLeft,
  User,
  Shield,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { supportApi, type SupportTicket, type SupportMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AdminTicketDetailPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const { id } = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation(['dashboard', 'common', 'admin'])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const loadTicket = useCallback(async () => {
    try {
      const [ticketRes, messagesRes] = await Promise.all([
        supportApi.getTicket(id as string),
        supportApi.getMessages(id as string),
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
    if (id) loadTicket()
  }, [id, loadTicket])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim() || isSending) return

    setIsSending(true)
    try {
      const { data, error } = await supportApi.sendMessage(
        id as string,
        reply,
        true
      ) // isAdmin = true
      if (error) throw new Error(error)
      if (data) {
        setMessages((prev) => [...prev, data])
        // Admin reply automatically sets status to in_progress
        if (ticket?.status === 'open') {
          setTicket((prev) =>
            prev ? { ...prev, status: 'in_progress' } : null
          )
        }
      }
      setReply('')
    } catch (error) {
      toast.error('Failed to send reply')
    } finally {
      setIsSending(false)
    }
  }

  const handleStatusChange = async (newStatus: SupportTicket['status']) => {
    if (!ticket || isUpdatingStatus) return

    setIsUpdatingStatus(true)
    try {
      const { error } = await supportApi.updateStatus(ticket.id, newStatus)
      if (error) throw new Error(error)

      setTicket((prev) => (prev ? { ...prev, status: newStatus } : null))
      toast.success(t('admin:statusUpdated'))
    } catch (error) {
      toast.error(t('admin:statusUpdateError'))
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'in_progress':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      default:
        return 'bg-muted text-muted-foreground border-border/40'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'high':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
      case 'medium':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      default:
        return 'bg-muted text-muted-foreground border-border/40'
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!ticket)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
        <h2 className="text-xl font-bold">{t('dashboard:ticketNotFound')}</h2>
        <Button
          onClick={() => router.back()}
          className="mt-4"
          variant="outline"
        >
          {t('common:goBack')}
        </Button>
      </div>
    )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-6xl space-y-6 p-4 pb-20 duration-500 md:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="border-border/40 rounded-xl border"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="line-clamp-1 text-xl font-bold tracking-tight">
                {ticket.subject}
              </h1>
              <Badge
                variant="outline"
                className={cn(
                  'rounded-md px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase',
                  getStatusColor(ticket.status)
                )}
              >
                {ticket.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              <span>Ticket #{ticket.id.split('-')[0]}</span>
              <span>•</span>
              <span>{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={ticket.status}
            onValueChange={(val) =>
              handleStatusChange(val as SupportTicket['status'])
            }
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className="bg-background border-border/40 h-9 w-[180px] text-[10px] font-bold tracking-wider uppercase">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">
                <span className="text-destructive flex items-center gap-2 font-bold">
                  <AlertCircle className="h-3 w-3" /> Open
                </span>
              </SelectItem>
              <SelectItem value="in_progress">
                <span className="flex items-center gap-2 font-bold text-amber-600">
                  <Clock className="h-3 w-3" /> In Progress
                </span>
              </SelectItem>
              <SelectItem value="resolved">
                <span className="flex items-center gap-2 font-bold text-emerald-600">
                  <CheckCircle className="h-3 w-3" /> Resolved
                </span>
              </SelectItem>
              <SelectItem value="closed">
                <span className="text-muted-foreground flex items-center gap-2 font-bold">
                  <XCircle className="h-3 w-3" /> Closed
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-border/60 h-9 w-9 rounded-xl p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-border/60 min-w-[180px] rounded-xl p-2"
            >
              <DropdownMenuItem
                onClick={() => handleStatusChange('resolved')}
                className="cursor-pointer rounded-lg p-3 text-xs font-bold tracking-widest text-emerald-600 uppercase focus:bg-emerald-500/10 focus:text-emerald-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('admin:markResolved')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('closed')}
                className="text-muted-foreground focus:bg-muted cursor-pointer rounded-lg p-3 text-xs font-bold tracking-widest uppercase"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {t('admin:closeTicket')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chat Area */}
        <Card className="border-border/60 flex h-[600px] flex-col overflow-hidden rounded-2xl shadow-sm lg:col-span-2">
          <CardHeader className="border-border/40 bg-muted/20 flex-none border-b px-6 py-4">
            <CardTitle className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
              <MessageSquare className="text-primary h-4 w-4" />
              {t('dashboard:communicationThread')}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-muted/5 flex-1 space-y-6 overflow-y-auto p-6">
            {/* Initial User Message */}
            <div className="flex gap-4">
              <div className="bg-muted border-border/40 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
                {ticket.user?.avatar_url ? (
                  <Image
                    src={ticket.user.avatar_url}
                    alt=""
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="text-muted-foreground/40 h-5 w-5" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-widest uppercase">
                    {ticket.user?.display_name || 'User'}
                  </span>
                  <span className="text-muted-foreground/40 text-[9px] font-bold">
                    {new Date(ticket.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="bg-card border-border/60 rounded-2xl border p-4 text-sm leading-relaxed font-medium shadow-sm">
                  {ticket.message}
                </div>
              </div>
            </div>

            {messages.length > 0 && (
              <div className="relative py-4">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="border-border/40 w-full border-t"></div>
                </div>
                <div className="text-muted-foreground/40 relative flex justify-center bg-transparent text-[8px] font-bold tracking-[0.3em] uppercase">
                  <span className="bg-background border-border/20 rounded-full border px-4 py-1">
                    {t('dashboard:replies')}
                  </span>
                </div>
              </div>
            )}

            {/* Replies */}
            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={msg.id}
                className={cn(
                  'flex gap-4',
                  msg.is_admin ? 'flex-row-reverse' : ''
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border',
                    msg.is_admin
                      ? 'bg-primary text-primary-foreground border-primary/20'
                      : 'bg-muted border-border/40'
                  )}
                >
                  {msg.is_admin ? (
                    <Shield className="h-5 w-5" />
                  ) : ticket.user?.avatar_url && !msg.is_admin ? (
                    <Image
                      src={ticket.user.avatar_url}
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="text-muted-foreground/40 h-5 w-5" />
                  )}
                </div>
                <div
                  className={cn(
                    'flex-1 space-y-2',
                    msg.is_admin && 'text-right'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-3',
                      msg.is_admin && 'flex-row-reverse'
                    )}
                  >
                    <span className="text-xs font-bold tracking-widest uppercase">
                      {msg.is_admin
                        ? 'Support Agent'
                        : ticket.user?.display_name || 'User'}
                    </span>
                    <span className="text-muted-foreground/40 text-[9px] font-bold">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'inline-block max-w-[85%] rounded-2xl p-4 text-left text-sm leading-relaxed font-medium shadow-sm',
                      msg.is_admin
                        ? 'bg-primary/10 text-foreground border-primary/20 rounded-tr-none border'
                        : 'bg-card border-border/60 rounded-tl-none border'
                    )}
                  >
                    {msg.message}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Reply Input */}
          <div className="border-border/40 bg-card border-t p-4">
            <form onSubmit={handleSendReply} className="flex gap-3">
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply..."
                className="bg-muted/30 border-border/60 h-12 flex-1 rounded-xl font-medium"
              />
              <Button
                type="submit"
                disabled={!reply.trim() || isSending}
                className="shadow-primary/20 h-12 rounded-xl px-6 font-bold tracking-widest uppercase shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Reply
              </Button>
            </form>
          </div>
        </Card>

        {/* Sidebar Details */}
        <div className="space-y-6">
          <Card className="border-border/60 overflow-hidden rounded-2xl shadow-sm">
            <div className="from-primary/50 h-1 w-full bg-gradient-to-r to-indigo-500/50" />
            <CardHeader>
              <CardTitle className="text-sm font-bold tracking-widest uppercase">
                Ticket Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    Category
                  </span>
                  <div className="text-sm font-medium capitalize">
                    {ticket.category}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    Priority
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-bold tracking-widest uppercase',
                      getPriorityColor(ticket.priority)
                    )}
                  >
                    {ticket.priority}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 overflow-hidden rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold tracking-widest uppercase">
                User Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-muted border-border/40 h-10 w-10 overflow-hidden rounded-full border">
                  {ticket.user?.avatar_url ? (
                    <Image
                      src={ticket.user.avatar_url}
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="text-muted-foreground/40 h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold">
                    {ticket.user?.display_name || 'Anonymous User'}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {ticket.user?.email}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full text-xs font-bold tracking-widest uppercase"
                asChild
              >
                <Link
                  href={`/${locale}/admin/users?search=${ticket.user?.email}`}
                >
                  View User Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 selection:bg-primary/30 overflow-hidden rounded-2xl bg-slate-950 text-white shadow-sm">
            <CardHeader className="border-b border-white/5 bg-white/5 px-6 py-4">
              <CardTitle className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {t('admin:adminTools')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive h-10 w-full rounded-xl border-white/10 bg-white/5 text-[9px] font-bold tracking-widest uppercase hover:bg-white/10"
                onClick={() =>
                  toast.info('Block User functionality coming soon')
                }
              >
                {t('admin:blockUser')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
