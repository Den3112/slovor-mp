'use client'

import { useState, useEffect } from 'react'
import { messagesApi } from '@/lib/api/messages'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'

export function useUnreadMessages() {
    const { user } = useAuth()
    const [unreadCount, setUnreadCount] = useState(0)
    const supabase = createClient()

    useEffect(() => {
        if (!user) return

        const fetchCount = async () => {
            const { data } = await messagesApi.getUnreadCount(user.id)
            if (data !== null) setUnreadCount(data)
        }

        fetchCount()

        // Subscribe to NEW messages to update count
        const channel = supabase
            .channel('unread-messages-count')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                },
                () => {
                    fetchCount()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, supabase])

    return unreadCount
}
