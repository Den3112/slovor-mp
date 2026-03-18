'use client'

import { motion } from 'framer-motion'
import { Search, Clock, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatDistanceToNow } from 'date-fns'
import { sk } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Conversation {
  id: string
  last_message_at: string
  unread_count: number
  listing: {
    title: string
    image?: string
  }
  other_user: {
    name: string
    avatar?: string
    isOnline?: boolean
  }
  last_message?: string
}

interface ConversationsListProps {
  conversations: Conversation[]
  activeId?: string
  onSelect: (id: string) => void
}

export function ConversationsList({
  conversations,
  activeId,
  onSelect,
}: ConversationsListProps) {
  return (
    <div className="bg-card/30 flex h-full flex-col overflow-hidden rounded-4xl border backdrop-blur-xl">
      <div className="p-6 pb-2">
        <h2 className="mb-4 text-2xl font-bold">Moje správy</h2>
        <div className="group relative">
          <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors" />
          <Input
            placeholder="Hľadať v správach..."
            className="bg-background/50 border-muted-foreground/10 focus-visible:ring-primary/20 h-10 rounded-xl pl-10"
          />
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {conversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 p-6 text-center">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
              <Clock className="text-muted-foreground/30 h-8 w-8" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              Zatiaľ nemáte žiadne konverzácie.
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <motion.button
              key={conv.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'group flex w-full items-center space-x-4 rounded-2xl p-4 text-left transition-all',
                activeId === conv.id
                  ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-lg'
                  : 'bg-background hover:bg-muted hover:border-muted-foreground/10 border border-transparent'
              )}
            >
              <div className="relative shrink-0">
                <Avatar className="border-background h-12 w-12 border-2 shadow-sm">
                  <AvatarImage src={conv.other_user.avatar} />
                  <AvatarFallback
                    className={cn(
                      'font-bold',
                      activeId === conv.id
                        ? 'bg-primary-foreground/10 text-primary-foreground'
                        : 'bg-primary/10 text-primary'
                    )}
                  >
                    {conv.other_user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {conv.other_user.isOnline && (
                  <span className="border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500" />
                )}
              </div>

              <div className="min-w-0 flex-1 pr-2">
                <div className="mb-1 flex items-center justify-between">
                  <h4 className="truncate text-sm font-bold">
                    {conv.other_user.name}
                  </h4>
                  <span
                    className={cn(
                      'text-[10px] font-bold tracking-wider uppercase',
                      activeId === conv.id
                        ? 'text-primary-foreground/60'
                        : 'text-muted-foreground'
                    )}
                  >
                    {formatDistanceToNow(new Date(conv.last_message_at), {
                      addSuffix: true,
                      locale: sk,
                    })}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={cn(
                      'max-w-[150px] truncate text-xs',
                      activeId === conv.id
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    )}
                  >
                    {conv.last_message || 'Žiadne správy'}
                  </span>
                  {conv.unread_count > 0 && (
                    <Badge className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full border-none bg-red-500 px-1.5 text-white">
                      {conv.unread_count}
                    </Badge>
                  )}
                </div>

                <div
                  className={cn(
                    'mt-2 flex items-center text-[9px] font-bold tracking-widest uppercase',
                    activeId === conv.id
                      ? 'text-primary-foreground/40'
                      : 'text-muted-foreground/40'
                  )}
                >
                  <ChevronRight className="mr-1 h-3 w-3" />
                  {conv.listing.title}
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  )
}
