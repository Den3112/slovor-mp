'use client';

import { Package } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ListingsEmpty() {
    const { t, locale } = useTranslation(['common', 'dashboard', 'createListing']);

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mb-6">
                <Package className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground mb-2">
                {t('dashboard:noListingsYet')}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8 font-medium">
                {t('dashboard:noListingsDesc') || 'You haven\'t created any listings yet. Start selling today!'}
            </p>
            <Button asChild className="rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                <Link href={`/${locale}/post`}>{t('createListing:publish')}</Link>
            </Button>
        </div>
    );
}
