import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Message } from '@/lib/api/messages'

interface ChatMessagesProps {
    messages: Message[]
    userId?: string
    otherUserName?: string
    bottomRef: React.RefObject<HTMLDivElement | null>
}

export function ChatMessages({ messages, userId, otherUserName, bottomRef }: ChatMessagesProps) {
    return (
        <ScrollArea className="flex-1 px-4 md:px-6">
            <div className="space-y-6 max-w-4xl mx-auto py-6">
                {messages.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-sm">Start the conversation with {otherUserName || 'User'}</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.sender_id === userId
                    const isSequential = index > 0 && messages[index - 1]?.sender_id === msg.sender_id

                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                                isMe ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "relative px-5 py-3 max-w-[85%] md:max-w-[70%] shadow-premium text-sm leading-relaxed",
                                isMe
                                    ? "bg-primary text-primary-foreground rounded-[1.5rem] rounded-tr-sm"
                                    : "bg-background/80 backdrop-blur-md border border-white/10 text-foreground rounded-[1.5rem] rounded-tl-sm",
                                isSequential && (isMe ? "rounded-tr-[1.5rem] mt-1" : "rounded-tl-[1.5rem] mt-1")
                            )}>
                                {msg.content}
                                <div className={cn(
                                    "text-[10px] flex items-center gap-1 mt-1 opacity-70 font-medium",
                                    isMe ? "justify-end text-primary-foreground/80" : "text-muted-foreground"
                                )}>
                                    {format(new Date(msg.created_at), 'HH:mm')}
                                    {isMe && (
                                        <CheckCheck className={cn("h-3 w-3", msg.is_read ? "opacity-100" : "opacity-40")} />
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} className="h-4" />
            </div>
        </ScrollArea>
    )
}
