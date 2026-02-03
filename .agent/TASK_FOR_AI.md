# ⚡ Задача для AI: Завершить Premium Redesign

> **Приоритет**: 🔴 HIGH
> **Время**: ~2-3 часа
> **Цель**: Запушить `dev` и создать PR в `main`

---

## 🎯 Что делать (по порядку)

### 1️⃣ Синхронизация Git (30 мин)

```bash
cd /home/creator/slovor-mp
git checkout dev
git status  # Проверить что на dev, чисто

# Запушить текущие изменения
git push origin dev --force-with-lease

# Проверить открытые PR
gh pr list --state open
```

**Решение для конфликтующих веток**:
- `feature/listing-refinement (PR #30)` - проверь описание PR, если там нужные фичи - cherry-pick
- Остальные feature-ветки (fix-build-warnings, next16-upgrade, project-cleanup) - скорее всего устарели, можно игнорировать

### 2️⃣ Фаза 7: Monetization (1-2 часа)

**Читать**:
- `.agent/plans/ADVANCED_FEATURES_GUIDE.md` → раздел "Monetization Features"
- `.agent/plans/ARCHITECTURE_BLUEPRINT.md` → Page 26-28

**Создать/Обновить**:

#### A) Promotion Page
**Файл**: `/app/[locale]/(dashboard)/dashboard/promote/page.tsx`

```tsx
// Pricing cards: Free, Standard (₽299/мес), Premium (₽799/мес)
// Features list для каждого плана
// CTA кнопки "Choose Plan"
// Стиль: Solid backgrounds, rounded-xl cards, NO gradients
```

#### B) Transaction History
**Файл**: `/components/features/dashboard/user/wallet-view.tsx`

Добавить:
```tsx
// Таблица транзакций с колонками:
// - Date
// - Type (deposit/withdrawal/promotion)
// - Amount
// - Status (completed/pending/failed)
// - Badge для статуса (success/warning/destructive)
```

#### C) Translations
Добавить переводы в:
- `/packages/i18n/locales/ru/dashboard.json`
- `/packages/i18n/locales/en/dashboard.json`

**Коммит**:
```bash
git add .
git commit -m "feat(monetization): add promotion page and transaction history"
git push origin dev
```

---

### 3️⃣ Верификация (30 мин)

```bash
# 1. Lint + Build
npm run verify
# Если ошибки - исправь

# 2. Проверить переводы (нет hardcoded текста)
grep -rn "Dashboard\|Settings\|Profile" app/ components/ | grep -v ".json" | grep -v "t("
# Если найдены - обернуть в t()

# 3. Visual Check
npm run dev
# Открыть http://localhost:3000
# Переключить dark mode
# Проверить mobile view (F12 → 375px)
# Пройтись по всем новым страницам

# 4. E2E тесты (опционально, если не заняты)
npm run test:e2e

# 5. Финальный коммит
git add .
git commit -m "chore: final verification and translation fixes"
git push origin dev
```

---

### 4️⃣ Создать PR (10 мин)

```bash
gh pr create --base main --head dev \
  --title "feat: Premium Redesign - Complete Customer CRM Style Implementation" \
  --body "
## 📊 Summary
Complete implementation of Premium Redesign following Customer CRM aesthetic principles.

## ✅ What's Included

### Design System
- ✅ Solid, Clean, Data-Dense aesthetic (NO blur, NO gradients)
- ✅ CSS variables system (light + dark mode)
- ✅ Google Fonts: DM Sans, Space Grotesk, JetBrains Mono

### Architecture (41 pages total)
- ✅ URL restructure: \`profile/\` → \`dashboard/\`
- ✅ Mobile navigation (Bottom Tab Bar)
- ✅ Unified Sidebar with sections
- ✅ Clean Header with search

### Features
- ✅ User Dashboard (Overview, Listings, Orders, Reviews, Wallet)
- ✅ Admin Dashboard (Overview, Users, Moderation)
- ✅ Trust & Safety (Verification, Reports)
- ✅ Monetization (Promotion plans, Transactions)
- ✅ Dark mode fully supported
- ✅ Mobile responsive (375px+)

## 🧪 Verification
- ✅ \`npm run verify\` - passed
- ✅ Dark mode tested on all pages
- ✅ Mobile view tested
- ✅ All translations updated

## 📚 Documentation
See \`.agent/IMPLEMENTATION_STATUS.md\` for detailed status.
See \`.agent/plans/REDESIGN_INSTRUCTIONS.md\` for implementation guide.

## 🔗 Related
Closes Phase 1-8 of Premium Redesign plan.
"
```

---

## 🚨 Критические Правила

1. **ВСЕГДА** проверять `npm run verify` перед push
2. **НЕ использовать**: `backdrop-blur`, `bg-gradient`, `shadow-2xl`, `rounded-3xl`
3. **Все тексты** должны быть через `t()` для i18n
4. **Dark mode** проверять на КАЖДОЙ странице
5. **Mobile view** (375px) должен работать

---

## 📖 Документация

Если что-то непонятно, читай:
1. `.agent/IMPLEMENTATION_STATUS.md` - общий статус
2. `.agent/plans/REDESIGN_INSTRUCTIONS.md` - полный гайд (603 строки)
3. `.agent/plans/ADVANCED_FEATURES_GUIDE.md` - детали по монетизации
4. `.agent/MEMORY.md` - правила проекта

---

## ✅ Готово когда:

- [ ] `git push origin dev` успешно
- [ ] PR создан (dev → main)
- [ ] `npm run verify` проходит
- [ ] Dark mode работает
- [ ] Mobile view корректный
- [ ] Все тексты через t()

**Результат**: PR готов к review и merge в main 🚀
