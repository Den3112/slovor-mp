'use client'

import React from 'react'
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CreditCard,
  Search,
  Filter,
  MoreVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils/formatting'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { Transaction } from '@/lib/types/database'
import { useTranslation } from '@/lib/i18n'

// --- WalletHeader ---
interface WalletHeaderProps {
  balance: number
  currency: string
  onAddFunds: () => void
}

export function WalletHeader({
  balance,
  currency,
  onAddFunds,
}: WalletHeaderProps) {
  const { t } = useTranslation(['dashboard'])

  return (
    <div className="bg-card relative overflow-hidden rounded-2xl border border-border p-10 shadow-md">
      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <div className="bg-primary shadow-primary/20 flex h-16 w-16 items-center justify-center rounded-xl shadow-lg">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground ml-1 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">
              {t('dashboard:walletDetails.totalBalance', {
                defaultValue: 'Current Balance',
              })}
            </p>
            <h2 className="text-foreground text-5xl font-black tracking-tighter sm:text-7xl tabular-nums">
              {formatPrice(balance, currency)}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={onAddFunds}
            className="group shadow-primary/20 relative h-16 rounded-xl px-10 text-xs font-black tracking-[0.2em] uppercase shadow-md transition-all duration-500 hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-3 h-5 w-5 transition-transform group-hover:rotate-90" />
            {t('dashboard:walletDetails.addFunds', {
              defaultValue: 'Add Funds',
            })}
          </Button>
          <Button
            variant="outline"
            className="border-border hover:bg-primary/5 h-16 w-16 rounded-xl p-0 transition-all hover:scale-105"
          >
            <MoreVertical className="text-primary/60 h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="bg-primary/10 absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[100px] opacity-40" />
      <div className="bg-primary/5 absolute -left-20 -bottom-20 h-64 w-64 rounded-full blur-[100px] opacity-30" />
    </div>
  )
}

// --- WalletStats ---
interface WalletStatsProps {
  transactions: Transaction[]
  currency: string
}

export function WalletStats({ transactions, currency }: WalletStatsProps) {
  const { t } = useTranslation(['dashboard'])

  const income = transactions
    .filter((t) => t.type === 'deposit' || t.type === 'refill')
    .reduce((acc, t) => acc + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === 'payout' || t.type === 'purchase')
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard
        label={t('dashboard:walletDetails.totalIncome', {
          defaultValue: 'Total Income',
        })}
        amount={income}
        currency={currency}
        type="income"
      />
      <StatCard
        label={t('dashboard:walletDetails.totalExpenses', {
          defaultValue: 'Total Expenses',
        })}
        amount={expenses}
        currency={currency}
        type="expense"
      />
    </div>
  )
}

function StatCard({
  label,
  amount,
  currency,
  type,
}: {
  label: string
  amount: number
  currency: string
  type: 'income' | 'expense'
}) {
  return (
    <div className={cn(
      "bg-card group relative border-border overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] shadow-md",
      type === 'income' ? 'hover:shadow-emerald-500/10' : 'hover:shadow-rose-500/10'
    )}>
      <div className="relative z-10 flex items-center gap-6">
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-xl border shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6',
            type === 'income'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
              : 'border-rose-500/20 bg-rose-500/10 text-rose-500'
          )}
        >
          {type === 'income' ? (
            <ArrowDownLeft className="h-7 w-7" />
          ) : (
            <ArrowUpRight className="h-7 w-7" />
          )}
        </div>
        <div>
          <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase opacity-50">
            {label}
          </p>
          <p className="text-2xl font-black tracking-tighter tabular-nums">{formatPrice(amount, currency)}</p>
        </div>
      </div>
      <div className={cn(
        "bg-current absolute -right-6 -bottom-6 h-32 w-32 rounded-full blur-3xl opacity-5",
        type === 'income' ? 'text-emerald-500' : 'text-rose-500'
      )} />
    </div >
  )
}

