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
} from '@/components/ui/alert-dialog'

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
      toast.success(t('messages.clearSuccess'))
      router.push('/profile/messages')
    } catch {
      toast.error(t('messages.clearError'))
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
    <div className="bg-background/40 relative flex h-[calc(100vh-8rem)] overflow-hidden rounded-5xl border border-white/10 shadow-2xl backdrop-blur-2xl">
      {/* List Sidebar */}
      <div
        className={cn(
          'bg-background/60 absolute inset-0 z-20 flex w-full flex-col border-r border-white/10 backdrop-blur-xl transition-transform duration-300 md:static md:w-80 lg:w-[400px]',
          activeId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
        )}
      >
        {/* Header */}
        <div className="space-y-6 border-b border-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-black tracking-tighter italic">
              {t('messages.title')}
            </h2>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full transition-colors"
                  title={t('messages.clearAllChats')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('messages.confirmDeleteAll')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('messages.confirmDeleteAllDesc')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCleanup}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isCleaning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t('messages.deleteAll')
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="group relative">
            <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transition-colors" />
            <Input
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted/30 focus:bg-background focus:border-primary/20 focus:shadow-primary/5 h-12 rounded-2xl border-transparent pl-11 transition-all focus:shadow-lg"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="text-primary/50 h-8 w-8 animate-spin" />
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const otherUser =
                conv.buyer_id === user?.id ? conv.seller : conv.buyer
              const isActive = activeId === conv.id
              const lastMsg = conv.last_message

              return (
                <Link
                  key={conv.id}
                  href={`/profile/messages/${conv.id}`}
                  className={cn(
                    'group relative flex items-start gap-4 overflow-hidden rounded-[1.25rem] p-4 transition-all duration-300',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-primary/25 shadow-lg'
                      : 'hover:bg-white/5 hover:backdrop-blur-sm'
                  )}
                >
                  <div className="relative mt-1 shrink-0">
                    <div
                      className={cn(
                        'rounded-2xl p-0.5 transition-transform duration-300 group-hover:scale-105',
                        isActive
                          ? 'bg-white/20'
                          : 'from-primary/20 to-primary/0 bg-linear-to-br'
                      )}
                    >
                      {otherUser?.avatar_url ? (
                        <Image
                          src={otherUser.avatar_url}
                          alt=""
                          width={48}
                          height={48}
                          className="bg-background h-12 w-12 rounded-[0.9rem] object-cover"
                        />
                      ) : (
                        <div className="bg-background flex h-12 w-12 items-center justify-center rounded-[0.9rem]">
                          <User className="text-muted-foreground h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p
                        className={cn(
                          'truncate text-base font-bold',
                          isActive
                            ? 'text-white'
                            : 'text-foreground group-hover:text-primary transition-colors'
                        )}
                      >
                        {otherUser?.display_name || 'User'}
                      </p>
                      {lastMsg && (
                        <span
                          className={cn(
                            'ml-2 text-[10px] font-medium whitespace-nowrap',
                            isActive
                              ? 'text-white/70'
                              : 'text-muted-foreground/70'
                          )}
                        >
                          {formatDistanceToNow(new Date(lastMsg.created_at), {
                            addSuffix: true,
                          }).replace('about ', '')}
                        </span>
                      )}
                    </div>

                    <p
                      className={cn(
                        'flex items-center gap-1.5 truncate text-xs font-medium',
                        isActive ? 'text-white/80' : 'text-muted-foreground'
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                      {conv.listing?.title}
                    </p>

                    {lastMsg && (
                      <p
                        className={cn(
                          'truncate text-sm leading-relaxed',
                          isActive ? 'text-white/90' : 'text-muted-foreground',
                          !lastMsg.is_read &&
                            lastMsg.sender_id !== user?.id &&
                            !isActive
                            ? 'text-foreground font-bold'
                            : ''
                        )}
                      >
                        {lastMsg.sender_id === user?.id ? 'You: ' : ''}
                        {lastMsg.content}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="text-muted-foreground/50 flex h-full flex-col items-center justify-center space-y-4 p-8 text-center">
              <MessageSquarePlus className="h-12 w-12 opacity-20" />
              <p className="font-medium">{t('messages.noMessages')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={cn(
          'bg-background/40 absolute inset-0 z-10 flex min-w-0 flex-1 flex-col backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0',
          activeId ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {children ? (
          children
        ) : (
          <div className="hidden h-full flex-col items-center justify-center p-8 text-center md:flex">
            <div className="from-primary/10 mb-8 flex h-32 w-32 animate-pulse items-center justify-center rounded-full bg-linear-to-tr to-transparent">
              <MessageSquarePlus className="text-primary/40 h-16 w-16" />
            </div>
            <h3 className="font-heading mb-4 text-3xl font-black tracking-tight italic">
              {t('messages.title')}
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed">
              {t('messages.negotiateDeals')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
