'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  messagesApi,
  type Message,
  type Conversation,
} from '@/lib/api/messages'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/components/providers/auth-provider'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ChatViewProps {
  conversationId: string
}

import { ChatHeader, MessageList, MessageInput } from './chat-view/index'

export function ChatView({ conversationId }: ChatViewProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation(['messages', 'common'])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const [otherUserStatus, setOtherUserStatus] = useState<'online' | 'offline'>(
    'offline'
  )
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!user) return

    async function loadData() {
      if (!user) return
      try {
        // Fetch conversation details
        const { data: conv } = await messagesApi.getConversation(conversationId)
        if (conv) setConversation(conv)

        // Fetch messages
        const { data: msgs } = await messagesApi.getMessages(conversationId)
        if (msgs) setMessages(msgs)

        // Mark as read
        await messagesApi.markAsRead(conversationId, user.id)
      } catch (error) {
        console.error('Failed to load chat:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()

    // Realtime Subscription
    const channel = supabase
      .channel(`chat:${conversationId}`, {
        config: {
          presence: {
            key: user.id,
          },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((p) => p.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })

          // Mark as read if we are looking at the chat
          if (newMsg.sender_id !== user.id) {
            messagesApi.markAsRead(conversationId, user.id)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updated = payload.new as Message
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          )
        }
      )
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== user.id) {
          setIsOtherTyping(payload.isTyping)
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const otherUserId =
          conversation?.buyer_id === user.id
            ? conversation.seller_id
            : conversation?.buyer_id
        const isOnline = Object.values(state).some((presences: any) =>
          presences.some((p: any) => p.user_id === otherUserId)
        )
        setOtherUserStatus(isOnline ? 'online' : 'offline')
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          })
        }
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [
    conversationId,
    user,
    supabase,
    conversation?.buyer_id,
    conversation?.seller_id,
  ])

  useEffect(() => {
    // Scroll to bottom
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return

    setIsSending(true)
    try {
      const { data: sentMsg, error } = await messagesApi.sendMessage(
        conversationId,
        user.id,
        newMessage
      )

      if (error) throw error

      if (sentMsg) {
        setMessages((prev) => [...prev, sentMsg])
        setNewMessage('')
      }
    } catch {
      toast.error(t('messages:sendError'))
    } finally {
      setIsSending(false)
    }
  }

  const handleInputChange = (val: string) => {
    setNewMessage(val)
    // Typing Indicator logic
    if (!isSending && user && channelRef.current) {
      const userId = user.id
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId, isTyping: true },
      })

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId, isTyping: false },
        })
      }, 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">
        {t('messages:notFound')}
      </div>
    )
  }

  const otherUser =
    conversation.buyer_id === user?.id
      ? conversation.seller
      : conversation.buyer

  return (
    <div className="bg-background/30 flex h-full flex-col">
      <ChatHeader
        conversation={conversation}
        otherUserStatus={otherUserStatus}
        isOtherTyping={isOtherTyping}
        currentUserId={user?.id || ''}
      />

      <MessageList
        messages={messages}
        currentUserId={user?.id || ''}
        otherUser={otherUser}
        bottomRef={bottomRef}
      />

      <MessageInput
        value={newMessage}
        onChange={handleInputChange}
        onSend={handleSend}
        disabled={!user}
        isSending={isSending}
      />
    </div>
  )
}
