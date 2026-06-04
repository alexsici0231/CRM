'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BarChart2, LayoutDashboard, Phone, Settings, Star, Truck, Users, Wrench } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  activeUser,
  calls as seedCalls,
  fleetClients as seedFleetClients,
  jobs as seedJobs,
  leads as seedLeads,
  monthlyReports,
  reviews as seedReviews,
  users,
} from '@/lib/sample-data';
import { applyLeadAttribution, getFollowUpsDueToday, getRecentMissedCalls, monthlyRevenue } from '@/lib/business-logic';
import { sendReviewRequest, sendSmsNotification } from '@/lib/twilio';
import type {
  AppUser,
  Call,
  FleetClient,
  FleetStatus,
  Job,
  JobStatus,
  Lead,
  LeadSource,
  LeadStatus,
  Location,
  PaymentMethod,
  Review,
  ServiceType,
} from '@/types/database';

type PageKey = 'dashboard' | 'leads' | 'lead-detail' | 'jobs' | 'fleet' | 'calls' | 'reviews' | 'reports' | 'settings';
type Activity = { id: string; created_at: string; text: string; tone: 'info' | 'success' | 'warning' | 'danger' };
type CrmData = { leads: Lead[]; jobs: Job[]; fleetClients: FleetClient[]; calls: Call[]; reviews: Review[]; activeUserId: string; activities: Activity[] };

const storageKey = '365-truck-repair-crm-data-v2';
const nav = [
  { href: '/dashboard', key: 'dashboard', label: 'Панель', icon: LayoutDashboard },
  { href: '/leads', key: 'leads', label: 'Лиды', icon: Users },
  { href: '/jobs', key: 'jobs', label: 'Работы', icon: Wrench },
  { href: '/fleet', key: 'fleet', label: 'Автопарки', icon: Truck },
  { href: '/calls', key: 'calls', label: 'Звонки', icon: Phone },
  { href: '/reviews', key: 'reviews', label: 'Отзывы', icon: Star },
  { href: '/reports', key: 'reports', label: 'Отчеты', icon: BarChart2 },
] as const;

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
  follow_up: 'bg-purple-100 text-purple-700',
  missed: 'bg-red-100 text-red-700',
  answered: 'bg-green-100 text-green-700',
  converted: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  active: 'bg-green-100 text-green-700',
  prospect: 'bg-blue-100 text-blue-700',
  inactive: 'bg-slate-100 text-slate-700',
  scheduled: 'bg-blue-100 text-blue-700',
  waiting_parts: 'bg-amber-100 text-amber-700',
  invoiced: 'bg-purple-100 text-purple-700',
};

const statusLabel: Record<string, string> = {
  new: 'Новый',
  contacted: 'Связались',
  in_progress: 'В работе',
  completed: 'Завершено',
  lost: 'Потерян',
  follow_up: 'Повторный контакт',
  missed: 'Пропущен',
  answered: 'Ответили',
  voicemail: 'Голосовая почта',
  converted: 'Конвертирован',
  paid: 'Оплачено',
  active: 'Активный',
  prospect: 'Потенциальный',
  inactive: 'Неактивный',
  scheduled: 'Запланировано',
  waiting_parts: 'Ожидает запчасти',
  invoiced: 'Счет выставлен',
};

const sourceLabel: Record<LeadSource, string> = {
  meta_ads: 'Meta',
  google_ads: 'Google Ads',
  google_organic: 'Органика',
  google_maps: 'Google Maps',
  referral: 'Рекомендация',
  repeat_client: 'Повторный клиент',
  peaty_tire: 'Peaty Tire',
  road_service: 'Road Service',
  direct_call: 'Прямой звонок',
  other: 'Другое',
};

const serviceLabel: Record<ServiceType, string> = {
  engine: 'Двигатель',
  brakes: 'Тормоза',
  suspension: 'Подвеска',
  electrical: 'Электрика',
  tires: 'Шины',
  transmission: 'Трансмиссия',
  pm_service: 'PM сервис',
  diagnostics: 'Диагностика',
  exhaust: 'Выхлоп',
  alignment: 'Развал-схождение',
  road_service: 'Выездной сервис',
  other: 'Другое',
};

const locationLabel: Record<Location, string> = { channahon: 'Channahon', markham: 'Markham' };
const roleLabel: Record<string, string> = {
  owner: 'Владелец',
  marketing_manager: 'Маркетинг',
  shop_manager: 'Менеджер сервиса',
  admin: 'Администратор',
};

const leadStatuses: LeadStatus[] = ['new', 'contacted', 'in_progress', 'completed', 'follow_up', 'lost'];
const jobStatuses: JobStatus[] = ['scheduled', 'in_progress', 'waiting_parts', 'completed', 'invoiced', 'paid'];
const leadSources = Object.keys(sourceLabel) as LeadSource[];
const serviceTypes = Object.keys(serviceLabel) as ServiceType[];

