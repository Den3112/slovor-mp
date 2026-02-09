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
    <div className="bg-card border-border relative overflow-hidden rounded-3xl border p-8 shadow-lg">
      <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-50" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="bg-primary/10 text-primary border-primary/20 flex h-12 w-12 items-center justify-center rounded-2xl border">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {t('dashboard:walletDetails.totalBalance', {
                defaultValue: 'Current Balance',
              })}
            </p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              {formatPrice(balance, currency)}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onAddFunds}
            className="shadow-primary/20 h-12 rounded-xl px-6 font-bold tracking-widest uppercase shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard:walletDetails.addFunds', {
              defaultValue: 'Add Funds',
            })}
          </Button>
          <Button
            variant="outline"
            className="border-border hover:bg-accent h-12 w-12 rounded-xl p-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
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
    <div className="bg-card border-border rounded-2xl border p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl border',
            type === 'income'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
              : 'border-rose-500/20 bg-rose-500/10 text-rose-500'
          )}
        >
          {type === 'income' ? (
            <ArrowDownLeft className="h-5 w-5" />
          ) : (
            <ArrowUpRight className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            {label}
          </p>
          <p className="text-xl font-bold">{formatPrice(amount, currency)}</p>
        </div>
      </div>
    </div>
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
    <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
      <div className="border-border flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold tracking-tight uppercase">
          {t('dashboard:walletDetails.history', {
            defaultValue: 'Transaction History',
          })}
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={t('common:search')}
              className="h-9 w-full rounded-lg pl-9 text-xs sm:w-64"
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="divide-border divide-y">
        {transactions.length > 0 ? (
          transactions.map((transaction, idx) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors sm:p-6"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border',
                    transaction.type === 'deposit' ||
                      transaction.type === 'refill'
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                      : 'border-rose-500/20 bg-rose-500/10 text-rose-500'
                  )}
                >
                  {transaction.type === 'deposit' ||
                  transaction.type === 'refill' ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {(transaction.metadata as any)?.description ||
                      transaction.type}
                  </p>
                  <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                    {new Date(transaction.created_at).toLocaleDateString()} •{' '}
                    {transaction.status}
                  </p>
                </div>
              </div>
              <p
                className={cn(
                  'font-bold',
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <CreditCard className="text-muted-foreground h-8 w-8" />
            </div>
            <h4 className="font-bold">
              {t('dashboard:walletDetails.noTransactions', {
                defaultValue: 'No transactions yet',
              })}
            </h4>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('dashboard:walletDetails.noTransactionsDesc', {
                defaultValue:
                  'Your transaction history will be displayed here.',
              })}
            </p>
          </div>
        )}
      </div>
    </div>
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
  const amounts = ['20', '50', '100', '200']

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl p-0">
        <div className="bg-primary absolute inset-0 -bottom-1/2 opacity-[0.03]" />

        <div className="relative p-8">
          <DialogHeader className="space-y-3 pb-8 text-center sm:text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {t('dashboard:walletDetails.addFunds', {
                defaultValue: 'Add Funds',
              })}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium">
              {t('dashboard:walletDetails.refillDescription', {
                defaultValue:
                  'Choose an amount and payment method to refill your wallet.',
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            <div className="group relative">
              <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 text-2xl font-bold">
                €
              </span>
              <Input
                value={refillAmount}
                onChange={(e) => setRefillAmount(e.target.value)}
                className="focus-visible:ring-primary/20 h-16 rounded-2xl pl-10 text-center text-3xl font-black"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {amounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setRefillAmount(amount)}
                  className={cn(
                    'h-10 rounded-xl font-bold transition-all',
                    refillAmount === amount
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-primary/5'
                  )}
                >
                  {amount}
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                {t('dashboard:walletDetails.paymentMethod', {
                  defaultValue: 'Payment Method',
                })}
              </p>
              <div className="grid grid-cols-1 gap-3">
                <MethodButton
                  selected={selectedMethod === 'card'}
                  onClick={() => setSelectedMethod('card')}
                  icon={<CreditCard className="h-5 w-5" />}
                  label="Bank Card"
                />
              </div>
            </div>

            <Button
              className="shadow-primary/20 h-14 w-full rounded-2xl text-base font-bold tracking-widest uppercase shadow-xl"
              onClick={onConfirm}
              disabled={isRefilling}
            >
              {isRefilling ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
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
        'flex items-center gap-4 rounded-2xl border p-4 text-left transition-all',
        selected
          ? 'border-primary bg-primary/5 ring-primary ring-1'
          : 'border-border hover:bg-muted/50'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl border',
          selected
            ? 'border-primary/20 bg-primary/10 text-primary'
            : 'border-border bg-muted text-muted-foreground'
        )}
      >
        {icon}
      </div>
      <div>
        <p className="font-bold">{label}</p>
        <p className="text-muted-foreground text-[10px] font-medium uppercase">
          Fast & Secure
        </p>
      </div>
      {selected && (
        <div className="bg-primary ring-primary/20 ml-auto h-2 w-2 rounded-full ring-4" />
      )}
    </button>
  )
}
