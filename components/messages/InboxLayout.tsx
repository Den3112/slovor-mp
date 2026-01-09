'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { messagesApi, type Conversation } from '@/lib/api/messages'
import { User, Loader2, Search, MessageSquarePlus } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { Input } from '@/components/ui/input'
import { formatDistanceToNow } from 'date-fns'

interface InboxLayoutProps {
    children?: React.ReactNode
}

export function InboxLayout({ children }: InboxLayoutProps) {
    const { t } = useTranslation()
    const { user } = useAuth()
    const activeId = useParams().id as string

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        async function loadConversations() {
            if (!user) return
            try {
                const { data } = await messagesApi.getConversations(user.id)
                if (data) {
                    setConversations(data)
                }
            } catch (error) {
                console.error('Failed to load conversations:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadConversations()
    }, [user])

    const filteredConversations = conversations.filter(c => {
        const otherUser = c.buyer_id === user?.id ? c.seller : c.buyer
        const name = otherUser?.display_name || 'User'
        const listingTitle = c.listing?.title || ''
        const search = searchQuery.toLowerCase()
        return name.toLowerCase().includes(search) || listingTitle.toLowerCase().includes(search)
    })

    return (
        <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-[2rem] border border-white/20 bg-background/60 backdrop-blur-3xl shadow-2xl relative">
            {/* List Sidebar */}
            <div className={cn(
                "w-full md:w-80 lg:w-96 flex flex-col border-r border-border/40 bg-background/50 backdrop-blur-xl absolute inset-0 md:static z-20 transition-transform duration-300",
                activeId ? "-translate-x-full md:translate-x-0" : "translate-x-0"
            )}>
                {/* Header */}
                <div className="p-4 border-b border-border/40 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-heading text-xl font-black tracking-tight">{t.messages.title}</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t.common.search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 rounded-xl bg-muted/50 border-transparent focus:bg-background transition-all"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => {
                            const otherUser = conv.buyer_id === user?.id ? conv.seller : conv.buyer
                            const isActive = activeId === conv.id

                            return (
                                <Link
                                    key={conv.id}
                                    href={`/profile/messages/${conv.id}`}
                                    className={cn(
                                        "group flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-muted/50 relative overflow-hidden",
                                        isActive ? "bg-primary/10 hover:bg-primary/15" : ""
                                    )}
                                >
                                    {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" />}

                                    <div className="relative shrink-0">
                                        {otherUser?.avatar_url ? (
                                            <Image
                                                src={otherUser.avatar_url}
                                                alt=""
                                                width={48}
                                                height={48}
                                                className="h-12 w-12 rounded-full object-cover border-2 border-background shadow-sm"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                                                <User className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}
                                        {/* Status indicator dot if needed */}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className={cn("text-sm font-bold truncate", isActive ? "text-primary" : "text-foreground")}>
                                                {otherUser?.display_name || 'User'}
                                            </p>
                                            {conv.last_message && (
                                                <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(conv.last_message.created_at), { addSuffix: true }).replace('about ', '')}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-muted-foreground truncate font-medium">
                                            {conv.listing?.title}
                                        </p>

                                        {conv.last_message && (
                                            <p className={cn(
                                                "text-xs truncate mt-0.5",
                                                conv.last_message.is_read ? "text-muted-foreground/70" : "font-bold text-foreground"
                                            )}>
                                                {conv.last_message.sender_id === user?.id ? 'You: ' : ''}
                                                {conv.last_message.content}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            )
                        })
                    ) : (
                        <div className="text-center p-8 text-muted-foreground text-sm">
                            No messages found.
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 absolute inset-0 md:static z-10 transition-transform duration-300 md:translate-x-0 bg-background/50 backdrop-blur-md",
                activeId ? "translate-x-0" : "translate-x-full"
            )}>
                {children ? children : (
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
                        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                            <MessageSquarePlus className="h-10 w-10 opacity-50" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Select a conversation</h3>
                        <p className="max-w-xs mx-auto text-sm">Choose a chat from the left to verify details or negotiate a deal.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