// --- TransactionList ---
interface TransactionListProps {
  transactions: Transaction[]
  onAddFunds: () => void
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { t } = useTranslation(['dashboard', 'common'])

  return (
    <div className="bg-card overflow-hidden rounded-2xl border border-border shadow-md">
      <div className="border-primary/5 flex flex-col gap-8 border-b p-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h3 className="text-foreground text-xl font-black tracking-tighter uppercase">
            {t('dashboard:walletDetails.history', {
              defaultValue: 'Transaction History',
            })}
          </h3>
          <p className="text-muted-foreground mt-3 max-w-xs text-xs font-medium leading-relaxed opacity-60">
            {t('dashboard:monitorTransactions', { defaultValue: 'Monitor your spending and earnings' })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full lg:w-72">
            <Search className="text-primary/40 absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2" />
            <Input
              placeholder={t('common:search')}
              className="glass-panel border-primary/10 focus-visible:ring-primary/20 h-12 rounded-xl bg-background/40 pl-12 text-[11px] font-black tracking-wider shadow-inner"
            />
          </div>
          <Button variant="outline" size="icon" className="glass-panel border-primary/10 hover:border-primary/40 bg-background/40 h-12 w-12 rounded-xl p-0 transition-all hover:scale-105 active:scale-95 shadow-soft">
            <Filter className="text-primary/60 h-4.5 w-4.5" />
          </Button>
        </div>
      </div>

      <div className="divide-primary/5 divide-y">
        {transactions.length > 0 ? (
          transactions.map((transaction, idx) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 + 0.2 }}
              className="group hover:bg-primary/5 border-b border-border last:border-0 flex items-center justify-between p-6 transition-all duration-300 sm:px-10"
            >
              <div className="flex items-center gap-6">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl border shadow-soft transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6',
                    transaction.type === 'deposit' ||
                      transaction.type === 'refill'
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                      : 'border-rose-500/20 bg-rose-500/10 text-rose-500'
                  )}
                >
                  {transaction.type === 'deposit' ||
                    transaction.type === 'refill' ? (
                    <ArrowDownLeft className="h-6 w-6" />
                  ) : (
                    <ArrowUpRight className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <p className="text-foreground text-sm font-black tracking-tight uppercase group-hover:text-primary transition-colors">
                    {(transaction.metadata as any)?.description ||
                      transaction.type}
                  </p>
                  <div className="text-muted-foreground mt-1 flex items-center gap-3 text-[10px] font-black tracking-widest uppercase opacity-40">
                    <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-xl border",
                      transaction.status === 'completed' ? 'border-emerald-500/20 text-emerald-500/60 bg-emerald-500/5' : 'border-primary/10'
                    )}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
              <p
                className={cn(
                  'text-lg font-black tracking-tighter tabular-nums',
                  transaction.type === 'deposit' ||
                    transaction.type === 'refill'
                    ? 'text-emerald-500'
                    : 'text-foreground'
                )}
              >
                {transaction.type === 'deposit' || transaction.type === 'refill'
                  ? '+'
                  : '-'}
                {formatPrice(transaction.amount, transaction.currency)}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-primary/5 border-primary/10 mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border shadow-inner">
              <CreditCard className="text-primary/20 h-10 w-10" />
            </div>
            <h4 className="text-foreground text-xl font-black tracking-tighter uppercase">
              {t('dashboard:walletDetails.noTransactions', {
                defaultValue: 'No transactions yet',
              })}
            </h4>
            <p className="text-muted-foreground mt-3 max-w-xs text-xs font-medium leading-relaxed opacity-60">
              {t('dashboard:walletDetails.noTransactionsDesc', {
                defaultValue:
                  'Your transaction history will be displayed here as you use your wallet.',
              })}
            </p>
          </div>
        )}
      </div>
    </div >
  )
}

// --- RefillModal ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

interface RefillModalProps {
  isOpen: boolean
  onClose: () => void
  refillAmount: string
  setRefillAmount: (val: string) => void
  selectedMethod: 'card' | 'apple' | 'google'
  setSelectedMethod: (val: 'card' | 'apple' | 'google') => void
  onConfirm: () => void
  isRefilling: boolean
}

