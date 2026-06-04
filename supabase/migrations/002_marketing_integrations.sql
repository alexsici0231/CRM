create type integration_provider as enum ('meta_ads','google_ads','callrail','twilio','google_business');
create type integration_status as enum ('connected','missing_env','mock','error');
create type sync_status as enum ('success','warning','error');

create table if not exists integration_accounts (
  id uuid primary key default gen_random_uuid(),
  provider integration_provider not null,
  external_account_id text,
  label text not null,
  status integration_status not null default 'missing_env',
  last_sync_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(provider, external_account_id)
);

create table if not exists tracking_numbers (
  id uuid primary key default gen_random_uuid(),
  phone_number text not null unique,
  location app_location not null,
  source lead_source not null,
  provider integration_provider not null default 'callrail',
  label text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  provider integration_provider not null check (provider in ('meta_ads','google_ads')),
  external_campaign_id text not null,
  account_id text not null,
  campaign_name text not null,
  location report_location not null default 'both',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(provider, external_campaign_id)
);

create table if not exists ad_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  provider integration_provider not null check (provider in ('meta_ads','google_ads')),
  campaign_id uuid references ad_campaigns(id) on delete cascade,
  metric_date date not null,
  spend numeric not null default 0,
  impressions integer not null default 0,
  clicks integer not null default 0,
  leads integer not null default 0,
  booked_jobs integer not null default 0,
  revenue numeric not null default 0,
  raw_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(provider, campaign_id, metric_date)
);

create table if not exists lead_attribution (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  source lead_source not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_adset text,
  utm_ad text,
  gclid text,
  fbclid text,
  landing_page text,
  first_touch_at timestamptz,
  last_touch_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists integration_sync_logs (
  id uuid primary key default gen_random_uuid(),
  provider integration_provider not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status sync_status not null,
  records_imported integer not null default 0,
  message text not null,
  error_details jsonb not null default '{}'
);

create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider integration_provider not null,
  event_type text not null,
  external_id text,
  payload jsonb not null,
  processed boolean not null default false,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table integration_accounts enable row level security;
alter table tracking_numbers enable row level security;
alter table ad_campaigns enable row level security;
alter table ad_daily_metrics enable row level security;
alter table lead_attribution enable row level security;
alter table integration_sync_logs enable row level security;
alter table webhook_events enable row level security;

create policy "marketing_read_integration_accounts" on integration_accounts for select using (public.current_role() in ('owner','marketing_manager','admin'));
create policy "admin_manage_integration_accounts" on integration_accounts for all using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

create policy "marketing_read_tracking_numbers" on tracking_numbers for select using (public.current_role() in ('owner','marketing_manager','admin','shop_manager'));
create policy "marketing_manage_tracking_numbers" on tracking_numbers for all using (public.current_role() in ('marketing_manager','admin')) with check (public.current_role() in ('marketing_manager','admin'));

create policy "marketing_read_ad_campaigns" on ad_campaigns for select using (public.current_role() in ('owner','marketing_manager','admin'));
create policy "marketing_manage_ad_campaigns" on ad_campaigns for all using (public.current_role() in ('marketing_manager','admin')) with check (public.current_role() in ('marketing_manager','admin'));

create policy "marketing_read_ad_daily_metrics" on ad_daily_metrics for select using (public.current_role() in ('owner','marketing_manager','admin'));
create policy "marketing_manage_ad_daily_metrics" on ad_daily_metrics for all using (public.current_role() in ('marketing_manager','admin')) with check (public.current_role() in ('marketing_manager','admin'));

create policy "marketing_read_lead_attribution" on lead_attribution for select using (public.current_role() in ('owner','marketing_manager','admin'));
create policy "marketing_manage_lead_attribution" on lead_attribution for all using (public.current_role() in ('marketing_manager','admin')) with check (public.current_role() in ('marketing_manager','admin'));

create policy "marketing_read_sync_logs" on integration_sync_logs for select using (public.current_role() in ('owner','marketing_manager','admin'));
create policy "marketing_manage_sync_logs" on integration_sync_logs for all using (public.current_role() in ('marketing_manager','admin')) with check (public.current_role() in ('marketing_manager','admin'));

create policy "admin_read_webhook_events" on webhook_events for select using (public.current_role() in ('owner','admin'));
create policy "admin_manage_webhook_events" on webhook_events for all using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

insert into tracking_numbers (phone_number, location, source, provider, label)
values
('630-277-3663', 'channahon', 'google_ads', 'callrail', 'Channahon Google / CallRail'),
('815-641-4718', 'markham', 'meta_ads', 'callrail', 'Markham Meta / CallRail'),
('779-220-1180', 'channahon', 'peaty_tire', 'callrail', 'Peaty Tire referral')
on conflict (phone_number) do nothing;
