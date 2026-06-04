# 365 Truck Repair CRM

Русскоязычная CRM-система для 365 Truck Repair: управление лидами, ремонтными работами, fleet-клиентами, звонками, отзывами и отчетами по двум локациям в Illinois.

## Что внутри

- Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Recharts.
- Страницы: `/dashboard`, `/leads`, `/leads/[id]`, `/jobs`, `/fleet`, `/calls`, `/reviews`, `/reports`, `/settings`.
- Роли: владелец, маркетинг-менеджер, менеджер сервиса, администратор.
- Локации: Channahon `630-277-3663`, Markham `815-641-4718`, Peaty Tire как источник кросс-рекомендаций.
- Supabase PostgreSQL миграция с таблицами, enum-типами, RLS-политиками и seed-данными.
- Typed Supabase client, бизнес-логика атрибуции лидов, follow-up очереди, пропущенных звонков и расчета выручки.
- Twilio-заглушки для SMS и запросов отзывов.
- Рабочий демо-режим через `localStorage`: добавление лидов, создание работ, fleet-клиентов, изменение статусов, обработка пропущенных звонков и ответы на отзывы без внешней базы.
- Переключение ролей в интерфейсе: владелец и администратор видят все, shop manager видит свою локацию.
- Центр внимания: missed calls, follow-up на сегодня, unpaid jobs и отзывы без ответа.
- Marketing dashboard `/marketing` с mock/live-ready метриками Meta Ads, Google Ads, CallRail tracking numbers, CPL и ROAS.
- API endpoints для будущих sync jobs и webhooks.

## Интеграции

Подробный чеклист находится в `docs/integrations.md`.

Подготовлены endpoints:

- `GET /api/integrations/health`
- `GET|POST /api/integrations/meta/sync`
- `GET|POST /api/integrations/google-ads/sync`
- `GET|POST /api/integrations/callrail/sync`
- `GET|POST /api/integrations/google-business/sync`
- `GET /api/integrations/marketing-summary`
- `POST /api/integrations/twilio/send-sms`
- `POST /api/webhooks/callrail`
- `POST /api/webhooks/twilio`

## Запуск

```bash
npm install
npm run dev
```

Открой `http://localhost:3000`.

## Проверки

```bash
npm run lint
npm run build
npm audit --audit-level=moderate
```

В PowerShell на Windows может быть заблокирован `npm.ps1`. Тогда используй:

```bash
npm.cmd run lint
npm.cmd run build
```

## Переменные окружения

Скопируй `.env.local.example` в `.env.local` и заполни:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
CALLRAIL_API_KEY=
```

## Supabase

Миграция находится в `supabase/migrations/001_initial_schema.sql`.

Она создает:

- `profiles`
- `leads`
- `jobs`
- `fleet_clients`
- `calls`
- `reviews`
- `monthly_reports`

## Что можно добавить дальше

- Заменить `localStorage`-операции на реальные Supabase queries.
- Подключить Supabase Auth вместо демо-переключателя ролей.
- Подключить CallRail API для автоматического импорта звонков.
- Подключить Twilio API для реальных SMS follow-up и review requests.
- Добавить drag-and-drop для kanban-доски работ.
- Экспорт отчетов в PDF через серверный генератор вместо `window.print()`.
- CI/CD pipeline на GitHub Actions: lint, build, audit.

## Что можно убрать позже

- Старый архив `Kimi_Agent_универсальная CRM.zip`, если он больше не нужен в репозитории.
- Неиспользуемые shadcn/ui компоненты, если проект останется компактным.
- Demo seed-данные после подключения реальной базы.