function initialData(): CrmData {
  return {
    leads: seedLeads,
    jobs: seedJobs,
    fleetClients: seedFleetClients,
    calls: seedCalls,
    reviews: seedReviews,
    activeUserId: activeUser.id,
    activities: [
      { id: 'a1', created_at: new Date().toISOString(), text: 'CRM готова к работе: лиды, работы, звонки и отзывы загружены.', tone: 'success' },
    ],
  };
}

function useCrmData() {
  const [data, setData] = useState<CrmData>(() => {
    if (typeof window === 'undefined') return initialData();
    const saved = window.localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) as CrmData : initialData();
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  const log = (text: string, tone: Activity['tone'] = 'info') => {
    setData((current) => ({
      ...current,
      activities: [{ id: crypto.randomUUID(), created_at: new Date().toISOString(), text, tone }, ...current.activities].slice(0, 40),
    }));
  };

  return { data, setData, log };
}

function money(value: number | null | undefined) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge ${tone || 'bg-slate-100 text-slate-700'}`}>{children}</span>;
}

function Card({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="font-black">{value}</p></div>;
}

function Button({ children, onClick, variant = 'primary', type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger'; type?: 'button' | 'submit' }) {
  const styles = variant === 'primary' ? 'bg-[#1F4E79] text-white' : variant === 'danger' ? 'bg-red-600 text-white' : 'border bg-white text-slate-800';
  return <button type={type} onClick={onClick} className={`rounded-lg px-4 py-2 text-sm font-bold ${styles}`}>{children}</button>;
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`rounded-lg border p-3 ${props.className || ''}`} />;
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`rounded-lg border p-3 ${props.className || ''}`} />;
}

function DataTable({ title, rows }: { title: string; rows: Array<Array<React.ReactNode>> }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b p-4"><h2 className="font-bold">{title}</h2></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <tbody>{rows.map((row, i) => <tr key={i} className="border-b last:border-0">{row.map((cell, j) => <td key={j} className="whitespace-nowrap px-4 py-3">{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function canSeeLocation(user: AppUser, location: Location) {
  return user.role !== 'shop_manager' || user.location === location;
}

function scopeData(data: CrmData, user: AppUser) {
  return {
    leads: data.leads.filter((lead) => canSeeLocation(user, lead.location)),
    jobs: data.jobs.filter((job) => canSeeLocation(user, job.location)),
    fleetClients: data.fleetClients.filter((client) => user.role !== 'shop_manager' || client.location_preference === user.location || client.location_preference === 'both'),
    calls: data.calls.filter((call) => canSeeLocation(user, call.location)),
    reviews: data.reviews.filter((review) => review.location === 'both' || review.location === 'general' || canSeeLocation(user, review.location)),
  };
}

function Shell({ page, children, data, setData, user }: { page: PageKey; children: React.ReactNode; data: CrmData; setData: React.Dispatch<React.SetStateAction<CrmData>>; user: AppUser }) {
  const missed = getRecentMissedCalls(scopeData(data, user).calls).length;

  return (
    <div className="min-h-screen lg:flex">
      <aside className="fixed inset-x-0 bottom-0 z-40 border-t bg-[#102a43] text-white lg:inset-y-0 lg:left-0 lg:right-auto lg:w-64 lg:border-r lg:border-t-0">
        <div className="hidden px-6 py-5 lg:block">
          <p className="text-lg font-black">365 Truck Repair</p>
          <p className="text-xs text-blue-100">Channahon + Markham</p>
        </div>
        <nav className="flex justify-around gap-1 p-2 lg:block lg:space-y-1 lg:px-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = page === item.key || (page === 'lead-detail' && item.key === 'leads');
            return (
              <Link key={item.href} href={item.href} className={`relative flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold lg:flex-row lg:px-3 lg:text-sm ${active ? 'bg-[#2E75B6] text-white' : 'text-blue-100 hover:bg-white/10'}`}>
                <Icon size={18} />
                <span>{item.label}</span>
                {item.key === 'calls' && missed > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />}
              </Link>
            );
          })}
        </nav>
        <div className="hidden p-3 lg:absolute lg:bottom-0 lg:block lg:w-full">
          <Link href="/settings" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${page === 'settings' ? 'bg-[#2E75B6]' : 'text-blue-100 hover:bg-white/10'}`}>
            <Settings size={18} /> Настройки
          </Link>
        </div>
      </aside>
      <main className="w-full pb-24 lg:ml-64 lg:pb-0">
        <header className="sticky top-0 z-30 border-b bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#2E75B6]">Рабочий вид: {roleLabel[user.role]}</p>
              <h1 className="text-2xl font-black text-slate-950">365 Truck Repair CRM</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SelectInput value={user.id} onChange={(event) => setData((current) => ({ ...current, activeUserId: event.target.value }))}>
                {users.map((item) => <option key={item.id} value={item.id}>{item.name} · {roleLabel[item.role]}</option>)}
              </SelectInput>
              {user.location && <Badge tone="bg-blue-100 text-blue-700">{locationLabel[user.location]}</Badge>}
            </div>
          </div>
        </header>
        <section className="p-4 lg:p-8">{children}</section>
      </main>
    </div>
  );
}

