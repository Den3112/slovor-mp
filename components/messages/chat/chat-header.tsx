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
  const otherUser =
    conversation.buyer_id === userId ? conversation.seller : conversation.buyer
  const listing = conversation.listing

  return (
    <div className="bg-background/40 z-20 flex items-center justify-between border-b border-white/5 p-4 backdrop-blur-xl md:p-6">
      <div className="flex items-center gap-4">
        <Link href="/profile/messages" className="md:hidden">
          <Button variant="ghost" size="icon" className="-ml-3 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="relative">
          <Avatar className="border-background h-12 w-12 border-2 shadow-lg">
            <AvatarImage src={otherUser?.avatar_url || ''} />
            <AvatarFallback>
              {otherUser?.display_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="border-background absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 bg-green-500" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg leading-none font-bold tracking-tight">
              {otherUser?.display_name || 'User'}
            </h3>
            <ShieldCheck className="text-primary fill-primary/10 h-4 w-4" />
          </div>
          {listing && (
            <Link
              href={`/listings/${listing.id}`}
              className="text-muted-foreground/80 hover:text-primary mt-1 flex items-center gap-1.5 text-xs font-medium transition-colors"
            >
              <span className="h-1 w-1 rounded-full bg-current" />
              {listing.title}
              <span className="opacity-50">•</span>
              <span className="text-foreground font-bold">
                {listing.price} €
              </span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hidden rounded-full hover:bg-white/10 md:flex"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/10"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
