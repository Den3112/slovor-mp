

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Package, Heart, BarChart3, ArrowRight, MessageCircle } from 'lucide-react'
import { getTranslationServer } from '@/lib/i18n/server'
import { listingsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

export default async function DashboardOverviewPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null // Layout handles redirect
    }

    const { t } = await getTranslationServer()
    const userListings = await listingsApi.getByUser(user.id)
    const activeListings = userListings.data?.filter(l => l.is_active).length || 0
    const totalViews = userListings.data?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0

    // Mock data for favorites until API exists
    const favoritesCount = 0

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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <Card className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-border/50 bg-gradient-to-br from-card to-muted/30 hover:to-primary/5 transition-colors group">
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                        <div className="p-3 md:mb-4 rounded-xl md:rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                            <Package className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div className="space-y-0.5 md:space-y-1">
                            <h3 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
                                {activeListings}
                            </h3>
                            <p className="font-bold text-muted-foreground text-xs md:text-sm uppercase tracking-wide">
                                Active Listings
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-border/50 bg-gradient-to-br from-card to-muted/30 hover:to-primary/5 transition-colors group">
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                        <div className="p-3 md:mb-4 rounded-xl md:rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                            <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div className="space-y-0.5 md:space-y-1">
                            <h3 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
                                {totalViews}
                            </h3>
                            <p className="font-bold text-muted-foreground text-xs md:text-sm uppercase tracking-wide">
                                Total Views
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-border/50 bg-gradient-to-br from-card to-muted/30 hover:to-primary/5 transition-colors group">
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                        <div className="p-3 md:mb-4 rounded-xl md:rounded-2xl bg-rose-500/10 text-rose-600 group-hover:scale-110 transition-transform">
                            <Heart className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div className="space-y-0.5 md:space-y-1">
                            <h3 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
                                {favoritesCount}
                            </h3>
                            <p className="font-bold text-muted-foreground text-xs md:text-sm uppercase tracking-wide">
                                Favorites
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions / Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading text-xl font-bold">Recent Listings</h2>
                        <Link href="/dashboard/listings" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    {userListings.data && userListings.data.length > 0 ? (
                        <div className="space-y-4">
                            {userListings.data.slice(0, 3).map(listing => (
                                <div key={listing.id} className="flex items-center gap-4 p-4 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-colors group">
                                    <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden flex-shrink-0 relative">
                                        {listing.images?.[0] ? (
                                            <div className="relative h-full w-full">
                                                {/* Note: Using simple img for now as remote patterns might not be set up for arbitrary user blobs,
                                                   but cleanly styled. Ideally use next/image with domains configured. */}
                                                <Image
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-110"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-primary/5 text-primary/40">
                                                <Package className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold truncate text-foreground group-hover:text-primary transition-colors">{listing.title}</h4>
                                        <p className="text-sm text-muted-foreground font-medium">{listing.price} {listing.currency}</p>
                                    </div>
                                    <div className={cn(
                                        "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                                        listing.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                                    )}>
                                        {listing.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                                <Plus className="h-8 w-8 text-primary/40" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">No listings yet</h3>
                            <p className="text-muted-foreground text-sm mb-6 max-w-[200px]">
                                Start selling today and reach thousands of buyers.
                            </p>
                            <Button asChild size="lg" className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20">
                                <Link href="/post">
                                    Create Listing
                                </Link>
                            </Button>
                        </div>
                    )}
                </Card>

                <Card className="p-8 rounded-[2.5rem] border-border/50 bg-gradient-to-br from-primary/5 to-transparent flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
                    <div className="bg-background p-4 rounded-full shadow-lg mb-6 relative z-10">
                        <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-bold mb-2 relative z-10">My Messages</h3>
                    <p className="text-muted-foreground mb-8 max-w-xs relative z-10 font-medium">
                        Your conversations with buyers and sellers will appear here.
                    </p>
                    <Button variant="outline" className="rounded-xl border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 relative z-10 font-bold" disabled>
                        Coming Soon
                    </Button>
                </Card>
            </div>
        </div>
    )
}
