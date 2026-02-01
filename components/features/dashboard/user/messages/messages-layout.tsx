'use client'

import React, { useState, useEffect } from 'react'
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
} from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MessagesLayoutProps {
    children?: React.ReactNode
}

export function MessagesLayout({ children }: MessagesLayoutProps) {
    const { t } = useTranslation(['messages', 'common'])
    const { user } = useAuth()
    const activeId = useParams().id as string
    const router = useRouter()

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCleaning, setIsCleaning] = useState(false)

    // Polling for conversations (Mocking Realtime for list updates for now)
    // Ideally this should use Supabase realtime similar to ChatView, but simplifying for migration first.
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
            toast.success(t('messages:clearSuccess'))
            router.push('/profile/messages')
        } catch {
            toast.error(t('messages:clearError'))
        } finally {
            setIsCleaning(false)
        }
    }

    const filteredConversations = conversations.filter((c) => {
        const otherUser = c.buyer_id === user?.id ? c.seller : c.buyer
        const name = otherUser?.display_name || 'User'
        const listingTitle = c.listing?.title || ''
        const search = searchQuery.toLowerCase()
        return (
            name.toLowerCase().includes(search) ||
            listingTitle.toLowerCase().includes(search)
        )
    })

    return (
        <div className="flex h-[calc(100vh-140px)] flex-col overflow-hidden rounded-xl bg-card lg:flex-row lg:border lg:border-border">
            {/* Sidebar / List */}
            <div
                className={cn(
                    "flex w-full flex-col bg-background/50 lg:w-[320px] lg:border-r lg:border-border transition-all",
                    // Mobile: Hide list if chat is active
                    activeId ? 'hidden lg:flex' : 'flex'
                )}
            >
                {/* Header */}
                <div className="p-4 border-b border-border space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-heading text-xl font-bold">{t('messages:title')}</h2>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    title={t('messages:clearAllChats')}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('messages:confirmDeleteAll')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('messages:confirmDeleteAllDesc')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('common:cancel')}</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleCleanup}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        {isCleaning ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            t('messages:deleteAll')
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('common:search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-muted/50 border-transparent focus:bg-background transition-all"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <ScrollArea className="flex-1">
                    <div className="p-3 space-y-2">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
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
                                            "flex gap-3 rounded-lg p-3 transition-colors text-left",
                                            isActive
                                                ? "bg-primary/10"
                                                : "hover:bg-muted/50"
                                        )}
                                    >
                                        <div className="relative shrink-0">
                                            <div className="h-12 w-12 overflow-hidden rounded-full border border-border bg-muted">
                                                {otherUser?.avatar_url ? (
                                                    <Image
                                                        src={otherUser.avatar_url}
                                                        alt={otherUser.display_name || ''}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center">
                                                        <User className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={cn(
                                                    "font-semibold truncate",
                                                    isActive ? "text-primary" : "text-foreground"
                                                )}>
                                                    {otherUser?.display_name || 'User'}
                                                </span>
                                                {lastMsg && (
                                                    <span className="text-[10px] text-muted-foreground shrink-0">
                                                        {formatDistanceToNow(new Date(lastMsg.created_at), { addSuffix: true }).replace('about ', '')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate mb-1.5 font-medium">
                                                {conv.listing?.title}
                                            </div>
                                            {lastMsg && (
                                                <p className={cn(
                                                    "text-xs truncate",
                                                    !lastMsg.is_read && lastMsg.sender_id !== user?.id
                                                        ? "font-bold text-foreground"
                                                        : "text-muted-foreground/80"
                                                )}>
                                                    {lastMsg.sender_id === user?.id && <span className="text-primary/70">You: </span>}
                                                    {lastMsg.content}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground/50">
                                <MessageSquarePlus className="h-10 w-10 opacity-20 mb-3" />
                                <p className="text-sm">{t('messages:noMessages')}</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content (Chat or Placeholder) */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 bg-background/50",
                !activeId ? 'hidden lg:flex' : 'flex'
            )}>
                {children}
            </div>
        </div>
    )
}
