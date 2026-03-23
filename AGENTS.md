# AGENTS.md

> Навигационная карта проекта для ИИ-агентов. Поддерживайте этот файл в актуальном состоянии при изменении структуры.

## Обзор проекта
Slovor Marketplace — премиальный словацкий маркетплейс объявлений с дизайном "Customer CRM" (авангардная эстетика).

## Технологический стек
- **Язык:** TypeScript
- **Фреймворк:** Next.js 16 (App Router)
- **База данных:** Supabase (PostgreSQL)
- **Стили:** Tailwind CSS 4, Framer Motion

## Структура проекта
```
/
├── src/                    # Весь исходный код приложения
│   ├── app/                # Маршруты и страницы (App Router)
│   ├── components/         # UI компоненты
│   │   ├── features/       # Доменные модули (dashboard, listing, search)
│   │   └── ui/             # Базовые компоненты дизайн-системы
│   ├── hooks/              # Пользовательские React хуки
│   ├── lib/                # Общая логика, утилиты и сервисы
│   ├── types/              # Типы TypeScript
│   ├── constants/          # Константы проекта
│   ├── packages/           # Локальные пакеты (i18n и др.)
│   ├── __tests__/          # Юнит-тесты (Vitest)
│   ├── e2e/                # E2E тесты (Playwright)
│   └── middleware.ts       # Middleware приложения
├── public/                 # Статические ресурсы
├── supabase/               # Миграции и правила RLS
├── scripts/                # Служебные скрипты
├── docs/                   # Весь исходный код приложения
│   ├── actual/             # Актуальные руководства (Next.js 16, Media, Audit)
│   ├── audit/              # Технические отчеты и история проверок
│   └── (история и архивы вынесены в отдельную ветку docs)
└── config files            # Конфигурации в корне (package.json, tsconfig.json и др.)
```

## Ключевые точки входа
| Файл | Описание |
|------|----------|
| `src/app/[locale]/layout.tsx` | Корневой лейаут с поддержкой i18n |
| `src/proxy.ts` | Основной Middleware (переименован из middleware.ts) |
| `supabase/migrations/` | Схема базы данных и политики безопасности |

## Документация
| Документ | Путь | Описание |
|----------|------|----------|
| README | [README.md](file:///home/creator/PROJECTS/slovor-mp/README.md) | Главная страница проекта |
| Next.js 16 Patterns | [docs/actual/NEXT_JS_16_PATTERNS.md](file:///home/creator/PROJECTS/slovor-mp/docs/actual/NEXT_JS_16_PATTERNS.md) | Стандарты middleware и Edge Runtime |
| Media Dynamics | [docs/actual/IMAGE_OPTIMIZATION.md](file:///home/creator/PROJECTS/slovor-mp/docs/actual/IMAGE_OPTIMIZATION.md) | Оптимизация изображений на клиенте |
| Audit Compliance | [docs/actual/AUDIT_COMPLIANCE.md](file:///home/creator/PROJECTS/slovor-mp/docs/actual/AUDIT_COMPLIANCE.md) | Журнал исправлений аудита (P1-P3) |
| Audit Report | [docs/audit/REPORT.html](file:///home/creator/PROJECTS/slovor-mp/docs/audit/REPORT.html) | Оригинальный отчет об аудите |
| Ветка Docs | [github.com/docs](https://github.com/Den3112/slovor-mp/tree/docs) | Полная история и архив документации |

## Правила для агентов
- Все новые файлы создавать внутри `src/`.
- Использовать алиас `@/` для импортов из `src/`.
- Соблюдать правила из `.ai-factory/RULES.md`.
- Не объединять shell-команды через `&&` или `;`.
