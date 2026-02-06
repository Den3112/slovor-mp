import { Transaction } from '@/lib/types/database';

export interface WalletHeaderProps {
    balance: number;
    currency: string;
    onAddFunds: () => void;
}

export interface WalletStatsProps {
    transactions: Transaction[];
    currency: string;
}

export interface TransactionListProps {
    transactions: Transaction[];
    onAddFunds: () => void;
}

export interface RefillModalProps {
    isOpen: boolean;
    onClose: () => void;
    refillAmount: string;
    setRefillAmount: (val: string) => void;
    selectedMethod: 'card' | 'apple' | 'google';
    setSelectedMethod: (val: 'card' | 'apple' | 'google') => void;
    onConfirm: () => Promise<void>;
    isRefilling: boolean;
}
