import { cn } from '@/lib/utils'
import Link from 'next/link'
import { User } from 'lucide-react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import type { Conversation } from '@/lib/api/messages'

interface ConversationItemProps {
  conv: Conversation
  activeId: string
  userId?: string
}

export function ConversationItem({
  conv,
  activeId,
  userId,
}: ConversationItemProps) {
  const otherUser = conv.buyer_id === userId ? conv.seller : conv.buyer
  const isActive = activeId === conv.id
  const lastMsg = conv.last_message

  return (
    <Link
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
                isActive ? 'text-white/70' : 'text-muted-foreground/70'
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
              !lastMsg.is_read && lastMsg.sender_id !== userId && !isActive
                ? 'text-foreground font-bold'
                : ''
            )}
          >
            {lastMsg.sender_id === userId ? 'You: ' : ''}
            {lastMsg.content}
          </p>
        )}
      </div>
    </Link>
  )
}
