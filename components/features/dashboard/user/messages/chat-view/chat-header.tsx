import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Phone, Video, MoreVertical } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { ChatHeaderProps } from './types';

export function ChatHeader({ conversation, otherUserStatus, isOtherTyping, currentUserId }: ChatHeaderProps) {
    const { t, locale } = useTranslation(['messages']);
    const otherUser = conversation.buyer_id === currentUserId ? conversation.seller : conversation.buyer;
    const listing = conversation.listing;

    return (
        <div className="flex-none flex items-center justify-between border-b border-border/60 p-3 bg-background/80 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-3">
                <Link href={`/${locale}/messages`} className="lg:hidden">
                    <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 rounded-lg hover:bg-muted">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>

                <div className="relative group cursor-pointer">
                    <Avatar className="h-10 w-10 rounded-lg border border-border/50 ring-2 ring-transparent group-hover:ring-primary/10 transition-all">
                        <AvatarImage src={otherUser?.avatar_url || ''} />
                        <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">{otherUser?.display_name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    {otherUserStatus === 'online' && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-background border border-white/20" />
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm leading-none tracking-tight">{otherUser?.display_name || 'User'}</h3>
                        {otherUser?.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-primary fill-primary/10" />}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                        {isOtherTyping ? (
                            <span className="text-primary animate-pulse">{t('messages:typing')}</span>
                        ) : (
                            otherUserStatus === 'online' ? <span className="text-success">Online</span> : 'Offline'
                        )}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {listing && (
                    <Link href={`/${locale}/listings/${listing.id}`} className="hidden md:flex items-center gap-3 rounded-lg border border-border/50 bg-card p-1.5 pr-3 hover:bg-muted/50 hover:border-primary/20 transition-all group">
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-muted">
                            {listing.images?.[0] ? (
                                <Image src={listing.images[0]} alt={listing.title} fill sizes="32px" className="object-cover transition-transform group-hover:scale-110" unoptimized />
                            ) : (
                                <div className="h-full w-full bg-muted" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-[80px]">
                            <p className="text-[10px] font-bold truncate max-w-[120px] leading-tight">{listing.title}</p>
                            <span className="text-[9px] font-bold text-primary">{listing.price} {listing.currency}</span>
                        </div>
                    </Link>
                )}

                <div className="flex items-center gap-1 border-l border-border/50 pl-2 ml-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
