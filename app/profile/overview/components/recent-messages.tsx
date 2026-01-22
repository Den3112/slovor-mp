import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { Conversation } from '@/lib/types'

interface RecentMessagesProps {
    userId: string
    unreadCount: number
    conversations: Conversation[]
}

export function RecentMessages({ userId, unreadCount, conversations }: RecentMessagesProps) {
    return (
        <Card className="flex flex-col p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/5 via-background/60 to-background/60 backdrop-blur-xl shadow-xl h-full group transition-all duration-300 hover:shadow-2xl min-h-[300px] md:min-h-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-3">
                        <Link href="/profile/messages" className="font-heading text-xl md:text-2xl font-black tracking-tight hover:text-primary transition-colors flex items-center gap-2">
                            Inbox
                        </Link>
                        {unreadCount > 0 && (
                            <span className="flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-primary/20 animate-pulse">
                                {unreadCount} New
                            </span>
                        )}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">Recent conversations</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col relative z-10">
                {conversations && conversations.length > 0 ? (
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="space-y-3">
                            {conversations.map((conv) => {
                                const otherUser = conv.buyer_id === userId ? conv.seller : conv.buyer
                                const isUnread = conv.last_message && !conv.last_message.is_read && conv.last_message.sender_id !== userId

                                return (
                                    <Link href={`/profile/messages/${conv.id}`} key={conv.id} className={cn(
                                        "relative w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl md:rounded-[1.25rem] border transition-all duration-300 group/item cursor-pointer",
                                        isUnread
                                            ? "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 shadow-sm"
                                            : "bg-background/40 border-white/5 hover:bg-background/60 hover:border-primary/10"
                                    )}>
                                        <div className="relative">
                                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-muted overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                                                {otherUser?.avatar_url ? (
                                                    <Image src={otherUser.avatar_url} alt={otherUser.display_name || 'User'} fill className="object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                                                        {otherUser?.display_name?.[0] || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            {isUnread && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full ring-2 ring-background" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className={cn("font-bold text-sm truncate pr-2 group-hover/item:text-primary transition-colors", isUnread ? "text-foreground" : "text-muted-foreground")}>
                                                    {otherUser?.display_name || 'User'}
                                                </h4>
                                                <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap font-medium">
                                                    {conv.last_message?.created_at ? new Date(conv.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                            <p className={cn("text-xs truncate transition-colors", isUnread ? "font-semibold text-foreground/90" : "font-medium text-muted-foreground/70")}>
                                                {conv.last_message?.content || 'Started a conversation'}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="mt-auto pt-4 flex justify-center">
                            <Link href="/profile/messages" className="group/btn text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5">
                                View All Messages
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                        <div className="h-16 w-16 mobile:h-20 mobile:w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                            <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-base font-bold mb-1">No messages yet</h3>
                        <p className="text-muted-foreground text-xs max-w-[180px] mb-6">
                            Start chatting with buyers and sellers.
                        </p>
                        <Button asChild variant="outline" size="sm" className="rounded-full px-6 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary font-bold">
                            <Link href="/profile/messages">
                                Open Inbox
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}
