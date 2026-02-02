import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BottomTabBar } from '@/components/layout/bottom-tab-bar'
import { Suspense } from 'react'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Suspense
                fallback={
                    <div className="bg-background/80 h-16 border-b border-white/5 backdrop-blur-md" />
                }
            >
                <Header />
            </Suspense>
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <BottomTabBar />
            <Footer />
        </div>
    )
}
