

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Package, Heart, BarChart3, ArrowRight, MessageCircle } from 'lucide-react'
import { getTranslationServer } from '@/lib/i18n/server'
import { listingsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

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
                <Card className="relative overflow-hidden p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10 group">
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

                {/* Total Views */}
                <Card className="relative overflow-hidden p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-emerald-500/10 group">
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

                {/* Favorites */}
                <Card className="col-span-2 md:col-span-1 relative overflow-hidden p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-rose-500/10 group">
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
            </div>

            {/* Quick Actions / Recent */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
                {/* Recent Listings */}
                <Card className="flex flex-col p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl h-full ml-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                        <div>
                            <h2 className="font-heading text-xl md:text-2xl font-black tracking-tight">Recent Listings</h2>
                            <p className="text-xs md:text-sm text-muted-foreground font-medium">Your latest activity</p>
                        </div>
                        <Link href="/profile/my-listings" className="group self-start sm:self-center flex items-center gap-2 text-xs md:text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-xl">
                            View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        {userListings.data && userListings.data.length > 0 ? (
                            <div className="space-y-3 md:space-y-4">
                                {userListings.data.slice(0, 3).map(listing => (
                                    <Link href={`/listings/${listing.id}`} key={listing.id} className="relative z-10 w-full flex items-center gap-3 md:gap-5 p-3 md:p-4 rounded-2xl md:rounded-[1.25rem] bg-background/40 border border-white/5 hover:bg-background/60 hover:border-primary/20 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                        <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-muted overflow-hidden flex-shrink-0 relative shadow-inner">
                                            {listing.images?.[0] ? (
                                                <Image
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-primary/5 text-primary/40">
                                                    <Package className="h-5 w-5 md:h-6 md:w-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm md:text-lg truncate text-foreground group-hover:text-primary transition-colors">{listing.title}</h4>
                                            <p className="text-xs md:text-sm text-muted-foreground font-medium">{listing.price} {listing.currency}</p>
                                        </div>
                                        <div className={cn(
                                            "hidden sm:block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm",
                                            listing.is_active
                                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                : 'bg-muted text-muted-foreground border border-border/50'
                                        )}>
                                            {listing.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                    </Link>
                                ))}
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

                {/* Messages Coming Soon */}
                <Card className="flex flex-col p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-primary/5 via-background/60 to-background/60 backdrop-blur-xl justify-center items-center text-center relative overflow-hidden shadow-xl min-h-[300px] md:min-h-auto h-full">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light pointer-events-none" />
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <MessageCircle className="h-24 w-24 md:h-32 md:w-32 text-primary rotate-12" />
                    </div>

                    <div className="bg-background/80 p-5 md:p-6 rounded-3xl md:rounded-[2rem] shadow-2xl mb-6 md:mb-8 relative z-10 border border-white/20">
                        <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl font-black mb-3 relative z-10 tracking-tight">Inbox</h3>
                    <p className="text-muted-foreground text-sm mb-6 md:mb-8 max-w-xs relative z-10 font-medium leading-relaxed">
                        Your conversations with buyers and sellers will appear here.
                    </p>
                    <Button variant="outline" className="rounded-2xl border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 relative z-10 font-bold h-10 md:h-12 px-6 md:px-8" disabled>
                        Coming Soon
                    </Button>
                </Card>
            </div>
        </div>
    )
}
