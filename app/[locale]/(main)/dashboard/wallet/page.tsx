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

export default function WalletPage() {
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

  // Simple balance calculation (in real app, this comes from server/ledger)
  const balance = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => {
      if (t.type === 'refill') return sum + t.amount;
      return sum - t.amount;
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
      case 'refill': return { icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'promotion_top': return { icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case 'promotion_highlight': return { icon: Zap, color: 'text-violet-500', bg: 'bg-violet-500/10' };
      case 'subscription': return { icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
      default: return { icon: CreditCardIcon, color: 'text-zinc-500', bg: 'bg-zinc-500/10' };
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Wallet Header */}
      <div className="group relative overflow-hidden rounded-5xl border border-white/10 bg-linear-to-br from-indigo-600 via-violet-600 to-indigo-500 p-8 text-white shadow-2xl md:p-12">
        {/* Animated Glows */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-[100px] transition-transform duration-1000 group-hover:scale-150" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-900/40 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-70">
              {t('wallet.title')} Balance
            </span>
            <div className="flex items-baseline gap-2">
              <h2 className="font-heading text-5xl font-black tracking-tighter md:text-7xl">
                {formatPrice(balance, currency)}
              </h2>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowRefillModal(true)}
              className="flex h-14 items-center gap-3 rounded-2xl bg-white/10 px-6 font-black tracking-widest uppercase backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              {t('wallet.addFunds')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Spending', value: formatPrice(transactions.filter(t => t.type !== 'refill').reduce((s, t) => s + t.amount, 0), currency), icon: CreditCardIcon },
          { label: 'Revenue', value: formatPrice(0, currency), icon: ShoppingBag },
          { label: 'Active Promos', value: transactions.filter(t => t.type.startsWith('promotion') && t.status === 'completed').length, icon: Zap },
          { label: 'Transactions', value: transactions.length, icon: History },
        ].map((stat, i) => (
          <div key={i} className="border-border/50 bg-card rounded-3xl border p-5 shadow-sm">
            <stat.icon className="mb-3 h-5 w-5 text-muted-foreground" />
            <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">{stat.label}</p>
            <p className="text-xl font-black text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Activity
          </h3>
          <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-1">
            <button className="rounded-lg bg-card px-3 py-1.5 text-xs font-bold shadow-sm">All</button>
            <button className="text-muted-foreground rounded-lg px-3 py-1.5 text-xs font-bold hover:bg-muted">Expenses</button>
          </div>
        </div>

        {transactions.length > 0 ? (
          <div className="divide-border/10 border-border/50 bg-card overflow-hidden rounded-4xl border divide-y shadow-sm">
            {transactions.map((transaction) => {
              const info = getTransactionIcon(transaction.type)
              return (
                <div key={transaction.id} className="group flex items-center gap-5 p-6 transition-colors hover:bg-muted/30">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 transition-transform group-hover:scale-110", info.bg, info.color)}>
                    <info.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-sm font-bold text-foreground">
                      {transaction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </span>
                      {transaction.id.slice(0, 8) && (
                        <span className="opacity-40">ID: #{transaction.id.slice(0, 8)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-lg font-black",
                      transaction.type === 'refill' ? "text-emerald-500" : "text-foreground"
                    )}>
                      {transaction.type === 'refill' ? '+' : '-'}{formatPrice(transaction.amount, transaction.currency)}
                    </p>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      transaction.status === 'completed' ? "text-emerald-500/70" : "text-amber-500/70"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-card border-border border-2 w-full max-w-xl overflow-hidden rounded-5xl shadow-2xl"
          >
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black italic tracking-tight">{t('wallet.refillBalance')}</h2>
                  <p className="text-muted-foreground text-sm font-medium">Add credits to your account instantly.</p>
                </div>
                <button
                  onClick={() => setShowRefillModal(false)}
                  className="bg-muted hover:bg-muted/80 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('wallet.amount')}</label>
                <div className="grid grid-cols-3 gap-3">
                  {['20', '50', '100', '200', '500'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setRefillAmount(amt)}
                      className={cn(
                        "rounded-2xl border-2 py-4 text-lg font-black transition-all",
                        refillAmount === amt
                          ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                          : "bg-muted border-transparent text-foreground hover:border-border"
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
                      className="bg-muted w-full rounded-2xl border-2 border-transparent py-4 pl-8 text-center text-lg font-black outline-none focus:border-primary/50"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black">€</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('wallet.selectMethod')}</label>
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
                        "flex w-full items-center gap-4 rounded-2xl border-2 p-4 transition-all",
                        selectedMethod === method.id
                          ? "bg-primary/5 border-primary text-primary"
                          : "bg-muted border-transparent text-muted-foreground hover:border-border"
                      )}
                    >
                      <method.icon className="h-5 w-5" />
                      <span className="font-bold flex-1 text-left">{method.label}</span>
                      <div className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                        selectedMethod === method.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                      )}>
                        {selectedMethod === method.id && <Zap className="h-3 w-3 text-white fill-current" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/50">
                <button
                  className="bg-primary flex-1 rounded-2xl h-16 text-lg font-black tracking-widest uppercase shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={handleRefill}
                  disabled={isRefilling || !refillAmount}
                >
                  {isRefilling ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `${t('wallet.confirmPayment')} €${refillAmount}`
                  )}
                </button>
              </div>

              <p className="text-center text-[10px] font-medium text-muted-foreground">
                Payment secured by Slovor Pay. No credit card details are stored on our servers.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
