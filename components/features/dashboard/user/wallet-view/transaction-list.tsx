import { ArrowDownLeft, TrendingUp, Zap, Star, CreditCard, History, Calendar } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { TransactionListProps } from './types';
import type { Transaction } from '@/lib/types/database';

const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
        case 'refill': return { icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
        case 'promotion_top': return { icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' };
        case 'promotion_highlight': return { icon: Zap, color: 'text-violet-500', bg: 'bg-violet-500/10' };
        case 'subscription': return { icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
        default: return { icon: CreditCard, color: 'text-zinc-500', bg: 'bg-zinc-500/10' };
    }
};

export function TransactionList({ transactions, onAddFunds }: TransactionListProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <History className="h-4 w-4" />
                    {t('dashboard:wallet.transactions')}
                </h3>
            </div>

            {transactions.length > 0 ? (
                <div className="divide-border/40 border-border/60 bg-card overflow-hidden rounded-xl border divide-y shadow-sm">
                    {transactions.map((transaction) => {
                        const info = getTransactionIcon(transaction.type);
                        return (
                            <div key={transaction.id} className="group flex items-center gap-5 p-6 transition-colors hover:bg-muted/30">
                                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl shrink-0 transition-transform group-hover:scale-105 border border-border/20", info.bg, info.color)}>
                                    <info.icon className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">
                                        {t(`dashboard:walletDetails.${transaction.type}`)}
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(transaction.created_at).toLocaleDateString()}
                                        </span>
                                        {transaction.id && (
                                            <span className="hidden sm:inline">REF: #{transaction.id.slice(0, 8)}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={cn(
                                        "text-lg font-bold tracking-tight",
                                        transaction.type === 'refill' ? "text-emerald-500" : "text-foreground"
                                    )}>
                                        {transaction.type === 'refill' ? '+' : '-'}{formatPrice(transaction.amount, transaction.currency)}
                                    </p>
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                                        transaction.status === 'completed'
                                            ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                                            : "text-amber-500 border-amber-500/20 bg-amber-500/5"
                                    )}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={CreditCard}
                    title={t('dashboard:noOrders')}
                    description={t('dashboard:walletDetails.addCreditsDescription')}
                    actionLabel={t('dashboard:walletDetails.addFunds')}
                    onAction={onAddFunds}
                />
            )}
        </div>
    );
}
