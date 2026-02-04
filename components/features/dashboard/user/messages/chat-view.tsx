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

import { motion, AnimatePresence } from 'framer-motion'
import {
    Send,
    ArrowLeft,
    MoreVertical,
    ShieldCheck,
    CheckCheck,
    Phone,
    Video
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ChatViewProps {
    conversationId: string
}

export function ChatView({ conversationId }: ChatViewProps) {
    const { user } = useAuth()
    const supabase = createClient()
    const bottomRef = useRef<HTMLDivElement>(null)

    const { t } = useTranslation(['messages', 'common'])
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
            <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!conversation) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                {t('messages:notFound')}
            </div>
        )
    }

    const otherUser =
        conversation.buyer_id === user?.id
            ? conversation.seller
            : conversation.buyer
    const listing = conversation.listing

    return (
        <div className="flex h-full flex-col bg-background/30">
            {/* Chat Header */}
            <div className="flex-none flex items-center justify-between border-b border-border/60 p-3 bg-background/80 backdrop-blur-md z-10 sticky top-0">
                <div className="flex items-center gap-3">
                    <Link href="/messages" className="lg:hidden">
                        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 rounded-lg hover:bg-muted">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>

                    <div className="relative group cursor-pointer">
                        <Avatar className="h-10 w-10 rounded-lg border border-border/50 ring-2 ring-transparent group-hover:ring-primary/10 transition-all">
                            <AvatarImage src={otherUser?.avatar_url || ''} />
                            <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">{otherUser?.display_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        {otherUserStatus === 'online' && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-background border border-white/20" />
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-black text-sm leading-none tracking-tight">{otherUser?.display_name || 'User'}</h3>
                            {otherUser?.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-primary fill-primary/10" />}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                            {isOtherTyping ? (
                                <span className="text-primary animate-pulse">{t('messages:typing')}</span>
                            ) : (
                                otherUserStatus === 'online' ? <span className="text-success">Online</span> : 'Offline'
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Compact Listing Card */}
                    {listing && (
                        <Link href={`/listings/${listing.id}`} className="hidden md:flex items-center gap-3 rounded-lg border border-border/50 bg-card p-1.5 pr-3 hover:bg-muted/50 hover:border-primary/20 transition-all group">
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-muted">
                                {listing.images?.[0] ? (
                                    <Image src={listing.images[0]} alt={listing.title} fill sizes="32px" className="object-cover transition-transform group-hover:scale-110" unoptimized />
                                ) : (
                                    <div className="h-full w-full bg-muted" />
                                )}
                            </div>
                            <div className="flex flex-col min-w-[80px]">
                                <p className="text-[10px] font-bold truncate max-w-[120px] leading-tight">{listing.title}</p>
                                <span className="text-[9px] font-bold text-primary">{listing.price} {listing.currency}</span>
                            </div>
                        </Link>
                    )}

                    <div className="flex items-center gap-1 border-l border-border/50 pl-2 ml-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                            <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <ScrollArea className="flex-1 p-4 bg-muted/5">
                <div className="flex flex-col gap-2 max-w-4xl mx-auto">
                    {messages.length === 0 && (
                        <div className="text-center py-20 opacity-50 flex flex-col items-center">
                            <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                                <Send className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">{t('messages:startConversation')}</p>
                            <p className="text-xs text-muted-foreground mt-1">Say hello to start the deal!</p>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => {
                            const isMe = msg.sender_id === user?.id
                            // Grouping logic
                            const isSequential = index > 0 && messages[index - 1]?.sender_id === msg.sender_id
                            const showAvatar = !isMe && (!isSequential || index === 0)

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className={cn(
                                        "flex w-full items-end gap-2",
                                        isMe ? "justify-end" : "justify-start",
                                        isSequential ? "mt-0.5" : "mt-4"
                                    )}
                                >
                                    {!isMe && (
                                        <div className="w-8 shrink-0">
                                            {showAvatar && (
                                                <Avatar className="h-8 w-8 rounded-lg border border-border/40">
                                                    <AvatarImage src={otherUser?.avatar_url || ''} />
                                                    <AvatarFallback className="rounded-lg text-[10px]">{otherUser?.display_name?.[0]}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    )}

                                    <div
                                        className={cn(
                                            "relative px-4 py-2.5 max-w-[75%] shadow-sm text-sm group",
                                            isMe
                                                ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                                : "bg-card text-card-foreground border border-border/60 rounded-2xl rounded-tl-sm",
                                            isSequential && (isMe ? "rounded-tr-2xl" : "rounded-tl-2xl")
                                        )}
                                    >
                                        <p className="whitespace-pre-wrap break-all leading-relaxed">{msg.content}</p>
                                        <div className={cn(
                                            "flex items-center gap-1 mt-1 select-none",
                                            isMe ? "justify-end text-primary-foreground/70" : "justify-start text-muted-foreground/60"
                                        )}>
                                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">
                                                {format(new Date(msg.created_at), 'HH:mm')}
                                            </span>
                                            {isMe && <CheckCheck className={cn("h-3 w-3", msg.is_read ? "opacity-100" : "opacity-40")} />}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-background/80 border-t border-border backdrop-blur-md">
                <div className="max-w-4xl mx-auto flex gap-3 items-end">
                    <Input
                        placeholder={t('messages:typeMessage')}
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
                        className="flex-1 min-h-[44px] bg-muted/30 border-border/60 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        size="icon"
                        className="h-11 w-11 rounded-xl shrink-0 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin", className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