function Notifications({ scoped, activities }: { scoped: ReturnType<typeof scopeData>; activities: Activity[] }) {
  const missed = getRecentMissedCalls(scoped.calls);
  const unpaid = scoped.jobs.filter((job) => ['completed', 'invoiced'].includes(job.status));
  const unanswered = scoped.reviews.filter((review) => !review.responded);
  const followUps = getFollowUpsDueToday(scoped.leads);
  const notifications = [
    ...missed.map((call) => ({ text: `Пропущенный звонок от ${call.phone_from}`, tone: 'bg-red-50 text-red-800 border-red-200' })),
    ...followUps.map((lead) => ({ text: `Follow-up сегодня: ${lead.name}`, tone: 'bg-amber-50 text-amber-800 border-amber-200' })),
    ...unpaid.map((job) => ({ text: `Работа завершена, но не оплачена: ${serviceLabel[job.service_type]}`, tone: 'bg-purple-50 text-purple-800 border-purple-200' })),
    ...unanswered.map((review) => ({ text: `Отзыв без ответа: ${review.author_name}`, tone: 'bg-blue-50 text-blue-800 border-blue-200' })),
  ].slice(0, 8);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="card p-5">
        <h2 className="font-bold">Центр внимания</h2>
        <div className="mt-3 space-y-2">
          {notifications.length === 0 && <p className="text-sm text-slate-500">Критичных задач нет.</p>}
          {notifications.map((item, index) => <div key={index} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${item.tone}`}>{item.text}</div>)}
        </div>
      </div>
      <div className="card p-5">
        <h2 className="font-bold">Журнал действий</h2>
        <div className="mt-3 space-y-2">
          {activities.slice(0, 6).map((item) => <p key={item.id} className="text-sm text-slate-600">{new Date(item.created_at).toLocaleString()} · {item.text}</p>)}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ data, user }: { data: CrmData; user: AppUser }) {
  const scoped = scopeData(data, user);
  const [weekCutoff] = useState(() => new Date(Date.now() - 7 * 86400000));
  const leadsBySource = Object.entries(scoped.leads.reduce<Record<string, number>>((acc, lead) => {
    acc[sourceLabel[lead.source]] = (acc[sourceLabel[lead.source]] || 0) + 1;
    return acc;
  }, {})).map(([source, count]) => ({ source, count }));
  const jobsByType = Object.entries(scoped.jobs.reduce<Record<string, number>>((acc, job) => {
    acc[serviceLabel[job.service_type]] = (acc[serviceLabel[job.service_type]] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));
  const revenueTrend = monthlyReports.map((report) => ({ month: report.month.slice(0, 7), revenue: report.total_revenue }));
  const activeJobs = scoped.jobs.filter((job) => !['completed', 'invoiced', 'paid'].includes(job.status));
  const conversion = scoped.leads.length ? Math.round((scoped.leads.filter((lead) => lead.converted).length / scoped.leads.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card title="Лиды за неделю" value={String(scoped.leads.filter((lead) => new Date(lead.created_at) > weekCutoff).length)} sub="Все источники" />
        <Card title="Выручка за месяц" value={money(monthlyRevenue(scoped.jobs, '2026-06-01'))} sub="Только оплаченные работы" />
        <Card title="Активные работы" value={String(activeJobs.length)} sub="Запланировано / в работе / запчасти" />
        <Card title="Конверсия" value={`${conversion}%`} sub="Лид → работа" />
        <Card title="Отзывы без ответа" value={String(scoped.reviews.filter((review) => !review.responded).length)} sub="Нужна реакция" />
      </div>
      <Notifications scoped={scoped} activities={data.activities} />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card p-5">
          <h2 className="font-bold">Лиды по источникам</h2>
          <div className="mt-4 h-72"><ResponsiveContainer><BarChart data={leadsBySource}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="source" hide /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#2E75B6" /></BarChart></ResponsiveContainer></div>
        </div>
        <div className="card p-5">
          <h2 className="font-bold">Работы по типу сервиса</h2>
          <div className="mt-4 h-72"><ResponsiveContainer><PieChart><Pie data={jobsByType} dataKey="value" nameKey="name" outerRadius={100}>{jobsByType.map((_, i) => <Cell key={i} fill={['#1F4E79', '#2E75B6', '#22c55e', '#f59e0b', '#ef4444'][i % 5]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
        </div>
        <div className="card p-5">
          <h2 className="font-bold">Динамика выручки</h2>
          <div className="mt-4 h-72"><ResponsiveContainer><LineChart data={revenueTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(v) => money(Number(v))} /><Line dataKey="revenue" stroke="#1F4E79" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
        </div>
      </div>
      <DataTable title="Топ fleet-клиентов" rows={scoped.fleetClients.sort((a, b) => (b.monthly_value || 0) - (a.monthly_value || 0)).slice(0, 6).map((client) => [client.company_name, `${client.number_of_trucks || 0} грузовиков`, money(client.monthly_value), statusLabel[client.status]])} />
    </div>
  );
}

function LeadForm({ onSave }: { onSave: (lead: Lead) => void }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'direct_call' as LeadSource, location: 'channahon' as Location, service_requested: '', estimated_value: '0', truck_info: '' });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <form className="card mb-5 grid gap-3 p-5 md:grid-cols-3" onSubmit={(event) => {
      event.preventDefault();
      const attributed = applyLeadAttribution({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        source: form.source,
        call_tracking_number: form.location === 'channahon' ? '630-277-3663' : '815-641-4718',
        location: form.location,
        client_type: 'regular',
        status: 'new',
        assigned_to: null,
        truck_info: form.truck_info || null,
        service_requested: form.service_requested,
        estimated_value: Number(form.estimated_value) || 0,
        actual_value: null,
        notes: 'Создано вручную в CRM.',
        follow_up_date: today(),
        converted: false,
        updated_at: new Date().toISOString(),
      });
      onSave(attributed);
      setForm({ name: '', phone: '', email: '', source: 'direct_call', location: 'channahon', service_requested: '', estimated_value: '0', truck_info: '' });
    }}>
      <TextInput required placeholder="Имя / компания" value={form.name} onChange={(e) => update('name', e.target.value)} />
      <TextInput required placeholder="Телефон" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
      <TextInput placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
      <SelectInput value={form.source} onChange={(e) => update('source', e.target.value)}>{leadSources.map((source) => <option key={source} value={source}>{sourceLabel[source]}</option>)}</SelectInput>
      <SelectInput value={form.location} onChange={(e) => update('location', e.target.value)}><option value="channahon">Channahon</option><option value="markham">Markham</option></SelectInput>
      <TextInput placeholder="Оценка $" value={form.estimated_value} onChange={(e) => update('estimated_value', e.target.value)} />
      <TextInput className="md:col-span-1" placeholder="Truck info" value={form.truck_info} onChange={(e) => update('truck_info', e.target.value)} />
      <TextInput required className="md:col-span-2" placeholder="Что нужно сделать?" value={form.service_requested} onChange={(e) => update('service_requested', e.target.value)} />
      <div className="md:col-span-3"><Button type="submit">Сохранить лид</Button></div>
    </form>
  );
}

function LeadsPage({ data, setData, log, user, leadId }: { data: CrmData; setData: React.Dispatch<React.SetStateAction<CrmData>>; log: (text: string, tone?: Activity['tone']) => void; user: AppUser; leadId?: string }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const scoped = scopeData(data, user);
  const selected = leadId ? data.leads.find((lead) => lead.id === leadId && canSeeLocation(user, lead.location)) : null;

  const updateLead = (id: string, patch: Partial<Lead>) => setData((current) => ({
    ...current,
    leads: current.leads.map((lead) => lead.id === id ? { ...lead, ...patch, updated_at: new Date().toISOString() } : lead),
  }));

  const createJobFromLead = (lead: Lead) => {
    const job: Job = {
      id: crypto.randomUUID(),
      lead_id: lead.id,
      created_at: new Date().toISOString(),
      location: lead.location,
      service_type: lead.source === 'road_service' ? 'road_service' : 'diagnostics',
      status: 'scheduled',
      technician_name: null,
      start_date: today(),
      completion_date: null,
      invoice_amount: lead.estimated_value,
      paid_amount: null,
      payment_method: null,
      notes: `Создано из лида ${lead.name}.`,
    };
    setData((current) => ({
      ...current,
      leads: current.leads.map((item) => item.id === lead.id ? { ...item, converted: true, status: 'in_progress', updated_at: new Date().toISOString() } : item),
      jobs: [job, ...current.jobs],
    }));
    log(`Создана работа из лида ${lead.name}.`, 'success');
  };

  if (selected) {
    const relatedJobs = data.jobs.filter((job) => job.lead_id === selected.id);
    const relatedCalls = data.calls.filter((call) => call.lead_id === selected.id);
    return (
      <div className="space-y-5">
        <Link href="/leads" className="font-semibold text-[#2E75B6]">Назад к лидам</Link>
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-3xl font-black">{selected.name}</h2><p className="text-slate-500">{selected.phone} · {selected.email || 'Нет email'}</p></div>
            <div className="flex flex-wrap gap-2"><Badge tone={statusColors[selected.status]}>{statusLabel[selected.status]}</Badge><Badge>{sourceLabel[selected.source]}</Badge><Badge>{locationLabel[selected.location]}</Badge><Badge>{selected.client_type}</Badge></div>
          </div>
          <p className="mt-5 text-slate-700">{selected.service_requested}</p>
          <p className="mt-2 text-sm text-slate-500">{selected.notes}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <SelectInput value={selected.status} onChange={(e) => { updateLead(selected.id, { status: e.target.value as LeadStatus }); log(`Статус лида ${selected.name}: ${statusLabel[e.target.value]}.`); }}>{leadStatuses.map((item) => <option key={item} value={item}>{statusLabel[item]}</option>)}</SelectInput>
            <Button onClick={() => updateLead(selected.id, { follow_up_date: today(), status: 'follow_up' })} variant="secondary">Follow-up сегодня</Button>
            <Button onClick={() => createJobFromLead(selected)}>Создать работу</Button>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <DataTable title="История" rows={[['Создано', new Date(selected.created_at).toLocaleString()], ['Обновлено', new Date(selected.updated_at).toLocaleString()], ['Follow-up', selected.follow_up_date || 'Нет']]} />
          <DataTable title="Связанные работы" rows={relatedJobs.map((job) => [serviceLabel[job.service_type], <Badge key={job.id} tone={statusColors[job.status]}>{statusLabel[job.status]}</Badge>, money(job.invoice_amount)])} />
          <DataTable title="История звонков" rows={relatedCalls.map((call) => [call.phone_from, call.phone_to, <Badge key={call.id} tone={statusColors[call.outcome]}>{statusLabel[call.outcome]}</Badge>])} />
          <div className="card p-5"><h2 className="font-bold">Заметки</h2><textarea className="mt-3 min-h-28 w-full rounded-lg border p-3" placeholder="Добавить заметку..." onBlur={(e) => e.target.value && updateLead(selected.id, { notes: `${selected.notes || ''}\n${new Date().toLocaleString()}: ${e.target.value}` })} /></div>
        </div>
      </div>
    );
  }

  const filtered = scoped.leads
    .filter((lead) => lead.source === 'road_service' || (status === 'all' || lead.status === status))
    .filter((lead) => `${lead.name} ${lead.phone} ${lead.email || ''}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(b.source === 'road_service') - Number(a.source === 'road_service'));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-3xl font-black">Управление лидами</h2><div className="flex gap-2"><Button onClick={() => setShowForm((value) => !value)}>Добавить лид</Button><Button variant="secondary" onClick={() => exportCsv('leads.csv', filtered)}>Экспорт CSV</Button></div></div>
      {showForm && <LeadForm onSave={(lead) => { setData((current) => ({ ...current, leads: [lead, ...current.leads] })); log(`Добавлен лид ${lead.name}.`, 'success'); }} />}
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <TextInput className="md:col-span-2" placeholder="Поиск по имени, телефону, компании..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <SelectInput value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">Все статусы</option>{leadStatuses.map((item) => <option key={item} value={item}>{statusLabel[item]}</option>)}</SelectInput>
      </div>
      <DataTable title="Список лидов" rows={filtered.map((lead) => [
        <Link key={lead.id} href={`/leads/${lead.id}`} className="font-bold text-[#1F4E79]">{lead.name}</Link>,
        lead.phone,
        <Badge key={`${lead.id}-status`} tone={statusColors[lead.status]}>{statusLabel[lead.status]}</Badge>,
        <Badge key={`${lead.id}-source`} tone={lead.source === 'road_service' ? 'bg-orange-100 text-orange-700' : undefined}>{sourceLabel[lead.source]}</Badge>,
        locationLabel[lead.location],
        money(lead.estimated_value),
      ])} />
    </div>
  );
}

