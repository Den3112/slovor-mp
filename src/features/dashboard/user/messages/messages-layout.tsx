'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/shared/lib/utils'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/providers/auth-provider'
import { messagesApi, type Conversation } from '@/entities/message/api'
import { User, Loader2, Search, MessageSquarePlus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/shared/lib/i18n'
import { Input } from '@/shared/ui/input'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/shared/ui/button'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/shared/lib/supabase/client'
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
} from '@/shared/ui/alert-dialog'
import { ScrollArea } from '@/shared/ui/scroll-area'

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
        const { data } = await messagesApi.getConversationsForUser(
          supabase,
          user.id
        )
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
      await messagesApi.cleanupAllData(supabase, user.id)
      setConversations([])
      toast.success(t('messages:clearSuccess'))
      router.push(`/${locale}/dashboard/messages`)
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
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-xl transition-colors"
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
              className="bg-muted/40 border-border/50 focus:bg-background focus:border-primary/50 h-9 rounded-xl pl-9 text-xs font-medium transition-all"
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
                        href={`/${locale}/dashboard/messages/${conv.id}`}
                        className={cn(
                          'group relative flex gap-3 rounded-xl border border-transparent p-3 text-left transition-all duration-300',
                          isActive
                            ? 'bg-primary/5 border-primary/10 shadow-sm'
                            : 'hover:bg-muted/60 hover:border-border/40 hover:shadow-xs'
                        )}
                      >
                        {/* Active Indicator */}
                        {isActive && (
                          <div className="bg-primary absolute top-3 bottom-3 left-0 w-1 rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
                        )}

                        <div className="relative shrink-0">
                          <div
                            className={cn(
                              'relative h-12 w-12 overflow-hidden rounded-full border transition-all duration-300',
                              isActive
                                ? 'border-primary/20 ring-primary/10 ring-2'
                                : 'border-border/60 group-hover:border-primary/20'
                            )}
                          >
                            {otherUser?.avatar_url ? (
                              <Image
                                src={otherUser.avatar_url}
                                alt={otherUser.display_name || ''}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="bg-muted text-muted-foreground/50 flex h-full w-full items-center justify-center">
                                <User className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          {isUnread && (
                            <span className="bg-primary ring-background absolute top-0 right-0 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white shadow-sm ring-2" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={cn(
                                'truncate text-sm font-bold transition-colors',
                                isActive
                                  ? 'text-primary'
                                  : 'text-foreground group-hover:text-primary/80'
                              )}
                            >
                              {otherUser?.display_name || 'User'}
                            </span>
                            {lastMsg && (
                              <span
                                className={cn(
                                  'shrink-0 text-[10px] font-bold tracking-widest uppercase tabular-nums',
                                  isUnread
                                    ? 'text-primary'
                                    : 'text-muted-foreground/40'
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
                            <div className="text-muted-foreground/60 max-w-[140px] truncate text-[10px] font-bold tracking-wide uppercase">
                              {conv.listing?.title}
                            </div>
                          </div>
                          {lastMsg && (
                            <p
                              className={cn(
                                'truncate text-xs leading-relaxed',
                                isUnread
                                  ? 'text-foreground font-semibold'
                                  : 'text-muted-foreground group-hover:text-foreground/80 transition-colors'
                              )}
                            >
                              {lastMsg.sender_id === user?.id && (
                                <span className="text-primary/70 mr-1 font-medium">
                                  {t('dashboard:chat.you')}:
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
