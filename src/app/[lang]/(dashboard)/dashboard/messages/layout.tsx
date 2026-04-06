'use client'

import { MessagesLayout } from '@/features/dashboard/user/messages/messages-layout'

export default function MessagesLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return <MessagesLayout>{children}</MessagesLayout>
}