function JobForm({ leads, onSave }: { leads: Lead[]; onSave: (job: Job) => void }) {
  const [form, setForm] = useState({ lead_id: leads[0]?.id || '', location: 'channahon' as Location, service_type: 'diagnostics' as ServiceType, technician_name: '', invoice_amount: '0', notes: '' });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <form className="card mb-5 grid gap-3 p-5 md:grid-cols-3" onSubmit={(event) => {
      event.preventDefault();
      onSave({ id: crypto.randomUUID(), lead_id: form.lead_id, created_at: new Date().toISOString(), location: form.location, service_type: form.service_type, status: 'scheduled', technician_name: form.technician_name || null, start_date: today(), completion_date: null, invoice_amount: Number(form.invoice_amount) || 0, paid_amount: null, payment_method: null, notes: form.notes });
    }}>
      <SelectInput value={form.lead_id} onChange={(e) => update('lead_id', e.target.value)}>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name}</option>)}</SelectInput>
      <SelectInput value={form.location} onChange={(e) => update('location', e.target.value)}><option value="channahon">Channahon</option><option value="markham">Markham</option></SelectInput>
      <SelectInput value={form.service_type} onChange={(e) => update('service_type', e.target.value)}>{serviceTypes.map((item) => <option key={item} value={item}>{serviceLabel[item]}</option>)}</SelectInput>
      <TextInput placeholder="Техник" value={form.technician_name} onChange={(e) => update('technician_name', e.target.value)} />
      <TextInput placeholder="Invoice $" value={form.invoice_amount} onChange={(e) => update('invoice_amount', e.target.value)} />
      <TextInput placeholder="Заметки" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
      <div className="md:col-span-3"><Button type="submit">Создать работу</Button></div>
    </form>
  );
}

