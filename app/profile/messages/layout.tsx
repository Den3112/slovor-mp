'use client'

import { InboxLayout } from '@/components/messages/InboxLayout'

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <InboxLayout>{children}</InboxLayout>
}
