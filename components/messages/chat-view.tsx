'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  messagesApi,
  type Message,
  type Conversation,
} from '@/lib/api/messages'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'sonner'
import { ChatHeader } from './chat/chat-header'
import { ChatMessages } from './chat/chat-messages'
import { ChatInput } from './chat/chat-input'

interface ChatViewProps {
  conversationId: string
}

export function ChatView({ conversationId }: ChatViewProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
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
      .channel(`chat:${conversationId}`)
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
            // Dedup
            if (prev.some((p) => p.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, user, supabase])

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
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">
        <span className="animate-pulse">Loading conversation...</span>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">
        Conversation not found
      </div>
    )
  }

  const otherUser =
    conversation.buyer_id === user?.id
      ? conversation.seller
      : conversation.buyer

  return (
    <div className="flex h-full flex-col bg-transparent">
      <ChatHeader conversation={conversation} userId={user?.id} />

      <ChatMessages
        messages={messages}
        userId={user?.id}
        otherUserName={otherUser?.display_name || 'User'}
        bottomRef={bottomRef}
      />

      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
        isSending={isSending}
      />
    </div>
  )
}