function JobsPage({ data, setData, log, user }: { data: CrmData; setData: React.Dispatch<React.SetStateAction<CrmData>>; log: (text: string, tone?: Activity['tone']) => void; user: AppUser }) {
  const [showForm, setShowForm] = useState(false);
  const scoped = scopeData(data, user);
  const updateJob = (id: string, patch: Partial<Job>) => setData((current) => ({ ...current, jobs: current.jobs.map((job) => job.id === id ? { ...job, ...patch } : job) }));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-3xl font-black">Управление работами</h2><Button onClick={() => setShowForm((value) => !value)}>Создать работу</Button></div>
      {showForm && <JobForm leads={scoped.leads} onSave={(job) => { setData((current) => ({ ...current, jobs: [job, ...current.jobs] })); log('Создана новая работа.', 'success'); }} />}
      <div className="grid gap-4 xl:grid-cols-6">{jobStatuses.map((col) => <div key={col} className="card min-h-64 p-3"><h3 className="mb-3 text-sm font-black uppercase text-slate-500">{statusLabel[col]}</h3>{scoped.jobs.filter((job) => job.status === col).map((job) => <div key={job.id} className="mb-3 rounded-lg border p-3"><p className="font-bold">{serviceLabel[job.service_type]}</p><p className="text-sm text-slate-500">{locationLabel[job.location]} · {job.technician_name || 'Техник не назначен'}</p><p className="mt-2 font-black">{money(job.invoice_amount)}</p><div className="mt-3 flex flex-wrap gap-2"><SelectInput value={job.status} onChange={(e) => updateJob(job.id, { status: e.target.value as JobStatus })}>{jobStatuses.map((item) => <option key={item} value={item}>{statusLabel[item]}</option>)}</SelectInput>{job.status !== 'paid' && <Button onClick={() => { updateJob(job.id, { status: 'paid', paid_amount: job.invoice_amount, payment_method: 'card' as PaymentMethod, completion_date: today() }); log('Работа отмечена как оплаченная.', 'success'); }} variant="secondary">Оплачено</Button>}</div></div>)}</div>)}</div>
    </div>
  );
}

