'use client'

import { Zap, TrendingUp, Users, Target } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { PremiumBackground } from '@/components/ui/premium-background'
import { BentoGrid, BentoTile } from '@/components/ui/bento'
import { cn } from '@/lib/utils'

export function MarketInsightsView() {
    const { t } = useTranslation(['dashboard', 'common'])

    const stats = [
        {
            icon: TrendingUp,
            title: t('dashboard:totalViews'),
            value: '1.2k',
            trend: '+12%',
            color: 'text-emerald-500',
        },
        {
            icon: Users,
            title: t('dashboard:successScore'),
            value: '98/100',
            trend: '+2%',
            color: 'text-blue-500',
        },
        {
            icon: Target,
            title: t('dashboard:topPercentile').replace('{{percentile}}', '5'),
            value: 'Top 5%',
            color: 'text-purple-500',
        },
        {
            icon: Zap,
            title: t('dashboard:reachProLevel'),
            value: 'Active',
            color: 'text-primary',
        },
    ]

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
            <PremiumBackground variant="mesh" />

            <div className="relative z-10 px-6">
                <h1 className="text-foreground flex items-center gap-3 text-3xl font-bold tracking-tight uppercase">
                    <Zap className="text-primary h-8 w-8" />
                    {t('dashboard:marketInsights')}
                </h1>
                <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                    {t('dashboard:personalizedRecommendations')}
                </p>
            </div>

            <BentoGrid className="px-6">
                {stats.map((stat, idx) => (
                    <BentoTile key={idx} colSpan={3} delay={idx * 0.1}>
                        <div className="flex flex-col justify-between p-6 h-full">
                            <div className="flex items-center justify-between">
                                <div className={cn("bg-card/50 flex h-10 w-10 items-center justify-center rounded-xl border border-border/10 shadow-sm", stat.color)}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                {stat.trend && (
                                    <span className="text-emerald-500 text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <div className="mt-4">
                                <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase opacity-70">
                                    {stat.title}
                                </p>
                                <h3 className="text-2xl font-bold tracking-tight mt-1">
                                    {stat.value}
                                </h3>
                            </div>
                        </div>
                    </BentoTile>
                ))}

                <BentoTile colSpan={12} className="relative overflow-hidden min-h-[400px]">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                    <div className="relative z-10 flex h-full items-center justify-center p-8">
                        <div className="text-center space-y-6 max-w-2xl">
                            <div className="bg-primary/20 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl shadow-2xl shadow-primary/20 backdrop-blur-xl border border-primary/20">
                                <Zap className="text-primary h-10 w-10 animate-pulse" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold tracking-tight">{t('dashboard:smartNudges')}</h2>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {t('dashboard:performanceGood')}
                                </p>
                            </div>
                            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-card/30 border border-border/10 rounded-xl p-4 backdrop-blur-sm">
                                    <p className="text-primary text-xl font-bold">2.4x</p>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Faster Sales</p>
                                </div>
                                <div className="bg-card/30 border border-border/10 rounded-xl p-4 backdrop-blur-sm">
                                    <p className="text-blue-500 text-xl font-bold">+12%</p>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Growth</p>
                                </div>
                                <div className="bg-card/30 border border-border/10 rounded-xl p-4 backdrop-blur-sm">
                                    <p className="text-purple-500 text-xl font-bold">98%</p>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Score</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </BentoTile>
            </BentoGrid>
        </div>
    )
}
