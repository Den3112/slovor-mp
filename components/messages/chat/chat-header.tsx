import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Phone, ArrowLeft, MoreVertical, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import type { Conversation } from '@/lib/api/messages'

interface ChatHeaderProps {
    conversation: Conversation
    userId?: string
}

export function ChatHeader({ conversation, userId }: ChatHeaderProps) {
    const otherUser = conversation.buyer_id === userId ? conversation.seller : conversation.buyer
    const listing = conversation.listing

    return (
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/5 bg-background/40 backdrop-blur-xl z-20">
            <div className="flex items-center gap-4">
                <Link href="/profile/messages" className="md:hidden">
                    <Button variant="ghost" size="icon" className="-ml-3 rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>

                <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-lg">
                        <AvatarImage src={otherUser?.avatar_url || ''} />
                        <AvatarFallback>{otherUser?.display_name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg leading-none tracking-tight">{otherUser?.display_name || 'User'}</h3>
                        <ShieldCheck className="h-4 w-4 text-primary fill-primary/10" />
                    </div>
                    {listing && (
                        <Link href={`/listings/${listing.id}`} className="text-xs font-medium text-muted-foreground/80 hover:text-primary transition-colors flex items-center gap-1.5 mt-1">
                            <span className="w-1 h-1 rounded-full bg-current" />
                            {listing.title}
                            <span className="opacity-50">•</span>
                            <span className="font-bold text-foreground">{listing.price} €</span>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hidden md:flex">
                    <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
