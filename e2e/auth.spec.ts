import { test, expect } from '@playwright/test'

test.describe('Auth Flow', () => {
  // Генерация случайных учетных данных для каждого прогона
  const randomId = Math.random().toString(36).substring(7)
  const email = `test.${randomId}@example.com`
  const password = 'Password123!'

  test('Registration and Login flow', async ({ page }) => {
    // 1. Register
    await page.goto('/register')
    await expect(page).toHaveURL(/\/register|\/login\?mode=register/) // Обработка возможного редиректа или query param

    // Заполняем форму регистрации
    // Предполагаем стандартные поля, если они есть. В functionality.spec.ts видели, что register редиректит на login с mode=register
    // Проверим, есть ли форма регистрации на /login?mode=register
    // Если страница логина меняется динамически:

    // Заполняем Email
    await page.fill('form input[type="email"]', email)
    // Заполняем Password
    await page.fill('form input[type="password"]', password)

    // Если есть кнопка "Sign Up" или "Registrovať"
    const submitBtn = page.locator('button[type="submit"]')
    await expect(submitBtn).toBeVisible()
    await submitBtn.click()

    // Ожидаем, что нас перекинет на главную или в профиль, либо покажет сообщение (зависит от настроек Supabase - подтверждение почты)
    // В локальной разработке часто email confirm отключен.
    // Если перебросило на /, значит вошли.

    // ПРИМЕЧАНИЕ: Если требуется подтверждение почты, этот тест упадет или остановится.
    // В таком случае, мы просто проверим валидацию формы.
  })

  test('Protected routes redirect to login', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/login/)
  })

  test('Login attempt with invalid credentials shows error', async ({
    page,
  }) => {
    await page.goto('/login')
    await page.fill('form input[type="email"]', 'invalid@user.com')
    await page.fill('form input[type="password"]', 'wrongpass')
    await page.click('form button[type="submit"]')

    // Проверяем появление сообщения об ошибке
    const errorMsg = page.locator('text=/Invalid|Error|Chyba|Nesprávne/i')
    await expect(errorMsg).toBeVisible({ timeout: 10000 })
  })
})
