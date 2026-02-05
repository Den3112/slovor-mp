import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BottomTabBar } from '@/components/layout/bottom-tab-bar'
import { Suspense } from 'react'
import { PullToRefresh } from '@/components/ui/pull-to-refresh'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Suspense
                fallback={
                    <div className="bg-background h-16 border-b border-border" />
                }
            >
                <Header />
            </Suspense>
            <main className="flex-1 pb-16 md:pb-0">
                <PullToRefresh>
                    {children}
                </PullToRefresh>
            </main>
            <BottomTabBar />
            <Footer />
        </div>
    )
}
