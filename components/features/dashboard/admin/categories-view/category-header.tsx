import { Layers, Plus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { CategoryHeaderProps } from './types';

export function CategoryHeader({ onAdd }: CategoryHeaderProps) {
    const { t } = useTranslation(['admin']);

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase flex items-center gap-3">
                    <Layers className="h-8 w-8 text-primary" strokeWidth={2.5} />
                    {t('admin:categories') || 'Categories'}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {t('admin:manageMarketplaceTaxonomy') || 'Manage marketplace taxonomy and structure'}
                </p>
            </div>
            <Button
                onClick={onAdd}
                className="rounded-xl h-11 px-6 font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
            >
                <Plus className="mr-2 h-4 w-4" strokeWidth={2.5} />
                {t('admin:addCategory') || 'Add Category'}
            </Button>
        </div>
    );
}
