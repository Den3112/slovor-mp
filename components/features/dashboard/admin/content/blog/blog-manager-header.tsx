import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n';
import { BlogManagerHeaderProps } from './types';

export function BlogManagerHeader({
    searchQuery,
    onSearchChange,
    onCreate,
}: BlogManagerHeaderProps) {
    const { t } = useTranslation(['common', 'admin']);

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder={t('admin:searchPosts')}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-12 h-11 rounded-xl bg-card border-border transition-all font-bold text-xs uppercase tracking-widest"
                />
            </div>
            <Button onClick={onCreate} className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-11 px-6">
                <Plus className="mr-2 h-4 w-4" /> {t('admin:newArticle')}
            </Button>
        </div>
    );
}
