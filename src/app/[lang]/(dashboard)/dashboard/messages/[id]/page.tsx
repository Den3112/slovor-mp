'use client'

import { ChatView } from '@/features/dashboard/user/messages/chat-view'
import { useParams } from 'next/navigation'

export default function MessagesPage() {
  const { id } = useParams()
  return <ChatView conversationId={id as string} />
}
