# 🧪 Тестирование Slovor Marketplace

## Unit тесты (Vitest)

### Запуск тестов

```bash
# Запустить все тесты
npm run test

# Запустить тесты один раз
npm run test:run

# Запустить с покрытием
npm run test:coverage
```

### Структура тестов

```
lib/api/__tests__/
└── api.test.ts          # Тесты API функций
```

### Написание тестов

```typescript
import { describe, it, expect } from 'vitest'
import { listingsApi } from '@/lib/api/listings'

describe('Listings API', () => {
  it('should fetch listings', async () => {
    const result = await listingsApi.getAll()
    expect(result.error).toBeNull()
  })
})
```

## E2E тесты (Playwright)

### Установка

```bash
npm install -D @playwright/test
npx playwright install
```

### Запуск тестов

```bash
# Запустить все E2E тесты
npx playwright test

# Запустить в UI режиме
npx playwright test --ui

# Запустить конкретный файл
npx playwright test e2e/critical-flows.spec.ts

# Запустить в headed режиме (видимый браузер)
npx playwright test --headed
```

### Структура E2E тестов

```
e2e/
├── critical-flows.spec.ts    # Основные пользовательские сценарии
└── dashboard.spec.ts         # Тесты Dashboard
```

### Написание E2E тестов

```typescript
import { test, expect } from '@playwright/test'

test('should load homepage', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
})
```

## Покрытие кода

После запуска `npm run test:coverage` отчет будет доступен в:
- `coverage/index.html` - HTML отчет
- `coverage/coverage-final.json` - JSON данные

## CI/CD

Тесты автоматически запускаются при:
- Push в main/develop ветки
- Pull Request

### GitHub Actions

```yaml
- name: Run tests
  run: npm run test:run

- name: Run E2E tests
  run: npx playwright test
```

## Лучшие практики

### Unit тесты
- ✅ Тестируйте чистые функции
- ✅ Мокайте внешние зависимости
- ✅ Один тест = одна проверка
- ✅ Используйте описательные имена

### E2E тесты
- ✅ Тестируйте критические пользовательские сценарии
- ✅ Используйте data-testid для стабильности
- ✅ Избегайте зависимости от конкретного текста
- ✅ Проверяйте на разных устройствах

## Отладка

### Vitest
```bash
# Запустить в watch режиме
npm run test

# Запустить конкретный тест
npm run test -- api.test.ts
```

### Playwright
```bash
# Открыть Playwright Inspector
npx playwright test --debug

# Сохранить trace
npx playwright test --trace on
```

## Проблемы и решения

### Тесты падают локально
1. Убедитесь, что dev сервер запущен (`npm run dev`)
2. Проверьте переменные окружения (`.env.local`)
3. Очистите кеш: `rm -rf .next`

### E2E тесты нестабильны
1. Добавьте `waitForTimeout` где нужно
2. Используйте `data-testid` вместо текста
3. Проверьте сетевые запросы

---

**Цель покрытия**: 80%+
**Текущее покрытие**: Запустите `npm run test:coverage`
