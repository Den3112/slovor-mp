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

export function ChatMessages({
  messages,
  userId,
  otherUserName,
  bottomRef,
}: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 px-4 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6 py-6">
        {messages.length === 0 && (
          <div className="py-10 text-center opacity-50">
            <p className="text-sm">
              Start the conversation with {otherUserName || 'User'}
            </p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMe = msg.sender_id === userId
          const isSequential =
            index > 0 && messages[index - 1]?.sender_id === msg.sender_id

          return (
            <div
              key={msg.id}
              className={cn(
                'animate-in fade-in slide-in-from-bottom-2 flex w-full duration-300',
                isMe ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'shadow-premium relative max-w-[85%] px-5 py-3 text-sm leading-relaxed md:max-w-[70%]',
                  isMe
                    ? 'bg-primary text-primary-foreground rounded-[1.5rem] rounded-tr-sm'
                    : 'bg-background/80 text-foreground rounded-[1.5rem] rounded-tl-sm border border-white/10 backdrop-blur-md',
                  isSequential &&
                    (isMe
                      ? 'mt-1 rounded-tr-[1.5rem]'
                      : 'mt-1 rounded-tl-[1.5rem]')
                )}
              >
                {msg.content}
                <div
                  className={cn(
                    'mt-1 flex items-center gap-1 text-[10px] font-medium opacity-70',
                    isMe
                      ? 'text-primary-foreground/80 justify-end'
                      : 'text-muted-foreground'
                  )}
                >
                  {format(new Date(msg.created_at), 'HH:mm')}
                  {isMe && (
                    <CheckCheck
                      className={cn(
                        'h-3 w-3',
                        msg.is_read ? 'opacity-100' : 'opacity-40'
                      )}
                    />
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
