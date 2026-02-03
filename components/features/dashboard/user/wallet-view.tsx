'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { transactionsApi } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import type { Transaction } from '@/lib/types/database'
import {
    ArrowDownLeft,
    Plus,
    Zap,
    Star,
    Loader2,
    Calendar,
    CreditCard as CreditCardIcon,
    ShoppingBag,
    History,
    TrendingUp,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { useCurrency } from '@/components/providers/currency-provider'
import { formatPrice } from '@/lib/utils/formatting'

export function WalletView() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const { currency } = useCurrency()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefilling, setIsRefilling] = useState(false)
    const [showRefillModal, setShowRefillModal] = useState(false)
    const [refillAmount, setRefillAmount] = useState('50')
    const [selectedMethod, setSelectedMethod] = useState<'card' | 'apple' | 'google'>('card')

    useEffect(() => {
        async function fetchTransactions() {
            if (!user) return
            const { data } = await transactionsApi.getForUser(user.id)
            if (data) setTransactions(data)
            setIsLoading(false)
        }
        fetchTransactions()
    }, [user])

    const handleRefill = async () => {
        if (!user) return
        setIsRefilling(true)

        // Simulate API call
        const amount = parseFloat(refillAmount)
        const { data } = await transactionsApi.create({
            user_id: user.id,
            amount,
            currency: currency || 'EUR',
            type: 'refill',
            metadata: { description: `Wallet refill via ${selectedMethod}` },
            status: 'completed'
        })

        if (data) {
            // Refresh transactions
            const { data: newTransactions } = await transactionsApi.getForUser(user.id)
            if (newTransactions) setTransactions(newTransactions)
            setShowRefillModal(false)
        }
        setIsRefilling(false)
    }

    // Simple balance calculation
    const balance = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => {
            if (t.type === 'refill') return sum + t.amount
            return sum - t.amount
        }, 0)

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        )
    }

    const getTransactionIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'refill': return { icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
            case 'promotion_top': return { icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' }
            case 'promotion_highlight': return { icon: Zap, color: 'text-violet-500', bg: 'bg-violet-500/10' }
            case 'subscription': return { icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
            default: return { icon: CreditCardIcon, color: 'text-zinc-500', bg: 'bg-zinc-500/10' }
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Premium Wallet Header */}
            <div className="relative overflow-hidden rounded-xl border border-border bg-slate-900 p-8 text-white shadow-sm md:p-12">
                <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
                            {t('dashboard:wallet.title')} {t('common:balance')}
                        </span>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-5xl font-black tracking-tighter md:text-6xl">
                                {formatPrice(balance, currency)}
                            </h2>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowRefillModal(true)}
                            className="flex h-12 items-center gap-3 rounded-xl bg-primary px-6 text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-primary/90 active:scale-95 shadow-lg shadow-primary/20"
                        >
                            <Plus className="h-4 w-4" />
                            {t('dashboard:wallet.addFunds')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {[
                    { label: 'Spending', value: formatPrice(transactions.filter(t => t.type !== 'refill').reduce((s, t) => s + t.amount, 0), currency), icon: CreditCardIcon },
                    { label: 'Revenue', value: formatPrice(0, currency), icon: ShoppingBag },
                    { label: 'Active Promos', value: transactions.filter(t => t.type.startsWith('promotion') && t.status === 'completed').length, icon: Zap },
                    { label: 'Transactions', value: transactions.length, icon: History },
                ].map((stat, i) => (
                    <div key={i} className="border-border/60 bg-card rounded-xl border p-5 shadow-sm">
                        <stat.icon className="mb-3 h-5 w-5 text-muted-foreground/60" />
                        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">{stat.label}</p>
                        <p className="text-xl font-black text-foreground">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Transaction History */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                        <History className="h-4 w-4" />
                        {t('common:recentActivity')}
                    </h3>
                    <div className="flex items-center gap-1.5 rounded-xl bg-muted/50 p-1 border border-border/40">
                        <button className="rounded-lg bg-background px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm ring-1 ring-border/40">{t('common:all')}</button>
                        <button className="text-muted-foreground/60 rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest hover:text-foreground transition-colors">{t('dashboard:wallet.expenses')}</button>
                    </div>
                </div>

                {transactions.length > 0 ? (
                    <div className="divide-border/40 border-border/60 bg-card overflow-hidden rounded-xl border divide-y shadow-sm">
                        {transactions.map((transaction) => {
                            const info = getTransactionIcon(transaction.type)
                            return (
                                <div key={transaction.id} className="group flex items-center gap-5 p-6 transition-colors hover:bg-muted/30">
                                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl shrink-0 transition-transform group-hover:scale-105 border border-border/20", info.bg, info.color)}>
                                        <info.icon className="h-6 w-6" />
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <p className="text-sm font-bold text-foreground">
                                            {t(`dashboard:wallet.${transaction.type}`)}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(transaction.created_at).toLocaleDateString()}
                                            </span>
                                            {transaction.id && (
                                                <span className="opacity-40">ID: #{transaction.id.slice(0, 8)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn(
                                            "text-lg font-black tracking-tight",
                                            transaction.type === 'refill' ? "text-success" : "text-foreground"
                                        )}>
                                            {transaction.type === 'refill' ? '+' : '-'}{formatPrice(transaction.amount, transaction.currency)}
                                        </p>
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                                            transaction.status === 'completed' ? "text-success/70 border-success/20 bg-success/5" : "text-warning/70 border-warning/20 bg-warning/5"
                                        )}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <EmptyState
                        icon={CreditCardIcon}
                        title="No transactions yet"
                        description="Your financial activity will appear here. Start by promoting a listing!"
                        actionLabel="Promote Listing"
                        actionHref="/dashboard/listings"
                    />
                )}
            </div>

            {/* Add Funds Modal */}
            {showRefillModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-card border-border border w-full max-w-lg overflow-hidden rounded-xl shadow-2xl"
                    >
                        <div className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black uppercase tracking-tight">{t('dashboard:wallet.refillBalance')}</h2>
                                    <p className="text-muted-foreground/60 text-[10px] font-bold uppercase tracking-[0.2em]">{t('dashboard:wallet.addCreditsDescription')}</p>
                                </div>
                                <button
                                    onClick={() => setShowRefillModal(false)}
                                    className="bg-muted hover:bg-muted/80 flex h-8 w-8 items-center justify-center rounded-lg transition-colors border border-border/40"
                                >
                                    <Plus className="h-4 w-4 rotate-45" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t('dashboard:wallet.amount')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['20', '50', '100', '200', '500'].map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => setRefillAmount(amt)}
                                            className={cn(
                                                "rounded-xl border-2 py-3 text-sm font-black transition-all",
                                                refillAmount === amt
                                                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                                                    : "bg-muted/40 border-transparent text-foreground hover:border-border/40"
                                            )}
                                        >
                                            €{amt}
                                        </button>
                                    ))}
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Other"
                                            value={refillAmount}
                                            onChange={(e) => setRefillAmount(e.target.value)}
                                            className="bg-muted/40 w-full rounded-xl border-2 border-transparent py-3 pl-6 text-center text-sm font-black outline-none focus:border-primary/50"
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">€</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t('dashboard:wallet.selectMethod')}</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'card', label: 'Credit / Debit Card', icon: CreditCardIcon },
                                        { id: 'apple', label: 'Apple Pay', icon: Zap },
                                        { id: 'google', label: 'Google Pay', icon: Zap },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id as any)}
                                            className={cn(
                                                "flex w-full items-center gap-4 rounded-xl border-2 p-3 transition-all",
                                                selectedMethod === method.id
                                                    ? "bg-primary/5 border-primary text-primary"
                                                    : "bg-muted/40 border-transparent text-muted-foreground hover:border-border/40"
                                            )}
                                        >
                                            <method.icon className="h-4 w-4" />
                                            <span className="font-bold flex-1 text-left text-xs">{method.label}</span>
                                            <div className={cn(
                                                "h-4 w-4 rounded-full border flex items-center justify-center",
                                                selectedMethod === method.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                                            )}>
                                                {selectedMethod === method.id && <Zap className="h-2 w-2 text-white fill-current" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-border/40">
                                <button
                                    className="bg-primary flex-1 rounded-xl h-14 text-[10px] font-bold tracking-[0.2em] uppercase shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-primary-foreground"
                                    onClick={handleRefill}
                                    disabled={isRefilling || !refillAmount}
                                >
                                    {isRefilling ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        `${t('dashboard:wallet.confirmPayment')} €${refillAmount}`
                                    )}
                                </button>
                            </div>

                            <p className="text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                                Payment secured by Slovor Pay. No credit card details are stored on our servers.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
