'use client'

import { PackageSearch } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n'

interface ListingErrorStateProps {
    error: string
}

export function ListingErrorState({ error }: ListingErrorStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="border-2 border-destructive/20 bg-destructive/5 p-12 text-center text-destructive"
        >
            <p className="mb-4 font-heading text-3xl font-black italic tracking-tight">
                System Interference Detected
            </p>
            <p className="font-sans text-sm font-bold uppercase tracking-widest opacity-70">{error}</p>
        </motion.div>
    )
}

export function ListingEmptyState() {
    const { t } = useTranslation()

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-zinc-950/50 p-8 py-40 text-center"
        >
            <div className="mb-10 flex h-24 w-24 items-center justify-center border-2 border-primary/20 bg-primary/5">
                <PackageSearch className="h-12 w-12 text-primary" />
            </div>
            <p className="mb-4 font-heading text-4xl font-black italic tracking-tight text-white">
                {t.common.noResults}
            </p>
            <p className="max-w-md font-sans text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 leading-relaxed">
                {t.common.tryDifferentFilters}
            </p>
        </motion.div>
    )
}
