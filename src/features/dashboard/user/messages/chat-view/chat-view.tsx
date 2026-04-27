'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/auth-provider'
import {
  messagesApi,
  type Conversation,
  type Message,
} from '@/entities/message/api'
import { ChatHeader } from './chat-header'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/shared/lib/supabase/client'

interface ChatViewProps {
  conversationId: string
}

export function ChatView({ conversationId }: ChatViewProps) {
  const { user } = useAuth()
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Load initial data
  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        const [convRes, msgsRes] = await Promise.all([
          messagesApi.getConversation(supabase, conversationId),
          messagesApi.getMessages(supabase, conversationId),
        ])

        if (convRes.error || !convRes.data) {
          toast.error('Failed to load conversation')
          router.push('/dashboard/messages')
          return
        }

        if (msgsRes.error) {
          toast.error('Failed to load messages')
        }

        setConversation(convRes.data)
        setMessages(msgsRes.data || [])

        // Mark as read
        await messagesApi.markAsRead(supabase, conversationId, user.id)
      } catch (error) {
        console.error('Error loading chat:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [conversationId, user, router])

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return

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
        async (payload: any) => {
          const newMessage = payload.new as Message

          // Fetch sender details if needed, or just append
          // For now we'll just append and let the UI handle missing sender info until refresh
          // Ideally we'd fetch the complete message with relations

          setMessages((prev) => [...prev, newMessage])

          if (newMessage.sender_id !== user?.id) {
            await messagesApi.markAsRead(supabase, conversationId, user!.id)
          }

          // Scroll to bottom
          setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, user])

  // Scroll to bottom on load and new messages
  useEffect(() => {
    if (!isLoading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isLoading, messages.length])

  const handleSend = async () => {
    if (!user || !inputValue.trim() || isSending) return

    setIsSending(true)
    try {
      const { error } = await messagesApi.sendMessage(
        supabase,
        conversationId,
        user.id,
        inputValue
      )

      if (error) {
        toast.error('Failed to send message')
        return
      }

      setInputValue('')
      // Message will be added via subscription
    } catch {
      toast.error('Error sending message')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!conversation || !user) {
    return null
  }

  const otherUser =
    conversation.buyer_id === user.id ? conversation.seller : conversation.buyer

  // Simple online status simulation (should be real presence in future)
  const isOnline = 'offline'

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <ChatHeader
        conversation={conversation}
        currentUserId={user.id}
        otherUserStatus={isOnline}
        isOtherTyping={false}
      />

      <MessageList
        messages={messages}
        currentUserId={user.id}
        otherUser={otherUser}
        bottomRef={bottomRef}
      />

      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isLoading}
        isSending={isSending}
      />
    </div>
  )
}
