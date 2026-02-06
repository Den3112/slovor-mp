import Link from 'next/link';
import { Plus, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivityFeed } from '@/components/seller-profile/activity-feed';
import { useTranslation } from '@/lib/i18n';

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function QuickActionsAndActivity() {
    const { t, locale } = useTranslation(['common', 'dashboard', 'createListing']);

    return (
        <motion.div variants={item} className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-border/60 shadow-sm overflow-hidden rounded-xl bg-card">
                <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4 flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {t('dashboard:quickActions')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 grid gap-2">
                    <Button variant="outline" className="justify-start gap-3 h-11 font-bold text-[10px] uppercase tracking-widest border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all group/btn rounded-xl" asChild>
                        <Link href={`/${locale}/post`}>
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover/btn:bg-primary group-hover/btn:text-white transition-colors">
                                <Plus className="h-3.5 w-3.5" />
                            </div>
                            {t('createListing:publish')}
                        </Link>
                    </Button>
                    <Button variant="outline" className="justify-start gap-3 h-11 font-bold text-[10px] uppercase tracking-widest border-border/60 hover:bg-success/5 hover:text-success hover:border-success/30 transition-all group/btn rounded-xl" asChild>
                        <Link href={`/${locale}/dashboard/promote`}>
                            <div className="p-1.5 rounded-lg bg-success/10 text-success group-hover/btn:bg-success group-hover/btn:text-white transition-colors">
                                <TrendingUp className="h-3.5 w-3.5" />
                            </div>
                            {t('dashboard:promoteListings')}
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="flex flex-col border-border/60 shadow-sm overflow-hidden h-full rounded-xl">
                <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4 flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {t('dashboard:activityFeed')}
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 hover:text-primary">
                        <Link href={`/${locale}/messages`}>{t('common:viewAll')}</Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-4 flex-1 overflow-auto max-h-[450px]">
                    <ActivityFeed />
                </CardContent>
            </Card>
        </motion.div>
    );
}
