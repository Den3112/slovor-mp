import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Package, BarChart3, Heart } from 'lucide-react'

interface StatsGridProps {
    activeListings: number
    totalViews: number
    favoritesCount: number
}

export function StatsGrid({ activeListings, totalViews, favoritesCount }: StatsGridProps) {
    return (
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
    )
}