function FleetPage({ data, setData, log, user }: { data: CrmData; setData: React.Dispatch<React.SetStateAction<CrmData>>; log: (text: string, tone?: Activity['tone']) => void; user: AppUser }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company_name: '', contact_person: '', phone: '', email: '', number_of_trucks: '1', monthly_value: '0', status: 'prospect' as FleetStatus });
  const scoped = scopeData(data, user);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-3xl font-black">Fleet-клиенты</h2><Button onClick={() => setShowForm((value) => !value)}>Добавить fleet-клиента</Button></div>
      {showForm && <form className="card mb-5 grid gap-3 p-5 md:grid-cols-3" onSubmit={(event) => {
        event.preventDefault();
        const client: FleetClient = { id: crypto.randomUUID(), company_name: form.company_name, contact_person: form.contact_person, phone: form.phone, email: form.email || null, number_of_trucks: Number(form.number_of_trucks), contract_type: 'per_service', monthly_value: Number(form.monthly_value), assigned_manager: user.name, location_preference: user.location || 'both', status: form.status, notes: 'Добавлен вручную.', created_at: new Date().toISOString(), last_service_date: null };
        setData((current) => ({ ...current, fleetClients: [client, ...current.fleetClients] }));
        log(`Добавлен fleet-клиент ${client.company_name}.`, 'success');
      }}>
        <TextInput required placeholder="Компания" value={form.company_name} onChange={(e) => update('company_name', e.target.value)} />
        <TextInput required placeholder="Контакт" value={form.contact_person} onChange={(e) => update('contact_person', e.target.value)} />
        <TextInput required placeholder="Телефон" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        <TextInput placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        <TextInput placeholder="Кол-во грузовиков" value={form.number_of_trucks} onChange={(e) => update('number_of_trucks', e.target.value)} />
        <TextInput placeholder="Месячная ценность $" value={form.monthly_value} onChange={(e) => update('monthly_value', e.target.value)} />
        <div className="md:col-span-3"><Button type="submit">Сохранить клиента</Button></div>
      </form>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{scoped.fleetClients.map((client) => <div key={client.id} className="card p-5"><div className="flex items-start justify-between"><div><h3 className="text-xl font-black">{client.company_name}</h3><p className="text-sm text-slate-500">{client.contact_person} · {client.phone}</p></div><Badge tone={statusColors[client.status]}>{statusLabel[client.status]}</Badge></div><div className="mt-5 grid grid-cols-3 gap-3"><Mini label="Грузовики" value={client.number_of_trucks || 0} /><Mini label="Месяц" value={money(client.monthly_value)} /><Mini label="Год" value={money((client.monthly_value || 0) * 12)} /></div><button onClick={() => { sendSmsNotification(client.phone, '365 Truck Repair: fleet follow-up'); log(`SMS follow-up подготовлен для ${client.company_name}.`); }} className="mt-4 rounded-lg bg-[#2E75B6] px-4 py-2 text-sm font-bold text-white">SMS</button></div>)}</div>
    </div>
  );
}

