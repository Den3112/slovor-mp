'use client'

import { ChatView } from '@/components/messages/ChatView'
import { useParams } from 'next/navigation'

export default function MessagePage() {
  const params = useParams()
  return <ChatView conversationId={params.id as string} />
}
