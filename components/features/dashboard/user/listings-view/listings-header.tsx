'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

interface ListingsHeaderProps {
    count: number;
}

export function ListingsHeader({ count }: ListingsHeaderProps) {
    const { t, locale } = useTranslation(['dashboard', 'createListing', 'common'])

    return (
        <motion.div variants={item} className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">{t('dashboard:myListings')}</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {t('dashboard:manageListings')} • <span className="text-primary">{count} {t('common:listings')}</span>
                </p>
            </div>
            <Button asChild className="shadow-lg shadow-primary/20">
                <Link href={`/${locale}/post`}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('createListing:publish')}
                </Link>
            </Button>
        </motion.div>
    )
}
