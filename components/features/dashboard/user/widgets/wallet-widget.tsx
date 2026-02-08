'use client'

import { CreditCard, Plus, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils/formatting'
import Link from 'next/link'
import { HubWidget } from '@/components/features/dashboard/shared/hub-widget'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

interface WalletWidgetProps {
    balance: number
    currency: string
    history?: { date: string; value: number }[]
}

// Mock data generator if no history provided
const generateMockHistory = (baseValue: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
        date: `Day ${i + 1}`,
        value: baseValue * (0.8 + Math.random() * 0.4),
    }))
}

export function WalletWidget({ balance, currency, history }: WalletWidgetProps) {
    const { t, locale } = useTranslation(['dashboard', 'profile'])
    const chartData = history || generateMockHistory(balance)

    return (
        <HubWidget
            title={t('profile:wallet')}
            icon={CreditCard}
            colSpan={4}
            rowSpan={2}
            noPadding
            action={{
                label: t('dashboard:walletDetails.addFunds'),
                icon: Plus,
                onClick: () => window.location.href = `/${locale}/dashboard/wallet`,
            }}
            className="bg-slate-950 text-white border-slate-800"
        >
            <div className="flex flex-col h-full justify-between p-6 relative z-10">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        {t('dashboard:walletDetails.availableBalance')}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold tracking-tighter tabular-nums">
                            {formatPrice(balance, currency)}
                        </h2>
                    </div>
                </div>

                {/* Mini Chart */}
                <div className="h-[60px] w-full mt-4 -mx-2 opacity-50">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fff" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#fff"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        **** 4242
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0 rounded-full hover:bg-white/10 hover:text-white"
                    >
                        <Link href={`/${locale}/dashboard/wallet`}>
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <CreditCard size={120} />
            </div>
        </HubWidget>
    )
}
