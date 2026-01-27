# 🗺️ Roadmap: Slovor Marketplace

Состояние проекта на 26.01.2026. На базе **Мастер-плана** и текущего прогресса рефакторинга.

## 🟢 1. База Данных и API (Основа)
- [x] Рефакторинг `listings` (is_promoted, views_count).
- [x] Рефакторинг `reviews` (author_id, recipient_id).
- [x] Добавление таблиц `transactions`, `blog_posts`, `static_pages`, `listing_reports`.
- [x] Обновление TypeScript типов в `lib/types/database.ts`.
- [x] Реализация API сервисов для новых сущностей (`blogApi`, `transactionsApi`, `reportsApi`).

## � 2. Личный Кабинет (Profile)
- [x] Навигация (BottomNavBar) согласно плану.
- [x] Sidebar и макет (Layout) ЛК.
- [x] Страница "Мои объявления" (рефакторинг роутов).
- [x] Отзывы и Рейтинг (`SellerRating` компонент).
- [x] Статистика (Dashboard) — Реализовано.
- [x] Верификация профиля (Client side).
- [x] История платежей (Кошелек и транзакции).

## � 3. Админ-панель (Admin)
- [x] Макет (Layout) и Sidebar для админов.
- [x] Модерация объявлений и Логирование действий.
- [x] Управление пользователями (роли, бан, верификация).
- [x] Управление контентом (Контент-хаб: Блог, Категории).
- [x] Модерация жалоб (Reports).
- [x] Проверка личностей (Identity Checks / Verifications).

## 🟡 4. Дополнительно (Content)
- [x] Блог и Новости (Инфраструктура и Админка).
- [x] Форма жалобы на объявление.
- [x] Статические страницы (About, FAQ) — Управление реализовано.
- [x] SEO Оптимизация и Мета-теги (Metadata, OG Images).
- [x] Интеграция Stripe (Checkout & Webhooks).
- [x] Механика платного продвижения (Highlighed listings).

## 🟢 6. Real-time & Polish (Done)
- [x] Система уведомлений (База, API, UI).
- [x] Real-time чат 2.0 (Read receipts, Typing, Presence).
- [x] Динамические бейджи (Unread messages/notifications).
- [x] SEO и интернационализация чата.

## 🟢 7. Final Polish (Done)
- [x] Сквозное E2E тестирование основного флоу (Playwright).
- [x] Тестирование Real-time (Chat, Presence, Notifications).
- [x] Оптимизация производительности (Проверка Core Web Vitals).
- [x] Исправление мобильного UX (Input, Scroll).

## 🟢 8. Production Ready (In Progress)
- [x] Финальный аудит безопасности (RLS policies) - **Done**.
- [x] Автоматизация уведомлений (Postgres Triggers) - **Done**.
- [x] Интеграция уведомлений в Webhooks - **Done**.
- [ ] Финальная проверка всех метаданных.
- [ ] Окончательный мердж в `main` и деплой.

---

### Текущий статус:
Монетизация (Stripe) и SEO база полностью внедрены. Проект переходит в фазу полировки Real-time функционала (Чат, Уведомления) и финального тестирования.
