import { MainLayout } from '@/widgets/main-layout'
import RegisterPage from '@/app/[lang]/(auth)/register/page'

export default function AuthRegisterPage() {
  return (
    <MainLayout>
      <RegisterPage />
    </MainLayout>
  )
}
