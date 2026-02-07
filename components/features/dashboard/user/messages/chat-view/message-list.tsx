import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { MessageListProps } from './types'

export function MessageList({
  messages,
  currentUserId,
  otherUser,
  bottomRef,
}: MessageListProps) {
  const { t } = useTranslation(['messages'])

  return (
    <ScrollArea className="bg-muted/5 flex-1 p-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center opacity-50">
            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
              <Send className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-sm font-medium">
              {t('messages:startConversation')}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {t('messages:startChat')}
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isMe = msg.sender_id === currentUserId
            const isSequential =
              index > 0 && messages[index - 1]?.sender_id === msg.sender_id
            const showAvatar = !isMe && (!isSequential || index === 0)

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'flex w-full items-end gap-2',
                  isMe ? 'justify-end' : 'justify-start',
                  isSequential ? 'mt-0.5' : 'mt-4'
                )}
              >
                {!isMe && (
                  <div className="w-8 shrink-0">
                    {showAvatar && (
                      <Avatar className="border-border/40 h-8 w-8 rounded-lg border">
                        <AvatarImage src={otherUser?.avatar_url || ''} />
                        <AvatarFallback className="rounded-lg text-[10px]">
                          {otherUser?.display_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}

                <div
                  className={cn(
                    'group relative max-w-[80%] px-4 py-2 text-sm shadow-sm',
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-xl rounded-tr-sm'
                      : 'bg-card text-card-foreground border-border/60 rounded-xl rounded-tl-sm border',
                    isSequential && (isMe ? 'rounded-tr-xl' : 'rounded-tl-xl')
                  )}
                >
                  <p className="leading-relaxed font-medium break-all whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <div
                    className={cn(
                      'mt-0.5 flex items-center gap-1 select-none',
                      isMe
                        ? 'text-primary-foreground/70 justify-end'
                        : 'text-muted-foreground/60 justify-start'
                    )}
                  >
                    <span className="text-[8px] font-bold tracking-widest uppercase opacity-80">
                      {format(new Date(msg.created_at), 'HH:mm')}
                    </span>
                    {isMe && (
                      <CheckCheck
                        className={cn(
                          'h-2.5 w-2.5',
                          msg.is_read ? 'opacity-100' : 'opacity-40'
                        )}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
