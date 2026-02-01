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
    ArrowLeft,
    MoreVertical,
    ShieldCheck,
    CheckCheck,
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
        <div className="flex h-full flex-col">
            {/* Chat Header */}
            <div className="flxe flex-none items-center justify-between border-b border-border p-4 bg-background/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <Link href="/profile/messages" className="lg:hidden">
                        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>

                    <div className="relative">
                        <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src={otherUser?.avatar_url || ''} />
                            <AvatarFallback>{otherUser?.display_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        {otherUserStatus === 'online' && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background border border-white/20" />
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-sm leading-none">{otherUser?.display_name || 'User'}</h3>
                            {otherUser?.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-primary fill-primary/10" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {isOtherTyping ? (
                                <span className="text-primary animate-pulse">{t('messages:typing')}</span>
                            ) : (
                                otherUserStatus === 'online' ? 'Online' : 'Offline'
                            )}
                        </p>
                    </div>
                </div>

                {listing && (
                    <Link href={`/listings/${listing.id}`} className="hidden md:flex items-center gap-3 rounded-lg border border-border bg-card p-2 hover:bg-muted/50 transition-colors max-w-[200px]">
                        {listing.images?.[0] ? (
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-muted">
                                <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" unoptimized />
                            </div>
                        ) : (
                            <div className="h-8 w-8 bg-muted rounded shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{listing.title}</p>
                            <p className="text-xs font-bold text-primary">{listing.price} {listing.currency}</p>
                        </div>
                    </Link>
                )}

                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages List */}
            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                    {messages.length === 0 && (
                        <div className="text-center py-10 opacity-50 text-sm">{t('messages:startConversation')}</div>
                    )}

                    {messages.map((msg, index) => {
                        const isMe = msg.sender_id === user?.id
                        // Simple sequential check
                        const isSequential = index > 0 && messages[index - 1]?.sender_id === msg.sender_id

                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-full max-w-[80%]",
                                    isMe ? "ml-auto justify-end" : "mr-auto"
                                )}
                            >
                                <div
                                    className={cn(
                                        "px-4 py-2 text-sm shadow-sm",
                                        isMe
                                            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                            : "bg-card text-card-foreground border border-border rounded-2xl rounded-tl-sm",
                                        isSequential && (isMe ? "rounded-tr-2xl mt-0.5" : "rounded-tl-2xl mt-0.5")
                                    )}
                                >
                                    <p className="whitespace-pre-wrap break-all">{msg.content}</p>
                                    <div className={cn(
                                        "text-[10px] mt-1 flex items-center justify-end gap-1 opacity-70",
                                        isMe ? "text-primary-foreground" : "text-muted-foreground"
                                    )}>
                                        {format(new Date(msg.created_at), 'HH:mm')}
                                        {isMe && <CheckCheck className={cn("h-3 w-3", msg.is_read ? "opacity-100" : "opacity-50")} />}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-background/80 border-t border-border backdrop-blur-sm">
                <div className="flex gap-2">
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
                        className="flex-1 bg-muted/40"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        size="icon"
                        className="shrink-0"
                    >
                        <Send className="h-4 w-4" />
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
