'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart3,
    TrendingUp,
    Users,
    ShoppingBag,
    Zap,
    Download,
    Calendar,
    ArrowUpRight,
    Layers,
    Map
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ActivityChart } from '@/app/[locale]/(main)/admin/components/activity-chart'

export function AdminAnalyticsView() {
    const { t } = useTranslation(['common', 'admin'])
    const [timeRange, setTimeRange] = useState('30d')

    // Mock data for analytics
    const growthStats = [
        { label: 'Conversion Rate', value: '4.2%', trend: '+0.8%', positive: true, icon: TrendingUp },
        { label: 'Avg Order Value', value: '€124', trend: '+12%', positive: true, icon: ShoppingBag },
        { label: 'Churn Rate', value: '2.1%', trend: '-0.3%', positive: true, icon: Users },
        { label: 'Session Duration', value: '5:24', trend: '-2%', positive: false, icon: Zap },
    ]

    const categoryPerformance = [
        { name: 'Vehicle & Parts', listings: 1240, growth: '+15%', color: 'bg-blue-500' },
        { name: 'Electronics', listings: 850, growth: '+8%', color: 'bg-emerald-500' },
        { name: 'Real Estate', listings: 620, growth: '+22%', color: 'bg-amber-500' },
        { name: 'Services', listings: 430, growth: '-2%', color: 'bg-rose-500' },
    ]

    const topRegions = [
        { name: 'North Region', share: 45, value: '€45k' },
        { name: 'South Region', share: 22, value: '€22k' },
        { name: 'East Region', share: 18, value: '€18k' },
        { name: 'West Region', share: 15, value: '€15k' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-primary" />
                        {t('admin:analytics') || 'Analytics Dashboard'}
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        Deep dive into marketplace performance and user behavior
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-muted/40 p-1 rounded-xl border border-border/40">
                    {['7d', '30d', '90d', '1y'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={cn(
                                "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg",
                                timeRange === range
                                    ? "bg-background text-primary shadow-sm border border-border/40"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-border/40 mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background transition-all">
                        <Download className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {growthStats.map((stat, idx) => (
                    <Card key={idx} className="border-border/60 shadow-sm p-6 flex flex-col justify-between rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/40">
                                <stat.icon className="h-4 w-4 text-primary" />
                            </div>
                            <Badge variant="outline" className={cn(
                                "text-[9px] font-black uppercase tracking-widest rounded-md py-0.5",
                                stat.positive ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"
                            )}>
                                {stat.trend}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                            <h3 className="text-2xl font-black tracking-tight mt-1">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Chart */}
                <Card className="lg:col-span-2 border-border/60 shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[400px]">
                    <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                User Traffic & Listings
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 flex-1">
                        <ActivityChart />
                    </CardContent>
                </Card>

                {/* Category Performance */}
                <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden flex flex-col">
                    <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary" />
                            Category Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {categoryPerformance.map((cat, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-foreground">{cat.name}</span>
                                    <span className="text-muted-foreground">{cat.listings.toLocaleString()} Items</span>
                                </div>
                                <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden border border-border/40">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat.listings / (categoryPerformance[0]?.listings || 1)) * 100}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className={cn("h-full rounded-full", cat.color)}
                                    />
                                </div>
                                <div className="flex items-center gap-1 text-[9px] font-bold text-success uppercase">
                                    <ArrowUpRight className="h-3 w-3" /> {cat.growth} Growth
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Geographical Distribution */}
                <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Map className="h-4 w-4 text-primary" />
                            Regional Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {topRegions.map((region, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-[10px] font-black border border-border/60 text-primary">
                                        {idx + 1}
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-tight">{region.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black">{region.value}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase">{region.share}% Share</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* System Efficiency */}
                <Card className="lg:col-span-2 border-border/60 shadow-sm rounded-xl overflow-hidden bg-slate-950 text-white border-none">
                    <CardHeader className="border-b border-white/5 bg-white/5 px-6 py-4">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-success" />
                            Platform Infrastructure Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">API Latency</span>
                                    <span className="text-3xl font-black text-white italic">24ms</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[85%] bg-success" />
                                </div>
                                <p className="text-[10px] font-bold text-success uppercase tracking-widest">Optimized</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Server Load</span>
                                    <span className="text-3xl font-black text-white italic">12.4%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[12%] bg-blue-400" />
                                </div>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Stable</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Error Rate</span>
                                    <span className="text-3xl font-black text-white italic">0.02%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[2%] bg-emerald-400" />
                                </div>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Normal</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
