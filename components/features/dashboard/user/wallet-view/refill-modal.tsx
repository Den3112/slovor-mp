import { Plus, CreditCard, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { RefillModalProps } from './types';

export function RefillModal({
    isOpen,
    onClose,
    refillAmount,
    setRefillAmount,
    selectedMethod,
    setSelectedMethod,
    onConfirm,
    isRefilling
}: RefillModalProps) {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-card border-border border w-full max-w-lg overflow-hidden rounded-xl shadow-2xl"
            >
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold uppercase tracking-tight">{t('dashboard:walletDetails.refillBalance')}</h2>
                            <p className="text-muted-foreground/60 text-[10px] font-bold uppercase tracking-[0.2em]">{t('dashboard:walletDetails.addCreditsDescription')}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-muted hover:bg-muted/80 flex h-8 w-8 items-center justify-center rounded-lg transition-colors border border-border/40"
                        >
                            <Plus className="h-4 w-4 rotate-45" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t('dashboard:walletDetails.amount')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['20', '50', '100', '200', '500'].map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setRefillAmount(amt)}
                                    className={cn(
                                        "rounded-xl border-2 py-3 text-sm font-bold transition-all",
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
                                    className="bg-muted/40 w-full rounded-xl border-2 border-transparent py-3 pl-6 text-center text-sm font-bold outline-none focus:border-primary/50"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">€</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t('dashboard:walletDetails.selectMethod')}</label>
                        <div className="space-y-2">
                            {[
                                { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
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
                            onClick={onConfirm}
                            disabled={isRefilling || !refillAmount}
                        >
                            {isRefilling ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                `${t('dashboard:walletDetails.confirmPayment')} €${refillAmount}`
                            )}
                        </button>
                    </div>

                    <p className="text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                        Payment secured by Slovor Pay. No credit card details are stored on our servers.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
