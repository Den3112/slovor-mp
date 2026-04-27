'use client'

import { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import { MessageInput } from '@/shared/lib/validations/chat'

export function useChat(conversationId: string, currentUserId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [otherUserTyping, setOtherUserTyping] = useState(false)

  // Fetch initial messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    },
    enabled: !!conversationId,
  })

  const markAsRead = useCallback(async () => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', currentUserId)
      .eq('is_read', false)
  }, [conversationId, currentUserId, supabase])

  // Real-time subscription
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
        (payload: any) => {
          queryClient.setQueryData(['messages', conversationId], (old: any) => {
            const exists = old?.find((m: any) => m.id === payload.new.id)
            if (exists) return old
            return [...(old || []), payload.new]
          })

          // Auto mark as read if message is from other user
          if (payload.new.sender_id !== currentUserId) {
            markAsRead()
          }
        }
      )
      .on('broadcast', { event: 'typing' }, ({ payload }: { payload: any }) => {
        if (payload.userId !== currentUserId) {
          setOtherUserTyping(payload.typing)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, currentUserId, queryClient, supabase, markAsRead])

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (input: MessageInput) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: input.content,
          attachments: input.attachments || [],
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ['messages', conversationId],
      })
      const previousMessages = queryClient.getQueryData([
        'messages',
        conversationId,
      ])

      const optimisticMsg = {
        id: Math.random().toString(),
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: newMessage.content,
        created_at: new Date().toISOString(),
        is_read: false,
        optimistic: true,
      }

      queryClient.setQueryData(['messages', conversationId], (old: any) => [
        ...(old || []),
        optimisticMsg,
      ])

      return { previousMessages }
    },
    onError: (_err, _newMessage, context) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        context?.previousMessages
      )
    },
    onSuccess: () => {
      // Update last_message_at in conversation
      supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
        .then()
    },
  })

  const sendTypingStatus = useCallback(
    (typing: boolean) => {
      supabase.channel(`chat:${conversationId}`).send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: currentUserId, typing },
      })
    },
    [conversationId, currentUserId, supabase]
  )

  return {
    messages,
    isLoading,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    otherUserTyping,
    sendTypingStatus,
    markAsRead,
  }
}
export * from './use-unread-messages'
