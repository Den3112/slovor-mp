import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { ChatHeaderProps } from './types'

export function ChatHeader({
  conversation,
  otherUserStatus,
  isOtherTyping,
  currentUserId,
}: ChatHeaderProps) {
  const { t, locale } = useTranslation(['messages'])
  const otherUser =
    conversation.buyer_id === currentUserId
      ? conversation.seller
      : conversation.buyer
  const listing = conversation.listing

  return (
    <div className="border-border/60 bg-background sticky top-0 z-10 flex flex-none items-center justify-between border-b p-3">
      <div className="flex items-center gap-3">
        <Link href={`/${locale}/dashboard/messages`} className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted -ml-2 h-8 w-8 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="group relative cursor-pointer">
          <Avatar className="border-border/50 group-hover:ring-primary/10 h-10 w-10 rounded-xl border ring-2 ring-transparent transition-all">
            <AvatarImage src={otherUser?.avatar_url || ''} />
            <AvatarFallback className="bg-muted text-muted-foreground rounded-xl">
              {otherUser?.display_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          {otherUserStatus === 'online' && (
            <span className="bg-success ring-background absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border border-white/20 ring-2" />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm leading-none font-bold tracking-tight">
              {otherUser?.display_name || t('messages:unknownUser')}
            </h3>
            {otherUser?.is_verified && (
              <ShieldCheck className="text-primary fill-primary/10 h-3.5 w-3.5" />
            )}
          </div>
          <p className="text-muted-foreground mt-0.5 text-[10px] font-bold tracking-widest uppercase">
            {isOtherTyping ? (
              <span className="text-primary animate-pulse">
                {t('messages:typing')}
              </span>
            ) : otherUserStatus === 'online' ? (
              <span className="text-success">{t('messages:online')}</span>
            ) : (
              t('messages:offline')
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {listing && (
          <Link
            href={`/${locale}/listings/${listing.id}`}
            className="border-border/50 bg-card hover:bg-muted/50 hover:border-primary/20 group hidden items-center gap-3 rounded-xl border p-1.5 pr-3 transition-all md:flex"
          >
            <div className="bg-muted relative h-8 w-8 shrink-0 overflow-hidden rounded">
              {listing.images?.[0] ? (
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  sizes="32px"
                  className="object-cover transition-transform group-hover:scale-110"
                  unoptimized
                />
              ) : (
                <div className="bg-muted h-full w-full" />
              )}
            </div>
            <div className="flex min-w-[80px] flex-col">
              <p className="max-w-[120px] truncate text-[10px] leading-tight font-bold">
                {listing.title}
              </p>
              <span className="text-primary text-[9px] font-bold">
                {listing.price} {listing.currency}
              </span>
            </div>
          </Link>
        )}

        {/* Hidden until implemented
        <div className="border-border/50 ml-2 flex items-center gap-1 border-l pl-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-xl"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-xl"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-xl"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        */}
      </div>
    </div>
  )
}
