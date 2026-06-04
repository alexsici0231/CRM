# CRM Integrations Checklist

Этот проект уже содержит каркас интеграций: API routes, mock adapters, Supabase tables, tracking numbers, sync logs и marketing dashboard.

## Meta Ads

Нужно добавить в `.env.local`:

```env
META_ACCESS_TOKEN=
META_AD_ACCOUNT_ID=act_...
META_BUSINESS_ID=
```

Что подготовлено:

- `src/lib/integrations/meta-ads.ts`
- `GET/POST /api/integrations/meta/sync`
- таблицы `integration_accounts`, `ad_campaigns`, `ad_daily_metrics`, `integration_sync_logs`

Следующий live-шаг: заменить mock response на запрос к Meta Marketing API Insights.

## Google Ads

Нужно добавить:

```env
GOOGLE_ADS_CUSTOMER_ID=
GOOGLE_ADS_MANAGER_CUSTOMER_ID=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_REFRESH_TOKEN=
```

Что подготовлено:

- `src/lib/integrations/google-ads.ts`
- `GET/POST /api/integrations/google-ads/sync`
- campaign metrics schema

Следующий live-шаг: подключить Google Ads API client и импортировать campaign spend, clicks, conversions.

## CallRail

Нужно добавить:

```env
CALLRAIL_API_KEY=
CALLRAIL_ACCOUNT_ID=
CALLRAIL_COMPANY_ID=
```

Что подготовлено:

- `src/lib/integrations/callrail.ts`
- `GET/POST /api/integrations/callrail/sync`
- `POST /api/webhooks/callrail`
- `tracking_numbers`
- `webhook_events`

Следующий live-шаг: добавить CallRail signature validation и импорт звонков в `calls`.

## Twilio

Нужно добавить:

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_MESSAGING_SERVICE_SID=
```

Что подготовлено:

- `POST /api/integrations/twilio/send-sms`
- `POST /api/webhooks/twilio`
- `src/lib/twilio.ts`

Следующий live-шаг: заменить stub на официальный Twilio SDK или REST call и включить signature validation.

## Google Business Profile

Нужно добавить:

```env
GOOGLE_BUSINESS_ACCOUNT_ID=
GOOGLE_BUSINESS_LOCATION_IDS=
GOOGLE_BUSINESS_REFRESH_TOKEN=
```

Что подготовлено:

- `src/lib/integrations/google-business.ts`
- `GET/POST /api/integrations/google-business/sync`

Следующий live-шаг: импортировать reviews и performance metrics.

## Marketing Dashboard

Страница:

```text
/marketing
```

Сейчас показывает mock/live-ready данные:

- spend;
- leads;
- CPL;
- booked jobs;
- cost per booked job;
- ROAS;
- revenue by source;
- campaign performance;
- tracking numbers;
- integration checklist.

## Production Notes

- Все секреты хранить только в Vercel/Supabase env, не коммитить `.env.local`.
- Webhooks должны проверять подписи CallRail/Twilio.
- Sync endpoints лучше запускать через Vercel Cron или GitHub Actions schedule.
- Для live Supabase заменить localStorage demo layer на database queries.
