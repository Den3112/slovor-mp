'use client'

import { MessageSquarePlus } from 'lucide-react'

export default function MessagesPage() {
    return (
        <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground animate-in fade-in zoom-in-95 duration-500">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 shadow-xl shadow-primary/5">
                <MessageSquarePlus className="h-10 w-10 text-primary opacity-80" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-foreground mb-3">Select a conversation</h3>
            <p className="max-w-xs mx-auto text-base font-medium text-muted-foreground leading-relaxed">
                Choose a chat from the left to verify details, ask questions, or negotiate a deal.
            </p>
        </div>
    )
}
