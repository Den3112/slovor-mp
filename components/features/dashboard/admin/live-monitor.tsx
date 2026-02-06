'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';

export function LiveMonitor() {
    const { t } = useTranslation('common');
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            const { data } = await adminApi.getActivityLogs(10);
            if (data) setLogs(data);
            setIsLoading(false);
        };

        loadLogs();
        const interval = setInterval(loadLogs, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="h-8 w-8 rounded-lg bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 bg-muted rounded" />
                            <div className="h-2 w-1/2 bg-muted rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-primary" />
                {t('admin:liveActivity') || 'Live Activity'}
            </h4>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex gap-3 items-start group"
                        >
                            <div className="relative h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border/40 group-hover:bg-primary/5 transition-colors">
                                <Activity className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-foreground line-clamp-1 leading-none mb-1">
                                    {log.event_type}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 font-medium">
                                    <Clock className="h-2.5 w-2.5" />
                                    <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span>•</span>
                                    <span className="truncate">{log.description || log.payload?.title || 'System event'}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {logs.length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {t('admin:noActivity') || 'No activity recorded'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
