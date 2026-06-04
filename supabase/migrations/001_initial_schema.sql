create extension if not exists "pgcrypto";

create type lead_source as enum ('meta_ads','google_ads','google_organic','google_maps','referral','repeat_client','peaty_tire','road_service','direct_call','other');
create type app_location as enum ('channahon','markham');
create type report_location as enum ('channahon','markham','both');
create type client_type as enum ('fleet','emergency','regular');
create type lead_status as enum ('new','contacted','in_progress','completed','lost','follow_up');
create type service_type as enum ('engine','brakes','suspension','electrical','tires','transmission','pm_service','diagnostics','exhaust','alignment','road_service','other');
create type job_status as enum ('scheduled','in_progress','waiting_parts','completed','invoiced','paid');
create type payment_method as enum ('cash','card','check','fleet_account','other');
create type contract_type as enum ('monthly','per_service','none');
create type fleet_status as enum ('active','inactive','prospect');
create type call_outcome as enum ('answered','missed','voicemail','converted');
create type review_platform as enum ('google','yelp','facebook','other');
create type app_role as enum ('owner','marketing_manager','shop_manager','admin');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role app_role not null default 'shop_manager',
  location app_location,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  source lead_source not null default 'other',
  call_tracking_number text,
  location app_location not null,
  client_type client_type not null default 'regular',
  status lead_status not null default 'new',
  assigned_to uuid references auth.users(id),
  truck_info text,
  service_requested text not null,
  estimated_value numeric,
  actual_value numeric,
  notes text,
  follow_up_date date,
  converted boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  created_at timestamptz not null default now(),
  location app_location not null,
  service_type service_type not null,
  status job_status not null default 'scheduled',
  technician_name text,
  start_date date not null,
  completion_date date,
  invoice_amount numeric,
  paid_amount numeric,
  payment_method payment_method,
  notes text not null default ''
);

create table if not exists fleet_clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text not null,
  phone text not null,
  email text,
  number_of_trucks integer,
  contract_type contract_type not null default 'none',
  monthly_value numeric,
  assigned_manager text,
  location_preference report_location not null default 'both',
  status fleet_status not null default 'prospect',
  notes text not null default '',
  created_at timestamptz not null default now(),
  last_service_date date
);

create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references leads(id) on delete set null,
  phone_from text not null,
  phone_to text not null,
  source lead_source not null,
  location app_location not null,
  duration_seconds integer,
  recording_url text,
  outcome call_outcome not null,
  notes text,
  handled_by text
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  platform review_platform not null,
  location text not null check (location in ('channahon','markham','general')),
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  content text not null,
  responded boolean not null default false,
  response_text text,
  responded_at timestamptz
);

create table if not exists monthly_reports (
  id uuid primary key default gen_random_uuid(),
  month date not null,
  location report_location not null,
  total_leads integer not null default 0,
  total_jobs_completed integer not null default 0,
  total_revenue numeric not null default 0,
  meta_ads_spend numeric,
  google_ads_spend numeric,
  cost_per_lead numeric,
  notes text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table leads enable row level security;
alter table jobs enable row level security;
alter table fleet_clients enable row level security;
alter table calls enable row level security;
alter table reviews enable row level security;
alter table monthly_reports enable row level security;

create or replace function public.current_role()
returns app_role language sql stable as $$
  select role from profiles where id = auth.uid()
$$;

create or replace function public.current_location()
returns app_location language sql stable as $$
  select location from profiles where id = auth.uid()
$$;

create policy "profiles_read_own_or_admin" on profiles for select using (id = auth.uid() or public.current_role() = 'admin');
create policy "admin_manage_profiles" on profiles for all using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

create policy "role_read_leads" on leads for select using (
  public.current_role() in ('owner','marketing_manager','admin')
  or location = public.current_location()
);
create policy "role_write_leads" on leads for all using (
  public.current_role() in ('marketing_manager','admin')
  or location = public.current_location()
) with check (
  public.current_role() in ('marketing_manager','admin')
  or location = public.current_location()
);

create policy "role_read_jobs" on jobs for select using (public.current_role() in ('owner','marketing_manager','admin') or location = public.current_location());
create policy "role_write_jobs" on jobs for all using (public.current_role() in ('admin','shop_manager') or location = public.current_location()) with check (public.current_role() in ('admin','shop_manager') or location = public.current_location());

create policy "manager_admin_all_fleet" on fleet_clients for all using (public.current_role() in ('owner','marketing_manager','admin')) with check (public.current_role() in ('marketing_manager','admin'));
create policy "role_read_calls" on calls for select using (public.current_role() in ('owner','marketing_manager','admin') or location = public.current_location());
create policy "role_write_calls" on calls for all using (public.current_role() in ('marketing_manager','admin','shop_manager')) with check (public.current_role() in ('marketing_manager','admin','shop_manager'));
create policy "role_read_reviews" on reviews for select using (public.current_role() in ('owner','marketing_manager','admin'));
create policy "role_write_reviews" on reviews for all using (public.current_role() in ('marketing_manager','admin')) with check (public.current_role() in ('marketing_manager','admin'));
create policy "role_read_reports" on monthly_reports for select using (public.current_role() in ('owner','marketing_manager','admin'));
create policy "role_write_reports" on monthly_reports for all using (public.current_role() in ('marketing_manager','admin')) with check (public.current_role() in ('marketing_manager','admin'));

insert into fleet_clients (company_name, contact_person, phone, email, number_of_trucks, contract_type, monthly_value, assigned_manager, location_preference, status, notes, last_service_date)
values
('Victory Truck & Trailer Inc', 'Vlad', '708-555-0188', 'dispatch@victorytruck.com', 18, 'monthly', 12000, 'Alexandru', 'channahon', 'active', 'Top-value fleet target.', current_date - interval '2 days'),
('TRS Express', 'Roman', '815-555-0244', 'ops@trsexpress.com', 9, 'per_service', 5500, 'Alexandru', 'markham', 'active', 'Growing account.', current_date - interval '8 days'),
('Blue Line Logistics', 'Marta', '630-555-0180', 'maintenance@blueline.com', 7, 'monthly', 7200, 'Iulian', 'channahon', 'active', 'Reliable payer.', current_date - interval '2 days'),
('River Road Transport', 'Eddie', '708-555-0110', 'service@riverroad.com', 6, 'per_service', 4100, 'Shop Manager', 'markham', 'prospect', 'Needs contract proposal.', null),
('Rapid Freight', 'Nate', '630-555-0200', 'dispatch@rapidfreight.com', 12, 'none', 9000, 'Alexandru', 'both', 'prospect', 'Potential monthly plan.', null);

insert into monthly_reports (month, location, total_leads, total_jobs_completed, total_revenue, meta_ads_spend, google_ads_spend, cost_per_lead, notes)
values
('2026-04-01', 'both', 58, 31, 87200, 4300, 5100, 162, 'Strong Google Maps month.'),
('2026-05-01', 'both', 64, 36, 96400, 4800, 5600, 162.5, 'Fleet pipeline improved.'),
('2026-06-01', 'both', 22, 11, 38400, 1600, 2100, 168, 'Month in progress.');
