'use client'

import { InboxLayout } from '@/components/messages/inbox-layout'

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
    return <InboxLayout>{children}</InboxLayout>
}
