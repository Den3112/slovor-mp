import { MainLayout } from '@/components/layout/main-layout'

export default async function ListingsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return <MainLayout lang={lang}>{children}</MainLayout>
}
