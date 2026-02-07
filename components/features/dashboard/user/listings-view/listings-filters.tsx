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
      className="bg-card border-border/60 flex flex-col items-start justify-between gap-4 rounded-lg border p-4 shadow-sm lg:flex-row lg:items-center"
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full lg:w-auto"
      >
        <TabsList className="bg-muted/50 border-border/20 h-auto flex-wrap justify-start rounded-lg border p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-background data-[state=active]:text-primary h-auto rounded-md px-4 py-2 text-[9px] font-bold tracking-widest uppercase transition-all data-[state=active]:shadow-sm"
            >
              {tab.label}
              <Badge
                variant="secondary"
                className="bg-muted/80 ml-2 h-4 min-w-5 border-transparent px-1.5 py-0 text-[8px] font-bold"
              >
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex w-full gap-2 lg:w-auto">
        <div className="relative flex-1 lg:w-72">
          <Search className="text-muted-foreground/60 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder={t('common:search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border/60 focus:ring-primary/20 h-10 rounded-lg pl-9 text-xs font-bold"
          />
        </div>
      </div>
    </motion.div>
  )
}
