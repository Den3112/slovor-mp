'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Send,
  Loader2,
  ChevronLeft,
  User,
  Shield,
  MessageSquare,
  AlertCircle,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { supportApi, type SupportTicket, type SupportMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/features/dashboard/shared/status-badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function TicketDetailPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const { id } = useParams()
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation(['dashboard', 'common', 'admin'])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    async function loadTicket() {
      setIsLoading(true)
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
    }
    if (id) loadTicket()
  }, [id])

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
        false
      )
      if (error) throw new Error(error)
      if (data) setMessages((prev) => [...prev, data])
      setReply('')
    } catch (error) {
      toast.error('Failed to send reply')
    } finally {
      setIsSending(false)
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
        <Button asChild className="mt-4" variant="outline">
          <Link href={`/${locale}/dashboard/support`}>
            {t('common:goBack')}
          </Link>
        </Button>
      </div>
    )

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-20 md:p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="border-border/40 rounded-xl border"
        >
          <Link href={`/${locale}/dashboard/support`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="line-clamp-1 text-xl font-bold tracking-tight">
              {ticket.subject}
            </h1>
            <StatusBadge status={ticket.status} />
          </div>
          <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <span>Ticket #{ticket.id.split('-')[0]}</span>
            <span>•</span>
            <span>{new Date(ticket.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Card className="border-border/60 flex h-[600px] flex-col overflow-hidden rounded-2xl shadow-sm">
        <CardHeader className="border-border/40 bg-muted/20 flex-none border-b px-6 py-4">
          <CardTitle className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
            <MessageSquare className="text-primary h-4 w-4" />
            {t('dashboard:communicationThread')}
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-muted/5 flex-1 space-y-6 overflow-y-auto p-6">
          {/* Initial Message */}
          <div className="flex gap-4">
            <div className="bg-muted border-border/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
              <User className="text-muted-foreground/40 h-5 w-5" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest uppercase">
                  {t('common:you')}
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
              className={cn('flex gap-4', !msg.is_admin && 'flex-row-reverse')}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                  msg.is_admin
                    ? 'bg-primary text-primary-foreground border-primary/20'
                    : 'bg-muted border-border/40'
                )}
              >
                {msg.is_admin ? (
                  <Shield className="h-5 w-5" />
                ) : (
                  <User className="text-muted-foreground/40 h-5 w-5" />
                )}
              </div>
              <div
                className={cn(
                  'flex-1 space-y-2',
                  !msg.is_admin && 'text-right'
                )}
              >
                <div
                  className={cn(
                    'flex items-center gap-3',
                    !msg.is_admin && 'flex-row-reverse'
                  )}
                >
                  <span className="text-xs font-bold tracking-widest uppercase">
                    {msg.is_admin ? t('admin:supportAgent') : t('common:you')}
                  </span>
                  <span className="text-muted-foreground/40 text-[9px] font-bold">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                <div
                  className={cn(
                    'inline-block max-w-[85%] rounded-2xl p-4 text-left text-sm leading-relaxed font-medium shadow-sm',
                    msg.is_admin
                      ? 'bg-primary/10 text-foreground border-primary/20 rounded-tl-none border'
                      : 'bg-card border-border/60 rounded-tr-none border'
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
              placeholder={t('dashboard:replyPlaceholder')}
              className="bg-muted/30 border-border/60 h-12 flex-1 rounded-xl font-medium"
              disabled={
                ticket.status === 'closed' || ticket.status === 'resolved'
              }
            />
            <Button
              type="submit"
              disabled={
                !reply.trim() ||
                isSending ||
                ticket.status === 'closed' ||
                ticket.status === 'resolved'
              }
              className="shadow-primary/20 h-12 rounded-xl px-6 font-bold tracking-widest uppercase shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {t('common:send')}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
