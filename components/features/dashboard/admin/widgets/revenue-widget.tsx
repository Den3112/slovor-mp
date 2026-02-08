'use client'

import { DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react'
import { HubWidget } from '@/components/features/dashboard/shared/hub-widget'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useTranslation } from '@/lib/i18n'

export function RevenueWidget() {
    const { t } = useTranslation(['admin'])

    // Mock Data
    const data = [
        { value: 4000 }, { value: 3000 }, { value: 5000 },
        { value: 2780 }, { value: 1890 }, { value: 6390 },
        { value: 3490 }, { value: 4000 }, { value: 3000 },
        { value: 5000 }, { value: 2780 }, { value: 1890 },
        { value: 6390 }, { value: 3490 }
    ]

    return (
        <HubWidget
            title={t('admin:revenue') || 'TOTAL REVENUE'}
            icon={DollarSign}
            colSpan={4}
            rowSpan={2}
            noPadding
            className="bg-emerald-950/20 border-emerald-500/20"
            action={{
                label: 'Details',
                icon: ArrowUpRight,
                onClick: () => { }
            }}
        >
            <div className="relative flex flex-col h-full justify-between p-6 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

                <div className="space-y-1 relative z-10">
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold tracking-tighter tabular-nums text-foreground">
                            €24,592.00
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-bold">+12.5%</span>
                        <span className="text-muted-foreground text-xs uppercase tracking-wider">vs last week</span>
                    </div>
                </div>

                <div className="h-[100px] w-full mt-auto -mx-6 -mb-6 opacity-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#revenueGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </HubWidget>
    )
}