function CallsPage({ data, setData, log, user }: { data: CrmData; setData: React.Dispatch<React.SetStateAction<CrmData>>; log: (text: string, tone?: Activity['tone']) => void; user: AppUser }) {
  const scoped = scopeData(data, user);
  const answerRate = Math.round((scoped.calls.filter((call) => call.outcome !== 'missed').length / Math.max(scoped.calls.length, 1)) * 100);
  const callback = (call: Call) => {
    setData((current) => ({
      ...current,
      calls: current.calls.map((item) => item.id === call.id ? { ...item, outcome: 'answered', handled_by: user.name, notes: `${item.notes || ''} Callback completed.` } : item),
    }));
    log(`Пропущенный звонок ${call.phone_from} обработан.`, 'success');
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3"><Card title="Доля отвеченных" value={`${answerRate}%`} /><Card title="Средняя длительность" value={`${Math.round(scoped.calls.reduce((s, c) => s + (c.duration_seconds || 0), 0) / Math.max(scoped.calls.length, 1))}s`} /><Card title="Пропущенные" value={String(scoped.calls.filter((call) => call.outcome === 'missed').length)} /></div>
      <DataTable title="Журнал входящих звонков" rows={scoped.calls.map((call) => [new Date(call.created_at).toLocaleString(), call.phone_from, call.phone_to, sourceLabel[call.source], locationLabel[call.location], <Badge key={call.id} tone={statusColors[call.outcome]}>{statusLabel[call.outcome]}</Badge>, call.handled_by || <Button key={`${call.id}-btn`} onClick={() => callback(call)} variant="secondary">Перезвонили</Button>])} />
    </div>
  );
}

function ReviewsPage({ data, setData, log }: { data: CrmData; setData: React.Dispatch<React.SetStateAction<CrmData>>; log: (text: string, tone?: Activity['tone']) => void }) {
  const avg = data.reviews.reduce((s, r) => s + r.rating, 0) / Math.max(data.reviews.length, 1);
  const respond = (review: Review) => {
    setData((current) => ({ ...current, reviews: current.reviews.map((item) => item.id === review.id ? { ...item, responded: true, response_text: 'Спасибо за отзыв и доверие к 365 Truck Repair.', responded_at: new Date().toISOString() } : item) }));
    log(`Ответ на отзыв ${review.author_name} сохранен.`, 'success');
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3"><Card title="Текущий рейтинг" value={`${avg.toFixed(1)}★`} sub={`${data.reviews.length} отзывов`} /><Card title="Нужен ответ" value={String(data.reviews.filter((r) => !r.responded).length)} /><Card title="Отзывы Google" value={String(data.reviews.filter((r) => r.platform === 'google').length)} /></div>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">{data.reviews.map((review) => <div key={review.id} className={`card p-5 ${!review.responded ? 'border-amber-300' : ''}`}><div className="flex justify-between"><h3 className="font-black">{review.author_name}</h3><Badge>{review.platform}</Badge></div><p className="mt-2 text-amber-500">{'★'.repeat(review.rating)}</p><p className="mt-3 text-slate-700">{review.content}</p><div className="mt-4 flex gap-2"><Button onClick={() => respond(review)}>Ответить</Button><Button variant="secondary" onClick={() => sendReviewRequest('630-277-3663', String(review.location))}>Запросить отзыв</Button></div></div>)}</div>
    </div>
  );
}

