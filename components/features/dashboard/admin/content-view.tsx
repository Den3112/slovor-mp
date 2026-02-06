'use client'

import { useState } from 'react'
import { CategoriesManager } from './content/categories-manager'
import { BlogManager } from './content/blog-manager'
import { PagesManager } from './content/pages-manager'
import { SettingsManager } from './content/settings-manager'
import {
    FolderTree,
    FileText,
    Layout,
    Settings2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'

type ContentTab = 'categories' | 'blog' | 'pages' | 'settings'

export function AdminContentView() {
    const { t } = useTranslation('common')
    const [activeTab, setActiveTab] = useState<ContentTab>('categories')

    const tabs = [
        { id: 'categories', label: t('admin:tabCategories'), icon: FolderTree },
        { id: 'blog', label: t('admin:tabBlog'), icon: FileText },
        { id: 'pages', label: t('admin:tabPages'), icon: Layout },
        { id: 'settings', label: t('admin:tabSettings'), icon: Settings2 },
    ] as const

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">{t('admin:contentHub')}</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        {t('admin:contentHubDesc')}
                    </p>
                </div>
            </div>

            {/* Custom Tabs Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-border/50 pb-px">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all relative group",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                            {tab.label}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-sm" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Tab Panels */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'categories' && (
                        <motion.div
                            key="categories"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CategoriesManager />
                        </motion.div>
                    )}

                    {activeTab === 'blog' && (
                        <motion.div
                            key="blog"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <BlogManager />
                        </motion.div>
                    )}

                    {activeTab === 'pages' && (
                        <motion.div
                            key="pages"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <PagesManager />
                        </motion.div>
                    )}
                    {activeTab === 'settings' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <SettingsManager />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
