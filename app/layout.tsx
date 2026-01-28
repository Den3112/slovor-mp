import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Slovor Marketplace',
    description: 'The modern marketplace for Slovakia.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html>
            <body>{children}</body>
        </html>
    )
}