function ReportsPage({ data }: { data: CrmData }) {
  const byLocation = (location: Location) => ({
    leads: data.leads.filter((lead) => lead.location === location).length,
    jobs: data.jobs.filter((job) => job.location === location).length,
    revenue: monthlyRevenue(data.jobs, '2026-06-01', location),
    missed: data.calls.filter((call) => call.location === location && call.outcome === 'missed').length,
  });
  const channahon = byLocation('channahon');
  const markham = byLocation('markham');

  return (
    <div className="space-y-5">
      <div className="flex justify-between"><h2 className="text-3xl font-black">Отчеты и аналитика</h2><Button onClick={() => window.print()} variant="secondary">Экспорт в PDF</Button></div>
      <div className="grid gap-4 md:grid-cols-2"><DataTable title="Channahon" rows={Object.entries(channahon).map(([key, value]) => [key, typeof value === 'number' && key === 'revenue' ? money(value) : value])} /><DataTable title="Markham" rows={Object.entries(markham).map(([key, value]) => [key, typeof value === 'number' && key === 'revenue' ? money(value) : value])} /></div>
      <div className="grid gap-4 md:grid-cols-3">{monthlyReports.map((report) => <div key={report.id} className="card p-5"><h3 className="font-black">{report.month.slice(0, 7)}</h3><p className="mt-3 text-3xl font-black">{money(report.total_revenue)}</p><p className="text-sm text-slate-500">{report.total_leads} лидов · {report.total_jobs_completed} работ</p><p className="mt-3 text-sm">CPL: {money(report.cost_per_lead)} · Meta {money(report.meta_ads_spend)} · Google {money(report.google_ads_spend)}</p></div>)}</div>
    </div>
  );
}

function SettingsPage({ setData }: { setData: React.Dispatch<React.SetStateAction<CrmData>> }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <DataTable title="Пользователи и роли" rows={users.map((user) => [user.name, user.email, roleLabel[user.role], user.location ? locationLabel[user.location] : 'Все локации'])} />
      <DataTable title="Настройка номеров CallRail" rows={[['630-277-3663', 'Channahon', 'Звонки по ремонту'], ['815-641-4718', 'Markham', 'Звонки по ремонту'], ['Номера 779', 'Peaty Tire', 'Перекрестные рекомендации']]} />
      <DataTable title="Интеграции" rows={[['CallRail', 'Готов hook, нужен CALLRAIL_API_KEY'], ['Twilio', 'Готовы SMS-заглушки, нужны env-переменные'], ['Supabase', 'Схема готова, следующий шаг - заменить localStorage на запросы'], ['Audit', '0 vulnerabilities']]} />
      <div className="card p-5"><h2 className="font-bold">Демо-данные</h2><p className="mt-2 text-sm text-slate-500">Все изменения сейчас сохраняются локально в браузере. Это удобно для теста до подключения Supabase.</p><Button variant="danger" onClick={() => { window.localStorage.removeItem(storageKey); setData(initialData()); }}>Сбросить демо-данные</Button></div>
    </div>
  );
}

function exportCsv(name: string, rows: unknown[]) {
  const csv = rows.map((row) => JSON.stringify(row)).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function TruckCrmPage({ page, leadId }: { page: PageKey; leadId?: string }) {
  const { data, setData, log } = useCrmData();
  const user = users.find((item) => item.id === data.activeUserId) || activeUser;
  const view = useMemo(() => {
    switch (page) {
      case 'dashboard': return <Dashboard data={data} user={user} />;
      case 'leads': return <LeadsPage data={data} setData={setData} log={log} user={user} />;
      case 'lead-detail': return <LeadsPage data={data} setData={setData} log={log} user={user} leadId={leadId} />;
      case 'jobs': return <JobsPage data={data} setData={setData} log={log} user={user} />;
      case 'fleet': return <FleetPage data={data} setData={setData} log={log} user={user} />;
      case 'calls': return <CallsPage data={data} setData={setData} log={log} user={user} />;
      case 'reviews': return <ReviewsPage data={data} setData={setData} log={log} />;
      case 'reports': return <ReportsPage data={data} />;
      case 'settings': return <SettingsPage setData={setData} />;
      default: return <Dashboard data={data} user={user} />;
    }
  }, [page, data, setData, log, user, leadId]);

  return <Shell page={page} data={data} setData={setData} user={user}>{view}</Shell>;
}
