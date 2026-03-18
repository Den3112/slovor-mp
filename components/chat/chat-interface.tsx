'use client'

import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  Image as ImageIcon,
  ShieldAlert,
  CheckCheck,
  Check,
} from 'lucide-react'
import { useChat } from '@/hooks/use-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { format, isToday, isYesterday } from 'date-fns'
import { sk } from 'date-fns/locale'

interface ChatInterfaceProps {
  conversationId: string
  currentUserId: string
  otherUser: {
    id: string
    name: string
    avatar?: string
    isOnline?: boolean
  }
  listing: {
    id: string
    title: string
    price: number
    image?: string
  }
}

export function ChatInterface({
  conversationId,
  currentUserId,
  otherUser,
  listing,
}: ChatInterfaceProps) {
  const { messages, sendMessage, sendTypingStatus, otherUserTyping } = useChat(
    conversationId,
    currentUserId
  )

  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!inputValue.trim()) return
    sendMessage({ content: inputValue, conversationId })
    setInputValue('')
    sendTypingStatus(false)
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, otherUserTyping])

  const renderDateSeparator = (date: string) => {
    const d = new Date(date)
    let label = format(d, 'd. MMMM yyyy', { locale: sk })
    if (isToday(d)) label = 'Dnes'
    else if (isYesterday(d)) label = 'Včera'

    return (
      <div className="my-6 flex items-center justify-center">
        <div className="bg-muted h-px flex-1" />
        <span className="text-muted-foreground mx-4 text-[10px] font-bold tracking-widest uppercase">
          {label}
        </span>
        <div className="bg-muted h-px flex-1" />
      </div>
    )
  }

  return (
    <div className="bg-card flex h-full flex-col overflow-hidden rounded-4xl border shadow-2xl">
      {/* Header */}
      <div className="bg-background/50 sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Avatar className="border-background h-10 w-10 border-2 shadow-sm">
            <AvatarImage src={otherUser.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {otherUser.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm leading-none font-bold">{otherUser.name}</h3>
            <div className="mt-1 flex items-center">
              <span
                className={cn(
                  'mr-2 h-2 w-2 rounded-full',
                  otherUser.isOnline ? 'bg-green-500' : 'bg-muted-foreground/30'
                )}
              />
              <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                {otherUser.isOnline ? 'Práve online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 border-muted-foreground/10 flex items-center rounded-2xl border px-3 py-1.5">
          <div className="bg-background relative mr-3 h-8 w-8 overflow-hidden rounded-lg border">
            {listing.image && (
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="32px"
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="max-w-[100px] truncate text-[10px] leading-tight font-bold">
              {listing.title}
            </span>
            <span className="text-primary text-[10px] font-bold">
              {listing.price} €
            </span>
          </div>
        </div>
      </div>

      {/* Safety Warning */}
      <div className="flex items-center space-x-3 border-b bg-yellow-400/10 px-6 py-2">
        <ShieldAlert className="h-4 w-4 text-yellow-600" />
        <p className="text-[10px] font-medium text-yellow-700">
          Nezdieľajte osobné údaje ani heslá. Všetka komunikácia je monitorovaná
          pre vašu bezpečnosť.
        </p>
      </div>

      {/* Messages Area */}
      <ScrollArea className="bg-muted/5 flex-1 px-6">
        <div ref={scrollRef} className="space-y-4 py-6">
          {messages.map((msg: any, i: number) => {
            const isOwn = msg.sender_id === currentUserId
            const showDate =
              i === 0 ||
              format(new Date(messages[i - 1].created_at), 'yyyy-MM-dd') !==
                format(new Date(msg.created_at), 'yyyy-MM-dd')

            return (
              <React.Fragment key={msg.id}>
                {showDate && renderDateSeparator(msg.created_at)}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: isOwn ? 20 : -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className={cn(
                    'flex flex-col',
                    isOwn ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                      isOwn
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-background rounded-tl-none border'
                    )}
                  >
                    {msg.content}
                  </div>
                  <div className="mt-1 flex items-center space-x-1 px-1">
                    <span className="text-muted-foreground text-[9px] font-medium uppercase">
                      {format(new Date(msg.created_at), 'HH:mm')}
                    </span>
                    {isOwn &&
                      (msg.is_read ? (
                        <CheckCheck className="text-primary h-3 w-3" />
                      ) : (
                        <Check className="text-muted-foreground h-3 w-3" />
                      ))}
                  </div>
                </motion.div>
              </React.Fragment>
            )
          })}

          {otherUserTyping && (
            <div className="bg-background flex w-fit animate-pulse items-center space-x-2 rounded-2xl rounded-tl-none border px-3 py-2 shadow-sm">
              <div className="flex space-x-1">
                <span
                  className="bg-muted-foreground/30 h-1.5 w-1.5 animate-bounce rounded-full"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="bg-muted-foreground/30 h-1.5 w-1.5 animate-bounce rounded-full"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="bg-muted-foreground/30 h-1.5 w-1.5 animate-bounce rounded-full"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                {otherUser.name} píše...
              </span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-background/50 border-t p-6 backdrop-blur-md">
        <div className="bg-muted/30 border-muted-foreground/10 focus-within:ring-primary/20 flex items-end space-x-2 rounded-2xl border p-1 transition-all focus-within:ring-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary h-10 w-10 rounded-xl"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              sendTypingStatus(e.target.value.length > 0)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Napíšte správu..."
            className="min-h-[40px] flex-1 border-none bg-transparent px-2 shadow-none focus-visible:ring-0"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 transform rounded-xl shadow-lg transition-transform active:scale-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
