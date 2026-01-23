'use client'

import { MessageSquarePlus } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div className="text-muted-foreground animate-in fade-in zoom-in-95 hidden h-full flex-col items-center justify-center p-8 text-center duration-500 md:flex">
      <div className="from-primary/10 to-primary/5 shadow-primary/5 mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br shadow-xl">
        <MessageSquarePlus className="text-primary h-10 w-10 opacity-80" />
      </div>
      <h3 className="text-foreground mb-3 text-2xl font-black tracking-tight">
        Select a conversation
      </h3>
      <p className="text-muted-foreground mx-auto max-w-xs text-base leading-relaxed font-medium">
        Choose a chat from the left to verify details, ask questions, or
        negotiate a deal.
      </p>
    </div>
  )
}
