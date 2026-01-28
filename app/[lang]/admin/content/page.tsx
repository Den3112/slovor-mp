'use client'

import { useState } from 'react'
import { CategoriesManager } from './components/categories-manager'
import { BlogManager } from './components/blog-manager'
import { PagesManager } from './components/pages-manager'
import { SettingsManager } from './components/settings-manager'
import {
    FolderTree,
    FileText,
    Layout,
    Settings2
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ContentTab = 'categories' | 'blog' | 'pages' | 'settings'

export default function ContentManagementPage() {
    const [activeTab, setActiveTab] = useState<ContentTab>('categories')

    const tabs = [
        { id: 'categories', label: 'Categories', icon: FolderTree },
        { id: 'blog', label: 'Blog Posts', icon: FileText },
        { id: 'pages', label: 'Static Pages', icon: Layout },
        { id: 'settings', label: 'Content Settings', icon: Settings2 },
    ] as const

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Premium Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight italic">Content Hub</h1>
                <p className="text-muted-foreground font-medium flex items-center gap-2">
                    Manage categories, blog articles, and system pages.
                </p>
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
                                "flex items-center gap-2 px-6 py-4 text-sm font-black uppercase tracking-widest transition-all relative group",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                            {tab.label}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(var(--primary),0.4)]" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Tab Panels */}
            <div className="min-h-[400px]">
                {activeTab === 'categories' && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <CategoriesManager />
                    </div>
                )}

                {activeTab === 'blog' && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <BlogManager />
                    </div>
                )}

                {activeTab === 'pages' && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <PagesManager />
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <SettingsManager />
                    </div>
                )}
            </div>
        </div>
    )
}
