# 📋 Текущие задачи: Ревизия архитектуры

> **Статус**: Фаза 5 в процессе (Редизайн страниц)
> См. `.agent/README.md` для полного порядка выполнения

---

## Фаза 1: Реструктуризация URL ✅
- [x] Переименовать `app/[locale]/(main)/profile/` → `dashboard/`
- [x] Переместить `messages/` в корень (top-level route)
- [x] Переместить `favorites/` в корень (top-level route)
- [x] Добавить редиректы в `next.config.ts`
- [x] Обновить все внутренние ссылки
- [x] Обновить E2E и Unit тесты
- [x] Обновить триггеры уведомлений в БД

## Фаза 2: Мобильная навигация ✅
- [x] Создать `components/layout/bottom-tab-bar.tsx`
- [x] Интегрировать в основной макет

## Фаза 3: Боковая панель (Sidebar) ✅
- [x] Добавить заголовки групп (MAIN, ACTIVITY, QUICK ACCESS)
- [x] Добавить разделители

## Фаза 4: Шапка (Header) ✅
- [x] Интегрировать строку поиска
- [x] Добавить быстрые действия
## Фаза 5: Редизайн страниц (Solid Aesthetic) ✅
- [x] Применить эстетику "Solid, Clean, Data-Dense" ко всем страницам
- [x] Dashboard Layout & Shell (Solid background)
- [x] User Overview
- [x] Admin Overview
- [x] User Listings
- [x] Messages Layout
- [x] Favorites View
- [x] Settings & Verification Views

## Фаза 6: Доверие и безопасность
- [ ] Значки верификации
- [ ] Система жалоб (Report system)

## Фаза 7: Монетизация
- [ ] Страница продвижения
- [ ] Кошелек (Wallet)

## Фаза 8: Верификация
- [x] `npm run verify`
- [ ] E2E тесты

## Фаза 9: Переключение тем (Опционально)
- [ ] Согласно `design-system/THEME_SWITCHING.md`
