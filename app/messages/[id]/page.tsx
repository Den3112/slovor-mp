'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/providers/auth-provider'
import { messagesApi, type Message, type Conversation } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from '@/lib/i18n'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Send, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MessageThreadPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const conversationId = params.id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user || !conversationId) return
    loadMessages()

    // Subscribe to realtime messages
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: { new: Message }) => {
          const newMsg = payload.new
          // Only add if not from current user (we already added it locally)
          if (newMsg.sender_id !== user.id) {
            setMessages((prev) => {
              // Check if message already exists
              if (prev.some((m) => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
            // Mark as read
            messagesApi.markAsRead(conversationId, user.id)
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    if (!user) return

    setIsLoading(true)

    // Load messages
    const { data: messagesData } = await messagesApi.getMessages(conversationId)
    if (messagesData) {
      setMessages(messagesData)
      // Mark messages as read
      messagesApi.markAsRead(conversationId, user.id)
    }

    // Load conversations to get full conversation data
    const { data: convList } = await messagesApi.getConversationsForUser(
      user.id
    )
    const currentConv = convList?.find((c) => c.id === conversationId)
    if (currentConv) {
      setConversation(currentConv)
    }

    setIsLoading(false)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!user || !newMessage.trim() || isSending) return

    setIsSending(true)
    const { data, error } = await messagesApi.sendMessage(
      conversationId,
      user.id,
      newMessage
    )

    if (!error && data) {
      setMessages((prev) => [...prev, data])
      setNewMessage('')
    }

    setIsSending(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const otherUser = conversation
    ? conversation.buyer_id === user.id
      ? conversation.seller
      : conversation.buyer
    : null

  return (
    <div className="flex min-h-screen flex-col pt-20">
      {/* Header */}
      <div className="border-border/50 bg-background/95 sticky top-20 z-10 border-b backdrop-blur">
        <Container className="flex items-center gap-4 py-4">
          <button
            onClick={() => router.back()}
            className="hover:bg-muted rounded-xl p-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {otherUser && (
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                {otherUser.avatar_url ? (
                  <Image
                    src={otherUser.avatar_url}
                    alt=""
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-muted flex h-full w-full items-center justify-center rounded-full">
                    <User className="text-muted-foreground h-5 w-5" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-bold">
                  {otherUser.display_name || 'User'}
                </h1>
                {conversation?.listing && (
                  <Link
                    href={`/listings/${conversation.listing.id}`}
                    className="text-primary text-xs hover:underline"
                  >
                    {conversation.listing.title}
                  </Link>
                )}
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <Container className="py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-muted-foreground py-20 text-center">
              {t.messages.startConversation}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isOwn = msg.sender_id === user.id
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      isOwn ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-3',
                        isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted rounded-bl-md'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <p
                        className={cn(
                          'mt-1 text-[10px]',
                          isOwn
                            ? 'text-primary-foreground/60'
                            : 'text-muted-foreground'
                        )}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </Container>
      </div>

      {/* Input */}
      <div className="border-border/50 bg-background sticky bottom-0 border-t">
        <Container className="py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.messages.typeMessage}
              className="border-border bg-muted/30 focus:border-primary flex-1 rounded-2xl border px-4 py-3 text-sm focus:outline-none"
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              className="rounded-2xl px-6"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </div>
    </div>
  )
}