export function RefillModal({
  isOpen,
  onClose,
  refillAmount,
  setRefillAmount,
  selectedMethod,
  setSelectedMethod,
  onConfirm,
  isRefilling,
}: RefillModalProps) {
  const { t } = useTranslation(['dashboard', 'common'])
  const amounts = ['20', '50', '100', '250']

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-lg overflow-hidden border border-border p-0 shadow-lg rounded-2xl">
        <div className="from-primary/10 absolute inset-0 -bottom-1/2 bg-linear-to-b via-transparent to-transparent opacity-30 blur-3xl" />

        <div className="relative p-10 lg:p-12">
          <DialogHeader className="space-y-4 pb-10 text-center sm:text-left">
            <DialogTitle className="text-3xl font-black tracking-tighter uppercase sm:text-4xl text-foreground">
              {t('dashboard:walletDetails.addFunds', {
                defaultValue: 'Refill Wallet',
              })}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase opacity-60">
              {t('dashboard:walletDetails.refillDescription', {
                defaultValue:
                  'Select an amount and payment method to securely top up your balance',
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-10">
            <div className="relative group">
              <span className="text-primary/40 absolute top-1/2 left-8 -translate-y-1/2 text-4xl font-black italic">
                €
              </span>
              <Input
                value={refillAmount}
                onChange={(e) => setRefillAmount(e.target.value)}
                className="bg-primary/5 border-border focus-visible:ring-primary/30 h-24 rounded-xl pl-16 pr-8 text-center text-5xl font-black tracking-tighter tabular-nums shadow-inner transition-all duration-300 group-focus-within:scale-[1.02]"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {amounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setRefillAmount(amount)}
                  className={cn(
                    'h-14 rounded-[1.2rem] text-sm font-black tracking-widest transition-all duration-500 shadow-soft',
                    refillAmount === amount
                      ? 'bg-primary text-white border-primary shadow-md shadow-primary/30 scale-105'
                      : 'bg-primary/5 border-border hover:bg-primary/10 hover:scale-105 active:scale-95'
                  )}
                >
                  {amount}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground ml-1 text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
                {t('dashboard:walletDetails.paymentMethod', {
                  defaultValue: 'Payment Method',
                })}
              </p>
              <div className="grid grid-cols-1 gap-4">
                <MethodButton
                  selected={selectedMethod === 'card'}
                  onClick={() => setSelectedMethod('card')}
                  icon={<CreditCard className="h-6 w-6" />}
                  label="Bank Card"
                />
              </div>
            </div>

            <Button
              className="shadow-primary/20 relative h-20 w-full rounded-xl text-lg font-black tracking-[0.2em] uppercase shadow-md transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] bg-primary group overflow-hidden"
              onClick={onConfirm}
              disabled={isRefilling}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isRefilling ? (
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              ) : (
                <CreditCard className="mr-3 h-6 w-6 transition-transform group-hover:-rotate-12" />
              )}
              {t('common:confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MethodButton({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        selected
          ? 'border-primary bg-primary/5 ring-primary/20 ring-4'
          : 'bg-primary/5 border-border hover:bg-primary/10 hover:border-primary/20'
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-700',
          selected
            ? 'bg-primary text-white shadow-md shadow-primary/20 rotate-6 scale-110'
            : 'border-border bg-background text-primary/40 group-hover:text-primary group-hover:scale-105'
        )}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-foreground text-base font-black tracking-tight uppercase">{label}</p>
        <p className="text-muted-foreground mt-1 text-[9px] font-black tracking-widest uppercase opacity-40">
          Fast • Secure • Encrypted
        </p>
      </div>
      {selected && (
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 animate-in zoom-in-50 duration-500">
          <Plus className="h-4 w-4 text-white rotate-45" />
        </div>
      )}
    </button>
  )
}
