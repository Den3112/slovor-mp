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
  const { t, locale } = useTranslation(['messages', 'common', 'dashboard'])
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
      router.push(`/${locale}/messages`)
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
    <div className="bg-card lg:border-border flex h-[calc(100vh-140px)] flex-col overflow-hidden rounded-xl shadow-sm lg:flex-row lg:border">
      {/* Sidebar / List */}
      <div
        className={cn(
          'bg-muted/10 lg:border-border flex w-full flex-col transition-all lg:w-[340px] lg:border-r',
          activeId ? 'hidden lg:flex' : 'flex'
        )}
      >
        {/* Header */}
        <div className="border-border bg-background space-y-4 border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight uppercase">
              {t('messages:title')}
            </h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-lg transition-colors"
                  title={t('messages:clearAllChats')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t('messages:confirmDeleteAll')}
                  </AlertDialogTitle>
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
          <div className="group relative">
            <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 transition-colors" />
            <Input
              placeholder={t('common:search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted/40 border-border/50 focus:bg-background focus:border-primary/50 h-9 rounded-lg pl-9 text-xs font-medium transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {isLoading ? (
              <div className="text-muted-foreground/50 flex flex-col items-center justify-center gap-2 py-12">
                <Loader2 className="text-primary h-5 w-5 animate-spin" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  {t('common:loading')}
                </span>
              </div>
            ) : filteredConversations.length > 0 ? (
              <AnimatePresence initial={false}>
                {filteredConversations.map((conv, index) => {
                  const otherUser =
                    conv.buyer_id === user?.id ? conv.seller : conv.buyer
                  const isActive = activeId === conv.id
                  const lastMsg = conv.last_message
                  const isUnread =
                    lastMsg &&
                    !lastMsg.is_read &&
                    lastMsg.sender_id !== user?.id

                  return (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/${locale}/messages/${conv.id}`}
                        className={cn(
                          'group relative flex gap-3 rounded-xl border border-transparent p-3 text-left transition-all duration-200',
                          isActive
                            ? 'bg-primary/5 border-primary/10 shadow-sm'
                            : 'hover:bg-muted/60 hover:border-border/50'
                        )}
                      >
                        {/* Active Indicator */}
                        {isActive && (
                          <div className="bg-primary absolute top-3 bottom-3 left-0 w-1 rounded-r-full" />
                        )}

                        <div className="relative shrink-0">
                          <div
                            className={cn(
                              'bg-muted h-10 w-10 overflow-hidden rounded-lg border transition-colors',
                              isActive
                                ? 'border-primary/20'
                                : 'border-border/60'
                            )}
                          >
                            {otherUser?.avatar_url ? (
                              <Image
                                src={otherUser.avatar_url}
                                alt={otherUser.display_name || ''}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <User className="text-muted-foreground/50 h-4 w-4" />
                              </div>
                            )}
                          </div>
                          {isUnread && (
                            <span className="bg-primary ring-background absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full border border-white/20 ring-2" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                          <div className="mb-0.5 flex items-center justify-between">
                            <span
                              className={cn(
                                'truncate text-sm font-bold',
                                isActive ? 'text-primary' : 'text-foreground'
                              )}
                            >
                              {otherUser?.display_name || 'User'}
                            </span>
                            {lastMsg && (
                              <span
                                className={cn(
                                  'ml-2 shrink-0 text-[9px] font-bold tracking-widest uppercase',
                                  isUnread
                                    ? 'text-primary'
                                    : 'text-muted-foreground/50'
                                )}
                              >
                                {formatDistanceToNow(
                                  new Date(lastMsg.created_at),
                                  { addSuffix: false }
                                ).replace('about ', '')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-muted-foreground/70 mb-0.5 max-w-[120px] truncate text-[10px] font-bold tracking-wide uppercase">
                              {conv.listing?.title}
                            </div>
                          </div>
                          {lastMsg && (
                            <p
                              className={cn(
                                'truncate text-xs leading-snug',
                                isUnread
                                  ? 'text-foreground font-semibold'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {lastMsg.sender_id === user?.id && (
                                <span className="text-primary/70 font-medium">
                                  {t('dashboard:chat.you')}:{' '}
                                </span>
                              )}
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
              <div className="text-muted-foreground/50 flex flex-col items-center justify-center py-12 text-center">
                <MessageSquarePlus className="mb-3 h-8 w-8 opacity-20" />
                <p className="text-xs font-medium tracking-widest uppercase">
                  {t('messages:noMessages')}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Section (Optional, e.g. status) */}
        <div className="border-border bg-muted/20 border-t p-2 text-center">
          <p className="text-muted-foreground/40 text-[9px] font-bold tracking-widest uppercase">
            {filteredConversations.length}{' '}
            {t('common:conversations').toLowerCase()}
          </p>
        </div>
      </div>

      {/* Main Content (Chat or Placeholder) */}
      <div
        className={cn(
          'bg-background flex min-w-0 flex-1 flex-col',
          !activeId ? 'hidden lg:flex' : 'flex'
        )}
      >
        {children}
      </div>
    </div>
  )
}
