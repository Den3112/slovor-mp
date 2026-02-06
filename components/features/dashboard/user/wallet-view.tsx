'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { transactionsApi, walletsApi } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'
import type { Transaction, Wallet } from '@/lib/types/database'
import {
    Loader2
} from 'lucide-react'
import { useCurrency } from '@/components/providers/currency-provider'

import {
    WalletHeader,
    WalletStats,
    TransactionList,
    RefillModal
} from './wallet-view/index'

export function WalletView() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const { currency } = useCurrency()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [wallet, setWallet] = useState<Wallet | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefilling, setIsRefilling] = useState(false)
    const [showRefillModal, setShowRefillModal] = useState(false)
    const [refillAmount, setRefillAmount] = useState('50')
    const [selectedMethod, setSelectedMethod] = useState<'card' | 'apple' | 'google'>('card')

    useEffect(() => {
        async function initWallet() {
            if (!user) return

            // 1. Ensure wallet exists
            await walletsApi.ensureWallet()

            // 2. Fetch wallet and transactions
            const [walletRes, transRes] = await Promise.all([
                walletsApi.getMyWallet(),
                transactionsApi.getForUser(user.id)
            ])

            if (walletRes.data) setWallet(walletRes.data)
            if (transRes.data) setTransactions(transRes.data)

            setIsLoading(false)
        }
        initWallet()
    }, [user])

    const handleRefill = async () => {
        if (!user || !wallet) return
        setIsRefilling(true)

        // Simulate API call
        const amount = parseFloat(refillAmount)
        const { data } = await transactionsApi.create({
            user_id: user.id,
            wallet_id: wallet.id,
            amount,
            currency: currency || 'EUR',
            type: 'refill',
            metadata: { description: `Wallet refill via ${selectedMethod}` },
            status: 'completed'
        })

        if (data) {
            // Refresh wallet and transactions
            const [walletRes, transRes] = await Promise.all([
                walletsApi.getMyWallet(),
                transactionsApi.getForUser(user.id)
            ])
            if (walletRes.data) setWallet(walletRes.data)
            if (transRes.data) setTransactions(transRes.data)
            setShowRefillModal(false)
            toast.success(t('dashboard:walletDetails.refillSuccess') || 'Wallet refilled successfully!')
        }
        setIsRefilling(false)
    }

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <WalletHeader
                balance={wallet?.balance ?? 0}
                currency={currency}
                onAddFunds={() => setShowRefillModal(true)}
            />

            <WalletStats
                transactions={transactions}
                currency={currency}
            />

            <TransactionList
                transactions={transactions}
                onAddFunds={() => setShowRefillModal(true)}
            />

            <RefillModal
                isOpen={showRefillModal}
                onClose={() => setShowRefillModal(false)}
                refillAmount={refillAmount}
                setRefillAmount={setRefillAmount}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                onConfirm={handleRefill}
                isRefilling={isRefilling}
            />
        </div>
    )
}
