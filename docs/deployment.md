# Deployment Checklist

## Local

```bash
npm install
npm.cmd run lint
npm.cmd run build
npm.cmd audit --audit-level=moderate
```

## Vercel

1. Import GitHub repository `alexsici0231/CRM`.
2. Framework preset: Next.js.
3. Build command: `npm run build`.
4. Add all required env variables from `.env.local.example`.
5. Deploy.

## Supabase

Run migrations:

```text
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_marketing_integrations.sql
```

Then create users in Supabase Auth and matching `profiles` rows.

## Cron Jobs

Recommended scheduled syncs:

- hourly: `/api/integrations/callrail/sync`
- daily: `/api/integrations/meta/sync`
- daily: `/api/integrations/google-ads/sync`
- daily: `/api/integrations/google-business/sync`

## Required Security Before Production

- Enable Supabase Auth.
- Replace localStorage demo writes with Supabase writes.
- Add webhook signature validation.
- Add rate limiting for webhook and sync endpoints.
- Keep service role key server-side only.
