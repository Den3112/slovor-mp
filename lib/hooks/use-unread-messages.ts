'use client'

import { useState, useEffect } from 'react'
import { messagesApi } from '@/lib/api/messages'
import { useAuth } from '@/components/providers/auth-provider'
import { supabase } from '@/lib/supabase/client'

export function useUnreadMessages() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchCount = async () => {
      const { data } = await messagesApi.getUnreadCount(user.id)
      if (data !== null) setUnreadCount(data)
    }

    fetchCount()

    // Subscribe to NEW messages where current user is the receiver
    const channel = supabase
      .channel(`unread-messages:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          fetchCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return unreadCount
}
