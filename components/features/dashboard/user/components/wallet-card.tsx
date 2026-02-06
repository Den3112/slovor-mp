'use client'

import { CreditCard, Plus, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/lib/i18n'
import { formatPrice } from '@/lib/utils/formatting'
import Link from 'next/link'

interface WalletCardProps {
    balance: number
    currency: string
    onAddFunds?: () => void
}

export function WalletCard({ balance, currency, onAddFunds }: WalletCardProps) {
    const { t, locale } = useTranslation()

    return (
        <Card className="overflow-hidden border-border/80 bg-slate-950 text-white shadow-lg rounded-xl relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <CreditCard size={120} />
            </div>

            <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="bg-slate-900 p-2 rounded-lg border border-white/5">
                            <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ">
                            Slovor Wallet
                        </span>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {t('dashboard:walletDetails.availableBalance')}
                        </p>
                        <h2 className="text-4xl font-bold tracking-tighter ">
                            {formatPrice(balance, currency)}
                        </h2>
                    </div>
                </div>

                <div className="flex gap-3 pt-6">
                    <Button
                        size="sm"
                        onClick={onAddFunds}
                        className="bg-white text-slate-950 hover:bg-white/90 rounded-xl font-bold text-[10px] uppercase tracking-widest h-10 flex-1 px-4"
                    >
                        <Plus className="mr-2 h-3.5 w-3.5" />
                        {t('dashboard:walletDetails.addFunds')}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="bg-slate-900 border-white/10 hover:bg-slate-800 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest h-10 px-4"
                    >
                        <Link href={`/${locale}/dashboard/wallet`}>
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
