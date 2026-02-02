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
import { motion, AnimatePresence } from 'framer-motion'
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
            router.push('/messages')
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
        <div className="flex h-[calc(100vh-140px)] flex-col overflow-hidden rounded-xl bg-card lg:flex-row lg:border lg:border-border shadow-sm">
            {/* Sidebar / List */}
            <div
                className={cn(
                    "flex w-full flex-col bg-muted/10 lg:w-[340px] lg:border-r lg:border-border transition-all",
                    activeId ? 'hidden lg:flex' : 'flex'
                )}
            >
                {/* Header */}
                <div className="p-4 border-b border-border space-y-4 bg-background">
                    <div className="flex items-center justify-between">
                        <h2 className="font-black text-lg uppercase tracking-tight">{t('messages:title')}</h2>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder={t('common:search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 bg-muted/40 border-border/50 focus:bg-background focus:border-primary/50 transition-all text-xs font-medium rounded-lg"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground/50">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{t('common:loading')}</span>
                            </div>
                        ) : filteredConversations.length > 0 ? (
                            <AnimatePresence initial={false}>
                                {filteredConversations.map((conv, index) => {
                                    const otherUser = conv.buyer_id === user?.id ? conv.seller : conv.buyer
                                    const isActive = activeId === conv.id
                                    const lastMsg = conv.last_message
                                    const isUnread = lastMsg && !lastMsg.is_read && lastMsg.sender_id !== user?.id

                                    return (
                                        <motion.div
                                            key={conv.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={`/messages/${conv.id}`}
                                                className={cn(
                                                    "group relative flex gap-3 rounded-xl p-3 transition-all duration-200 text-left border border-transparent",
                                                    isActive
                                                        ? "bg-primary/5 border-primary/10 shadow-sm"
                                                        : "hover:bg-muted/60 hover:border-border/50"
                                                )}
                                            >
                                                {/* Active Indicator */}
                                                {isActive && (
                                                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full" />
                                                )}

                                                <div className="relative shrink-0">
                                                    <div className={cn(
                                                        "h-10 w-10 overflow-hidden rounded-lg border bg-muted transition-colors",
                                                        isActive ? "border-primary/20" : "border-border/60"
                                                    )}>
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
                                                                <User className="h-4 w-4 text-muted-foreground/50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isUnread && (
                                                        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary ring-2 ring-background border border-white/20 animate-pulse" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <span className={cn(
                                                            "text-sm font-bold truncate",
                                                            isActive ? "text-primary" : "text-foreground"
                                                        )}>
                                                            {otherUser?.display_name || 'User'}
                                                        </span>
                                                        {lastMsg && (
                                                            <span className={cn(
                                                                "text-[9px] font-bold uppercase tracking-widest shrink-0 ml-2",
                                                                isUnread ? "text-primary" : "text-muted-foreground/50"
                                                            )}>
                                                                {formatDistanceToNow(new Date(lastMsg.created_at), { addSuffix: false }).replace('about ', '')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground/70 truncate mb-0.5 max-w-[120px]">
                                                            {conv.listing?.title}
                                                        </div>
                                                    </div>
                                                    {lastMsg && (
                                                        <p className={cn(
                                                            "text-xs truncate leading-snug",
                                                            isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                                                        )}>
                                                            {lastMsg.sender_id === user?.id && <span className="text-primary/70 font-medium">You: </span>}
                                                            {lastMsg.content}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground/50">
                                <MessageSquarePlus className="h-8 w-8 opacity-20 mb-3" />
                                <p className="text-xs font-medium uppercase tracking-widest">{t('messages:noMessages')}</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer Section (Optional, e.g. status) */}
                <div className="p-2 border-t border-border bg-muted/20 text-center">
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        {filteredConversations.length} {t('common:conversations').toLowerCase()}
                    </p>
                </div>
            </div>

            {/* Main Content (Chat or Placeholder) */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 bg-background",
                !activeId ? 'hidden lg:flex' : 'flex'
            )}>
                {children}
            </div>
        </div>
    )
}
