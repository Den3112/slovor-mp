import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InboxPreviewProps {
    stats: any
    userId: string
}

export function InboxPreview({ stats, userId }: InboxPreviewProps) {
    return (
        <Card className="via-background/60 to-background/60 group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl md:min-h-auto md:rounded-[2.5rem] md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />

            <div className="relative z-10 mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/profile/messages"
                            className="font-heading hover:text-primary flex items-center gap-2 text-xl font-black tracking-tight transition-colors md:text-2xl"
                        >
                            Inbox
                        </Link>
                        {stats.messages > 0 && (
                            <span className="bg-primary text-primary-foreground shadow-primary/20 flex animate-pulse items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold shadow-lg">
                                {stats.messages} New
                            </span>
                        )}
                    </div>
                    <p className="text-muted-foreground text-xs font-medium md:text-sm">
                        Recent conversations
                    </p>
                </div>
            </div>

            <div className="relative z-10 flex flex-1 flex-col">
                {stats.recentConversations && stats.recentConversations.length > 0 ? (
                    <div className="flex flex-1 flex-col gap-3">
                        <div className="space-y-3">
                            {stats.recentConversations.map((conv: any) => {
                                const otherUser =
                                    conv.buyer_id === userId ? conv.seller : conv.buyer
                                const isUnread =
                                    conv.last_message &&
                                    !conv.last_message.is_read &&
                                    conv.last_message.sender_id !== userId

                                return (
                                    <Link
                                        href={`/profile/messages/${conv.id}`}
                                        key={conv.id}
                                        className={cn(
                                            'group/item relative flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all duration-300 md:gap-4 md:rounded-[1.25rem] md:p-4',
                                            isUnread
                                                ? 'bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 shadow-sm'
                                                : 'bg-background/40 hover:bg-background/60 hover:border-primary/10 border-white/5'
                                        )}
                                    >
                                        <div className="relative">
                                            <div className="bg-muted h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10 shadow-sm md:h-12 md:w-12">
                                                {otherUser?.avatar_url ? (
                                                    <Image
                                                        src={otherUser.avatar_url}
                                                        alt={otherUser.display_name || 'User'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-sm font-bold">
                                                        {otherUser?.display_name?.[0] || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            {isUnread && (
                                                <span className="border-background ring-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500 ring-2" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1 text-left">
                                            <div className="mb-0.5 flex items-center justify-between">
                                                <h4
                                                    className={cn(
                                                        'group-hover/item:text-primary truncate pr-2 text-sm font-bold transition-colors',
                                                        isUnread
                                                            ? 'text-foreground'
                                                            : 'text-muted-foreground'
                                                    )}
                                                >
                                                    {otherUser?.display_name || 'User'}
                                                </h4>
                                                <span className="text-muted-foreground/60 text-[10px] font-medium whitespace-nowrap">
                                                    {conv.last_message?.created_at
                                                        ? new Date(
                                                            conv.last_message.created_at
                                                        ).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })
                                                        : ''}
                                                </span>
                                            </div>
                                            <p
                                                className={cn(
                                                    'truncate text-xs transition-colors',
                                                    isUnread
                                                        ? 'text-foreground/90 font-semibold'
                                                        : 'text-muted-foreground/70 font-medium'
                                                )}
                                            >
                                                {conv.last_message?.content ||
                                                    'Started a conversation'}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="mt-auto flex justify-center pt-4">
                            <Link
                                href="/profile/messages"
                                className="group/btn text-muted-foreground hover:text-primary hover:bg-primary/5 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors"
                            >
                                View All Messages
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                        <div className="mobile:h-20 mobile:w-20 bg-muted/30 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <MessageCircle className="text-muted-foreground/40 h-8 w-8" />
                        </div>
                        <h3 className="mb-1 text-base font-bold">No messages yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-[180px] text-xs">
                            Start chatting with buyers and sellers.
                        </p>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-primary/20 text-primary hover:bg-primary/5 hover:text-primary rounded-full px-6 font-bold"
                        >
                            <Link href="/profile/messages">Open Inbox</Link>
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}
