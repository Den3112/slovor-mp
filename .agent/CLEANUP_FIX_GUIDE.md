# 🛠️ Post-Cleanup Fix Instructions

> **Вниманию ИИ-агента**: Проведена "генеральная уборку". Некоторые пути изменились. Нужно пройтись по проекту и поправить импорты.

## 🔄 Изменения путей

| Было | Стало | Почему |
|------|-------|--------|
| `hooks/` | `lib/hooks/` | Консолидация хуков в одном месте |
| `components/profile/` | `components/seller-profile/` | Чтобы не путать с `/dashboard/` |
| `components/ui/*.stories.tsx` | `stories/ui/` | Все истории в одной папке |

## 🎯 Что нужно сделать (Твои задачи)

### 1. Поправить хуки
- Найди все `import { ... } from '@/hooks/...'`
- Замени на `import { ... } from '@/lib/hooks/...'`
- Проверь файл `lib/hooks/index.ts`, возможно туда нужно добавить экспорт `useListingSearch`.

### 2. Поправить Seller Profile
- Найди импорты из `@/components/profile/...`
- Замени на `@/components/seller-profile/...`

### 3. Проверить Storybook (если нужно)
- Пути к компонентам внутри `stories/ui/*.stories.tsx` теперь на уровень глубже.
- Поправь импорты компонентов внутри историй.

### 4. Верификация
- Запусти `npm run verify` (или `tsc --noEmit`), чтобы найти все битые импорты.
- Исправь их.

---

## 🧹 Удалено (Хлам)
- Логи: `dev_server.log`, `server.log`
- Старые доки: `docs/archive`, `scripts/archive-scripts`
- Дубликаты скриптов: `.js` (оставлены `.ts`), удален `.ps1`.
- Лишние конфиги: `.clinerules`, `.cursorrules`, `Dockerfile.dev`.
- Storybook Boilerplate: `Button.tsx`, `Header.tsx`, `Page.tsx` в папке `stories`.
