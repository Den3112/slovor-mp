'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

interface ListingsFiltersProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  tabs: Array<{ value: string; label: string; count: number }>
}

export function ListingsFilters({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  tabs,
}: ListingsFiltersProps) {
  const { t } = useTranslation(['common'])

  return (
    <motion.div
      variants={item}
      className="flex flex-col items-start justify-between gap-6 p-6 lg:flex-row lg:items-center"
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full lg:w-auto"
      >
        <TabsList className="bg-primary/5 border-primary/5 h-auto flex-wrap justify-start rounded-2xl border p-1.5">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-background data-[state=active]:text-primary h-10 rounded-xl px-5 text-[9px] font-black tracking-[0.15em] uppercase transition-all duration-300 active:scale-95 data-[state=active]:shadow-lg"
            >
              <span className="mr-2.5">{tab.label}</span>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary group-data-[state=active]:bg-primary/20 h-5 min-w-6 border-transparent px-1.5 py-0 text-[10px] font-black tabular-nums transition-colors"
              >
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex w-full gap-3 lg:w-auto">
        <div className="relative flex-1 lg:w-80">
          <div className="absolute top-1/2 left-4 -translate-y-1/2">
            <Search className="text-primary/40 h-4 w-4 transition-colors" />
          </div>
          <Input
            placeholder={t('common:search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-primary/10 bg-primary/5 focus:ring-primary/20 focus:bg-background h-12 rounded-2xl pl-11 text-[11px] font-black tracking-widest uppercase transition-all"
          />
        </div>
      </div>
    </motion.div>
  )
}
