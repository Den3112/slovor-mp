import { MainLayout } from '@/widgets/main-layout'
import LoginPage from '@/app/[lang]/(auth)/login/page'

export default function AuthLoginPage() {
  return (
    <MainLayout>
      <LoginPage />
    </MainLayout>
  )
}
