'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  messagesApi,
  type Message,
  type Conversation,
} from '@/lib/api/messages'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/components/providers/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Send,
  Phone,
  ArrowLeft,
  MoreVertical,
  ShieldCheck,
  Image as ImageIcon,
  CheckCheck,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ChatViewProps {
  conversationId: string
}

export function ChatView({ conversationId }: ChatViewProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation('messages')
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const [otherUserStatus, setOtherUserStatus] = useState<'online' | 'offline'>('offline')
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!user) return

    async function loadData() {
      if (!user) return
      try {
        // Fetch conversation details
        const { data: conv } = await messagesApi.getConversation(conversationId)
        if (conv) setConversation(conv)

        // Fetch messages
        const { data: msgs } = await messagesApi.getMessages(conversationId)
        if (msgs) setMessages(msgs)

        // Mark as read
        await messagesApi.markAsRead(conversationId, user.id)
      } catch (error) {
        console.error('Failed to load chat:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()

    // Realtime Subscription
    const channel = supabase
      .channel(`chat:${conversationId}`, {
        config: {
          presence: {
            key: user.id,
          },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((p) => p.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })

          // Mark as read if we are looking at the chat
          if (newMsg.sender_id !== user.id) {
            messagesApi.markAsRead(conversationId, user.id)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updated = payload.new as Message
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          )
        }
      )
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== user.id) {
          setIsOtherTyping(payload.isTyping)
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const otherUserId = conversation?.buyer_id === user.id ? conversation.seller_id : conversation?.buyer_id
        const isOnline = Object.values(state).some(
          (presences: any) => presences.some((p: any) => p.user_id === otherUserId)
        )
        setOtherUserStatus(isOnline ? 'online' : 'offline')
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          })
        }
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [conversationId, user, supabase, conversation?.buyer_id, conversation?.seller_id])

  useEffect(() => {
    // Scroll to bottom
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return

    setIsSending(true)
    try {
      const { data: sentMsg, error } = await messagesApi.sendMessage(
        conversationId,
        user.id,
        newMessage
      )

      if (error) throw error

      if (sentMsg) {
        setMessages((prev) => [...prev, sentMsg])
        setNewMessage('')
      }
    } catch {
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">
        <span className="animate-pulse">{t('loading')}</span>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">
        {t('notFound')}
      </div>
    )
  }

  const otherUser =
    conversation.buyer_id === user?.id
      ? conversation.seller
      : conversation.buyer
  const listing = conversation.listing

  return (
    <div className="flex h-full flex-col bg-transparent">
      {/* Header */}
      <div className="bg-background/40 z-20 flex items-center justify-between border-b border-white/5 p-4 backdrop-blur-xl md:p-6">
        <div className="flex items-center gap-4">
          <Link href="/profile/messages" className="md:hidden">
            <Button variant="ghost" size="icon" className="-ml-3 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="relative">
            <Avatar className="border-background h-12 w-12 border-2 shadow-lg">
              <AvatarImage src={otherUser?.avatar_url || ''} />
              <AvatarFallback>
                {otherUser?.display_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className={cn(
              "border-background absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 transition-colors duration-500",
              otherUserStatus === 'online' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-muted-foreground/30"
            )} />
          </div>

          <div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-lg leading-none font-bold tracking-tight">
                  {otherUser?.display_name || 'User'}
                </h3>
                <ShieldCheck className="text-primary fill-primary/10 h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mt-0.5">
                {isOtherTyping ? (
                  <span className="text-primary animate-pulse">{t('typing')}</span>
                ) : (
                  otherUserStatus === 'online' ? 'Active now' : 'Offline'
                )}
              </span>
            </div>
            {listing && (
              <Link
                href={`/listings/${listing.id}`}
                className="text-muted-foreground/80 hover:text-primary mt-1 flex items-center gap-1.5 text-xs font-medium transition-colors"
              >
                <span className="h-1 w-1 rounded-full bg-current" />
                {listing.title}
                <span className="opacity-50">•</span>
                <span className="text-foreground font-bold">
                  {listing.price} €
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-full hover:bg-white/10 md:flex"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 md:px-6">
        <div className="mx-auto max-w-4xl space-y-6 py-6">
          {messages.length === 0 && (
            <div className="py-10 text-center opacity-50">
              <p className="text-sm">
                {t('startConversationWith').replace('{name}', otherUser?.display_name || 'User')}
              </p>
            </div>
          )}

          {messages.map((msg, index) => {
            const isMe = msg.sender_id === user?.id
            const isSequential =
              index > 0 && messages[index - 1]?.sender_id === msg.sender_id

            return (
              <div
                key={msg.id}
                className={cn(
                  'animate-in fade-in slide-in-from-bottom-2 flex w-full duration-300',
                  isMe ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'shadow-premium relative max-w-[85%] px-5 py-3 text-sm leading-relaxed md:max-w-[70%]',
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-3xl rounded-tr-sm'
                      : 'bg-background/80 text-foreground rounded-3xl rounded-tl-sm border border-white/10 backdrop-blur-md',
                    isSequential &&
                    (isMe
                      ? 'mt-1 rounded-tr-3xl'
                      : 'mt-1 rounded-tl-3xl')
                  )}
                >
                  {msg.content}
                  <div
                    className={cn(
                      'mt-1 flex items-center gap-1 text-[10px] font-medium opacity-70',
                      isMe
                        ? 'text-primary-foreground/80 justify-end'
                        : 'text-muted-foreground'
                    )}
                  >
                    {format(new Date(msg.created_at), 'HH:mm')}
                    {isMe && (
                      <CheckCheck
                        className={cn(
                          'h-3 w-3',
                          msg.is_read ? 'opacity-100' : 'opacity-40'
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} className="h-4" />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-background/40 z-20 border-t border-white/5 p-4 backdrop-blur-2xl md:p-6">
        <div className="bg-background/60 focus-within:shadow-primary/10 focus-within:border-primary/20 mx-auto flex max-w-4xl items-end gap-3 rounded-4xl border border-white/10 p-2 pl-3 shadow-lg transition-all duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="number-full text-muted-foreground hover:text-primary hover:bg-primary/10 h-10 w-10 shrink-0 rounded-full transition-colors"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>

          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)

              // Typing Indicator logic
              if (!isSending && user && channelRef.current) {
                const userId = user.id
                channelRef.current.send({
                  type: 'broadcast',
                  event: 'typing',
                  payload: { userId, isTyping: true },
                })

                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
                typingTimeoutRef.current = setTimeout(() => {
                  channelRef.current?.send({
                    type: 'broadcast',
                    event: 'typing',
                    payload: { userId, isTyping: false },
                  })
                }, 3000)
              }
            }}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={t('typeMessage')}
            className="placeholder:text-muted-foreground/50 max-h-32 min-h-[44px] flex-1 border-none bg-transparent px-2 py-3 text-base font-medium focus-visible:ring-0"
          />

          <Button
            onClick={handleSend}
            size="icon"
            disabled={!newMessage.trim() || isSending}
            className={cn(
              'h-11 w-11 shrink-0 rounded-full shadow-md transition-all duration-300',
              newMessage.trim()
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 scale-100 hover:scale-105'
                : 'bg-muted text-muted-foreground scale-95 opacity-50'
            )}
          >
            {isSending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <Send className="ml-0.5 h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
