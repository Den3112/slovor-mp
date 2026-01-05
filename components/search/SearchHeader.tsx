'use client'

import { useTranslation } from '@/lib/i18n'
import { Container } from '@/components/ui/container'

interface SearchHeaderProps {
    query?: string
}

export function SearchHeader({ query }: SearchHeaderProps) {
    const { t } = useTranslation()

    return (
        <div className="border-b bg-card py-8">
            <Container>
                <h1 className="mb-2 text-3xl font-black text-foreground">
                    {query
                        ? `${t.common.searchResultsFor} "${query}"`
                        : t.common.allListings}
                </h1>
            </Container>
        </div>
    )
}
