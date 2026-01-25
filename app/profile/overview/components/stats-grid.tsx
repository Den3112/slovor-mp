import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Package, BarChart3, Heart } from 'lucide-react'

interface StatsGridProps {
    activeListings: number
    totalViews: number
    favoritesCount: number
}

export function StatsGrid({
    activeListings,
    totalViews,
    favoritesCount,
}: StatsGridProps) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
            {/* Active Listings */}
            <Link href="/profile/my-listings" className="block">
                <Card className="hover:shadow-primary/10 group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl md:rounded-[2.5rem] md:p-6">
                    <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

                    <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
                        <div className="bg-primary/10 text-primary mb-3 rounded-xl p-3 shadow-inner md:mb-4 md:rounded-2xl md:p-4">
                            <Package className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <h3 className="text-foreground mb-0.5 text-3xl font-black tracking-tighter md:mb-1 md:text-5xl">
                            {activeListings}
                        </h3>
                        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase md:text-xs">
                            Active
                        </p>
                    </div>
                </Card>
            </Link>

            {/* Total Views */}
            <Link href="/profile/my-listings" className="block">
                <Card className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-emerald-500/10 md:rounded-[2.5rem] md:p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

                    <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
                        <div className="mb-3 rounded-xl bg-emerald-500/10 p-3 text-emerald-600 shadow-inner md:mb-4 md:rounded-2xl md:p-4">
                            <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <h3 className="text-foreground mb-0.5 text-3xl font-black tracking-tighter md:mb-1 md:text-5xl">
                            {totalViews}
                        </h3>
                        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase md:text-xs">
                            Views
                        </p>
                    </div>
                </Card>
            </Link>

            {/* Favorites */}
            <Link href="/profile/favorites" className="col-span-2 block md:col-span-1">
                <Card className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-rose-500/10 md:rounded-[2.5rem] md:p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

                    <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
                        <div className="mb-3 rounded-xl bg-rose-500/10 p-3 text-rose-600 shadow-inner md:mb-4 md:rounded-2xl md:p-4">
                            <Heart className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <h3 className="text-foreground mb-0.5 text-3xl font-black tracking-tighter md:mb-1 md:text-5xl">
                            {favoritesCount}
                        </h3>
                        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase md:text-xs">
                            Favorites
                        </p>
                    </div>
                </Card>
            </Link>
        </div>
    )
}
