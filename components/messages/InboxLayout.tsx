'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { messagesApi, type Conversation } from '@/lib/api/messages'
import { User, Loader2, Search, MessageSquarePlus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'
import { Input } from '@/components/ui/input'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface InboxLayoutProps {
    children?: React.ReactNode
}

export function InboxLayout({ children }: InboxLayoutProps) {
    const { t } = useTranslation()
    const { user } = useAuth()
    const activeId = useParams().id as string
    const router = useRouter()

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCleaning, setIsCleaning] = useState(false)

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

    const handleCleanup = async () => {
        if (!user) return
        setIsCleaning(true)
        try {
            await messagesApi.cleanupAllData(user.id)
            setConversations([])
            toast.success('All messages cleared')
            router.push('/profile/messages')
        } catch (error) {
            toast.error('Failed to clear messages')
        } finally {
            setIsCleaning(false)
        }
    }

    const filteredConversations = conversations.filter(c => {
        const otherUser = c.buyer_id === user?.id ? c.seller : c.buyer
        const name = otherUser?.display_name || 'User'
        const listingTitle = c.listing?.title || ''
        const search = searchQuery.toLowerCase()
        return name.toLowerCase().includes(search) || listingTitle.toLowerCase().includes(search)
    })

    return (
        <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-[2.5rem] border border-white/10 bg-background/40 backdrop-blur-2xl shadow-2xl relative">
            {/* List Sidebar */}
            <div className={cn(
                "w-full md:w-80 lg:w-[400px] flex flex-col border-r border-white/10 bg-background/60 backdrop-blur-xl absolute inset-0 md:static z-20 transition-transform duration-300",
                activeId ? "-translate-x-full md:translate-x-0" : "translate-x-0"
            )}>
                {/* Header */}
                <div className="p-6 border-b border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-heading text-2xl font-black tracking-tighter italic">{t.messages.title}</h2>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors" title="Clear all chats">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete all messages?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your entire conversation history.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleCleanup} className="bg-destructive hover:bg-destructive/90">
                                        {isCleaning ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete All'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder={t.common.search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-12 rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/20 focus:shadow-lg focus:shadow-primary/5 transition-all"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                        </div>
                    ) : filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => {
                            const otherUser = conv.buyer_id === user?.id ? conv.seller : conv.buyer
                            const isActive = activeId === conv.id
                            const lastMsg = conv.last_message

                            return (
                                <Link
                                    key={conv.id}
                                    href={`/profile/messages/${conv.id}`}
                                    className={cn(
                                        "group flex items-start gap-4 p-4 rounded-[1.25rem] transition-all duration-300 relative overflow-hidden",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                            : "hover:bg-white/5 hover:backdrop-blur-sm"
                                    )}
                                >
                                    <div className="relative shrink-0 mt-1">
                                        <div className={cn(
                                            "rounded-2xl p-0.5 transition-transform duration-300 group-hover:scale-105",
                                            isActive ? "bg-white/20" : "bg-gradient-to-br from-primary/20 to-primary/0"
                                        )}>
                                            {otherUser?.avatar_url ? (
                                                <Image
                                                    src={otherUser.avatar_url}
                                                    alt=""
                                                    width={48}
                                                    height={48}
                                                    className="h-12 w-12 rounded-[0.9rem] object-cover bg-background"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-[0.9rem] bg-background flex items-center justify-center">
                                                    <User className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className={cn(
                                                "font-bold truncate text-base",
                                                isActive ? "text-white" : "text-foreground group-hover:text-primary transition-colors"
                                            )}>
                                                {otherUser?.display_name || 'User'}
                                            </p>
                                            {lastMsg && (
                                                <span className={cn(
                                                    "text-[10px] font-medium whitespace-nowrap ml-2",
                                                    isActive ? "text-white/70" : "text-muted-foreground/70"
                                                )}>
                                                    {formatDistanceToNow(new Date(lastMsg.created_at), { addSuffix: true }).replace('about ', '')}
                                                </span>
                                            )}
                                        </div>

                                        <p className={cn(
                                            "text-xs truncate font-medium flex items-center gap-1.5",
                                            isActive ? "text-white/80" : "text-muted-foreground"
                                        )}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                                            {conv.listing?.title}
                                        </p>

                                        {lastMsg && (
                                            <p className={cn(
                                                "text-sm truncate leading-relaxed",
                                                isActive ? "text-white/90" : "text-muted-foreground",
                                                !lastMsg.is_read && lastMsg.sender_id !== user?.id && !isActive ? "font-bold text-foreground" : ""
                                            )}>
                                                {lastMsg.sender_id === user?.id ? 'You: ' : ''}
                                                {lastMsg.content}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4 text-muted-foreground/50">
                            <MessageSquarePlus className="h-12 w-12 opacity-20" />
                            <p className="font-medium">No messages yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 absolute inset-0 md:static z-10 transition-transform duration-300 md:translate-x-0 bg-background/40 backdrop-blur-xl",
                activeId ? "translate-x-0" : "translate-x-full"
            )}>
                {children ? children : (
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-primary/10 to-transparent flex items-center justify-center mb-8 animate-pulse">
                            <MessageSquarePlus className="h-16 w-16 text-primary/40" />
                        </div>
                        <h3 className="font-heading text-3xl font-black italic tracking-tight mb-4">Your Inbox</h3>
                        <p className="max-w-md mx-auto text-muted-foreground text-lg leading-relaxed">
                            Select a conversation from the list to view chat history, negotiate deals, or ask questions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
