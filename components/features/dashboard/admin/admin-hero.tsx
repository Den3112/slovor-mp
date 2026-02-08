'use client'

import { motion } from 'framer-motion'
import { Command, Globe, Network } from 'lucide-react'
import { SystemVitalsTicker } from './system-vitals-ticker'
import { useTranslation } from '@/lib/i18n'

interface AdminHeroProps {
  userEmail: string
}

export function AdminHero(_props: AdminHeroProps) {
  const { t } = useTranslation(['admin'])

  return (
    <div className="relative flex h-full flex-col justify-between p-8">
      {/* Background elements for "Command Center" feel */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-500/30 blur-3xl" />
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 dark:opacity-100" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-500 uppercase"
          >
            <Command className="h-3 w-3" />
            Control Center Beta v2.4
          </motion.div>
          <h1 className="text-foreground text-4xl font-bold tracking-tight">
            {t('admin:overview')}
          </h1>
          <div className="text-muted-foreground flex items-center gap-4 text-[11px] font-bold tracking-widest uppercase">
            <span className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-blue-500" />
              EU-CENTRAL-1
            </span>
            <span className="opacity-30">/</span>
            <span className="flex items-center gap-2">
              <Network className="h-3.5 w-3.5 text-indigo-500" />
              Slovor Cluster 01
            </span>
          </div>
        </div>

        <div className="hidden lg:block">
          <SystemVitalsTicker />
        </div>
      </div>

      <div className="relative z-10 mt-8 block lg:hidden">
        <SystemVitalsTicker />
      </div>
    </div>
  )
}
