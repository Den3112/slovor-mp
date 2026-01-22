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

export function ConversationItem({ conv, activeId, userId }: ConversationItemProps) {
    const otherUser = conv.buyer_id === userId ? conv.seller : conv.buyer
    const isActive = activeId === conv.id
    const lastMsg = conv.last_message

    return (
        <Link
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
                        !lastMsg.is_read && lastMsg.sender_id !== userId && !isActive ? "font-bold text-foreground" : ""
                    )}>
                        {lastMsg.sender_id === userId ? 'You: ' : ''}
                        {lastMsg.content}
                    </p>
                )}
            </div>
        </Link>
    )
}
