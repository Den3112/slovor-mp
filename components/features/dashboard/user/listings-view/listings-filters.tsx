'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
};

interface ListingsFiltersProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    tabs: Array<{ value: string; label: string; count: number }>;
}

export function ListingsFilters({
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    tabs,
}: ListingsFiltersProps) {
    const { t } = useTranslation(['common']);

    return (
        <motion.div
            variants={item}
            className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-card p-4 rounded-xl border border-border/60 shadow-sm"
        >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
                <TabsList className="bg-muted/50 p-1 rounded-lg h-auto flex-wrap justify-start border border-border/20">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all px-4 py-2 h-auto text-[9px] font-bold uppercase tracking-widest"
                        >
                            {tab.label}
                            <Badge variant="secondary" className="ml-2 px-1.5 py-0 h-4 min-w-5 border-transparent bg-muted/80 text-[8px] font-bold">
                                {tab.count}
                            </Badge>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="flex gap-2 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                        placeholder={t('common:search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 border-border/60 focus:ring-primary/20 rounded-xl font-bold text-xs"
                    />
                </div>
            </div>
        </motion.div>
    );
}
