

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getTranslationServer } from '@/lib/i18n/server'
import { ListingRowActions } from '@/components/profile/listing-row-actions'
import { listingsApi } from '@/lib/api'
import { Package, BarChart3, Heart, MessageCircle, Plus, ArrowRight } from 'lucide-react'

import { getDashboardStats } from '@/lib/api/dashboard-stats'

export default async function DashboardOverviewPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null // Layout handles redirect
    }

    const { t } = await getTranslationServer()

    // Fetch stats using the new API
    const stats = await getDashboardStats(user.id)

    // Fetch listings for the "Recent Listings" list
    const userListings = await listingsApi.getByUser(user.id)

    const activeListings = stats.activeListings
    const totalViews = stats.totalViews
    const favoritesCount = stats.favorites

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        {t.common.home}
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Welcome back, {user.user_metadata.full_name || user.email?.split('@')[0]}!
                    </p>
                </div>

            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
                {/* Active Listings */}
                <Link href="/profile/my-listings" className="block">
                    <Card className="h-full relative overflow-hidden p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div className="mb-3 md:mb-4 rounded-xl md:rounded-2xl bg-primary/10 p-3 md:p-4 text-primary shadow-inner">
                                <Package className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-0.5 md:mb-1">
                                {activeListings}
                            </h3>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Active
                            </p>
                        </div>
                    </Card>
                </Link>

                {/* Total Views */}
                <Link href="/profile/my-listings" className="block">
                    <Card className="h-full relative overflow-hidden p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-emerald-500/10 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div className="mb-3 md:mb-4 rounded-xl md:rounded-2xl bg-emerald-500/10 p-3 md:p-4 text-emerald-600 shadow-inner">
                                <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-0.5 md:mb-1">
                                {totalViews}
                            </h3>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Views
                            </p>
                        </div>
                    </Card>
                </Link>

                {/* Favorites */}
                <Link href="/profile/favorites" className="block col-span-2 md:col-span-1">
                    <Card className="h-full relative overflow-hidden p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-rose-500/10 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div className="mb-3 md:mb-4 rounded-xl md:rounded-2xl bg-rose-500/10 p-3 md:p-4 text-rose-600 shadow-inner">
                                <Heart className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-0.5 md:mb-1">
                                {favoritesCount}
                            </h3>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Favorites
                            </p>
                        </div>
                    </Card>
                </Link>
            </div>

            {/* Quick Actions / Recent */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
                {/* Recent Listings */}
                <Card className="flex flex-col p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl h-full ml-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                        <div>
                            <h2 className="font-heading text-xl md:text-2xl font-black tracking-tight">Recent Listings</h2>
                            <p className="text-xs md:text-sm text-muted-foreground font-medium">Your latest activity</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center relative z-10">
                        {userListings.data && userListings.data.length > 0 ? (
                            <div className="flex-1 flex flex-col gap-3">
                                <div className="space-y-3">
                                    {userListings.data.slice(0, 3).map(listing => (
                                        <div key={listing.id} className="relative z-10 w-full flex items-center gap-3 md:gap-4 p-3 md:p-3 rounded-2xl md:rounded-[1.25rem] bg-background/40 border border-white/5 hover:bg-background/60 hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
                                            {/* Clickable Area */}
                                            <Link href={`/listings/${listing.id}`} className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 group/link">
                                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-muted overflow-hidden flex-shrink-0 relative shadow-inner">
                                                    {listing.images?.[0] ? (
                                                        <Image
                                                            src={listing.images[0]}
                                                            alt={listing.title}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover/link:scale-110"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center bg-primary/5 text-primary/40">
                                                            <Package className="h-4 w-4 md:h-5 md:w-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm md:text-base truncate text-foreground group-hover/link:text-primary transition-colors mb-0.5">{listing.title}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs text-muted-foreground font-medium">{listing.price} {listing.currency}</p>
                                                        <span className={cn(
                                                            "px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border shadow-sm",
                                                            listing.is_active
                                                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                                : 'bg-muted text-muted-foreground border-border/50'
                                                        )}>
                                                            {listing.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Actions */}
                                            <ListingRowActions listing={listing} />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto pt-4 flex justify-center">
                                    <Link href="/profile/my-listings" className="group/btn text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5">
                                        View All Listings
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center h-full min-h-[200px]">
                                <div className="h-16 w-16 mobile:h-20 mobile:w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 animate-pulse">
                                    <Plus className="h-8 w-8 md:h-10 md:w-10 text-primary/40" />
                                </div>
                                <h3 className="text-lg md:text-xl font-black mb-2">No listings yet</h3>
                                <p className="text-muted-foreground text-xs md:text-sm mb-6 md:mb-8 max-w-[220px] font-medium leading-relaxed">
                                    Start selling today and reach thousands of buyers.
                                </p>
                                <Button asChild size="lg" className="rounded-2xl font-bold px-6 md:px-8 py-5 md:py-6 text-sm md:text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all">
                                    <Link href="/post">
                                        Create Listing
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Messages Card - Dynamic List */}
                <Card className="flex flex-col p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/5 via-background/60 to-background/60 backdrop-blur-xl shadow-xl h-full group transition-all duration-300 hover:shadow-2xl min-h-[300px] md:min-h-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light pointer-events-none" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-3">
                                <Link href="/profile/messages" className="font-heading text-xl md:text-2xl font-black tracking-tight hover:text-primary transition-colors flex items-center gap-2">
                                    Inbox
                                </Link>
                                {stats.messages > 0 && (
                                    <span className="flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-primary/20 animate-pulse">
                                        {stats.messages} New
                                    </span>
                                )}
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground font-medium">Recent conversations</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col relative z-10">
                        {stats.recentConversations && stats.recentConversations.length > 0 ? (
                            <div className="flex-1 flex flex-col gap-3">
                                <div className="space-y-3">
                                    {stats.recentConversations.map((conv) => {
                                        const otherUser = conv.buyer_id === user.id ? conv.seller : conv.buyer
                                        const isUnread = conv.last_message && !conv.last_message.is_read && conv.last_message.sender_id !== user.id

                                        return (
                                            <Link href={`/profile/messages/${conv.id}`} key={conv.id} className={cn(
                                                "relative w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl md:rounded-[1.25rem] border transition-all duration-300 group/item cursor-pointer",
                                                isUnread
                                                    ? "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 shadow-sm"
                                                    : "bg-background/40 border-white/5 hover:bg-background/60 hover:border-primary/10"
                                            )}>
                                                <div className="relative">
                                                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-muted overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                                                        {otherUser?.avatar_url ? (
                                                            <Image src={otherUser.avatar_url} alt={otherUser.display_name || 'User'} fill className="object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                                                                {otherUser?.display_name?.[0] || 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isUnread && (
                                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full ring-2 ring-background" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0 text-left">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <h4 className={cn("font-bold text-sm truncate pr-2 group-hover/item:text-primary transition-colors", isUnread ? "text-foreground" : "text-muted-foreground")}>
                                                            {otherUser?.display_name || 'User'}
                                                        </h4>
                                                        <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap font-medium">
                                                            {conv.last_message?.created_at ? new Date(conv.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </span>
                                                    </div>
                                                    <p className={cn("text-xs truncate transition-colors", isUnread ? "font-semibold text-foreground/90" : "font-medium text-muted-foreground/70")}>
                                                        {conv.last_message?.content || 'Started a conversation'}
                                                    </p>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                                <div className="mt-auto pt-4 flex justify-center">
                                    <Link href="/profile/messages" className="group/btn text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5">
                                        View All Messages
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                                <div className="h-16 w-16 mobile:h-20 mobile:w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                                    <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-base font-bold mb-1">No messages yet</h3>
                                <p className="text-muted-foreground text-xs max-w-[180px] mb-6">
                                    Start chatting with buyers and sellers.
                                </p>
                                <Button asChild variant="outline" size="sm" className="rounded-full px-6 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary font-bold">
                                    <Link href="/profile/messages">
                                        Open Inbox
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
