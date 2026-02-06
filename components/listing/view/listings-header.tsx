import { Search } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { SaveSearchButton } from '../save-search-button';
import { useTranslation } from '@/lib/i18n';
import { ListingsHeaderProps } from './types';

export function ListingsHeader({ searchQuery, totalCount, filters }: ListingsHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="relative mb-8 overflow-hidden border-b border-white/5 pt-24 pb-10 md:mb-12 md:pt-32 md:pb-16">
            <div className="bg-primary/5 absolute inset-0 z-0" />

            <Container>
                <div className="relative z-10 flex flex-col gap-4 md:gap-8">
                    <div className="border-primary/20 bg-primary/10 text-primary inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase">
                        <Search className="h-3.5 w-3.5" />
                        {t('common:explorer') || 'Explorer'}
                    </div>

                    <Breadcrumbs
                        items={[
                            {
                                label: searchQuery
                                    ? `${t('common:search')}: ${searchQuery}`
                                    : t('common:allListings'),
                            },
                        ]}
                    />

                    <h1 className="font-heading text-foreground max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
                        {searchQuery
                            ? `${t('common:search')}: ${searchQuery}`
                            : t('common:allListings')}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="text-muted-foreground flex items-center gap-3 text-lg font-medium md:text-xl">
                            <span className="font-heading text-foreground font-bold">
                                {totalCount}
                            </span>
                            {totalCount === 1
                                ? t('common:listings').slice(0, -1)
                                : t('common:listings')}{' '}
                            {t('common:found')}
                        </p>
                        <div className="bg-border mx-2 hidden h-6 w-px md:block" />
                        <SaveSearchButton
                            filters={filters || {}}
                            searchQuery={searchQuery}
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
}
