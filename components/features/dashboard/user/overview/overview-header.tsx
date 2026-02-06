import Link from 'next/link';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { OverviewHeaderProps } from './types';

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function OverviewHeader({ user }: OverviewHeaderProps) {
    const { t, locale } = useTranslation(['common', 'dashboard', 'createListing', 'profile']);

    return (
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">{t('common:dashboard')}</h1>
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {t('dashboard:welcomeBack')}, <span className="text-foreground">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" asChild className="hidden sm:flex text-[10px] font-bold uppercase tracking-widest rounded-xl border-border/60 h-10 px-6">
                    <Link href={`/${locale}/dashboard/settings`}>{t('profile:settings')}</Link>
                </Button>
                <Button asChild className="shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest rounded-xl px-6 h-10">
                    <Link href={`/${locale}/post`}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('createListing:publish')}
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
}
