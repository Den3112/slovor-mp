import { CreditCard, ShoppingBag, Zap, History } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils/formatting';
import { WalletStatsProps } from './types';

export function WalletStats({ transactions, currency }: WalletStatsProps) {
    const { t } = useTranslation();

    const stats = [
        {
            label: t('dashboard:wallet.spending'),
            value: formatPrice(transactions.filter(t => t.type !== 'refill').reduce((s, t) => s + t.amount, 0), currency),
            icon: CreditCard
        },
        {
            label: t('dashboard:wallet.revenue'),
            value: formatPrice(0, currency),
            icon: ShoppingBag
        },
        {
            label: t('dashboard:wallet.activePromos'),
            value: transactions.filter(t => (t.type === 'promotion_top' || t.type === 'promotion_highlight') && t.status === 'completed').length,
            icon: Zap
        },
        {
            label: t('dashboard:wallet.transactions'),
            value: transactions.length,
            icon: History
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
                <div key={i} className="border-border/60 bg-card rounded-xl border p-5 shadow-sm">
                    <stat.icon className="mb-3 h-5 w-5 text-muted-foreground/40" />
                    <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
