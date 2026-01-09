'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { messagesApi, type Message, type Conversation } from '@/lib/api/messages'
import { useAuth } from '@/components/providers/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Phone, ArrowLeft, MoreVertical, ShieldCheck, Image as ImageIcon } from 'lucide-react'
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

    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
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
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    const newMsg = payload.new as Message
                    setMessages((prev) => [...prev, newMsg])
                    // If not from me, mark as read (optimistic or separate call)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId, user, supabase])

    useEffect(() => {
        // Scroll to bottom
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!newMessage.trim() || !user) return

        setIsSending(true)
        try {
            const { data: sentMsg, error } = await messagesApi.sendMessage(conversationId, user.id, newMessage)

            if (error) throw error

            if (sentMsg) {
                setMessages(prev => [...prev, sentMsg])
                setNewMessage('')
            }
        } catch (error) {
            toast.error('Failed to send message')
        } finally {
            setIsSending(false)
        }
    }

    if (isLoading) {
        return <div className="h-full flex items-center justify-center">Loading...</div>
    }

    if (!conversation) {
        return <div className="h-full flex items-center justify-center">Conversation not found</div>
    }

    const otherUser = conversation.buyer_id === user?.id ? conversation.seller : conversation.buyer
    const listing = conversation.listing

    return (
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-background/60 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Link href="/profile/messages" className="md:hidden">
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>

                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={otherUser?.avatar_url || ''} />
                        <AvatarFallback>{otherUser?.display_name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>

                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm leading-none">{otherUser?.display_name || 'User'}</h3>
                            {/* Verification Badge Mockup */}
                            <ShieldCheck className="h-3 w-3 text-blue-500" />
                        </div>
                        {listing && (
                            <Link href={`/listing/${listing.id}`} className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5">
                                <span className="font-medium">Regarding:</span> {listing.title} • {listing.price}€
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-3xl mx-auto pb-4">
                    {messages.map((msg, index) => {
                        const isMe = msg.sender_id === user?.id
                        const isSequential = index > 0 && messages[index - 1]?.sender_id === msg.sender_id

                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-full mb-1",
                                    isMe ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn(
                                    "px-4 py-2.5 max-w-[75%] shadow-sm text-sm break-words",
                                    isMe
                                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                        : "bg-white dark:bg-muted text-foreground rounded-2xl rounded-tl-sm border border-border/50",
                                    isSequential && (isMe ? "rounded-tr-2xl" : "rounded-tl-2xl")
                                )}>
                                    {msg.content}
                                </div>
                                <div className={cn(
                                    "text-[10px] text-muted-foreground self-end px-1 opacity-50",
                                    isMe ? "order-first" : "order-last"
                                )}>
                                    {format(new Date(msg.created_at), 'HH:mm')}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-background/80 border-t border-border/40 backdrop-blur-md">
                <div className="max-w-3xl mx-auto flex items-end gap-2 bg-muted/30 p-2 rounded-[1.5rem] border border-border/50 focus-within:bg-background focus-within:shadow-lg focus-within:border-primary/20 transition-all duration-300">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full shrink-0 text-muted-foreground hover:text-primary">
                        <ImageIcon className="h-5 w-5" />
                    </Button>

                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 min-h-[40px] max-h-32 border-none bg-transparent focus-visible:ring-0 px-2 py-2.5 placeholder:text-muted-foreground/50 font-medium"
                    />

                    <Button
                        onClick={handleSend}
                        size="icon"
                        disabled={!newMessage.trim() || isSending}
                        className={cn(
                            "h-10 w-10 rounded-full shrink-0 transition-all duration-300",
                            newMessage.trim()
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100"
                                : "bg-muted text-muted-foreground scale-90 opacity-70"
                        )}
                    >
                        {isSending ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        ) : (
                            <Send className="h-4 w-4 ml-0.5" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
