'use client';

import { useMemo, useState } from 'react';
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
import { activeUser, calls, fleetClients, jobs, leads, monthlyReports, reviews, users } from '@/lib/sample-data';
import { getFollowUpsDueToday, getRecentMissedCalls, monthlyRevenue } from '@/lib/business-logic';
import { sendReviewRequest, sendSmsNotification } from '@/lib/twilio';
import type { AppUser, Location } from '@/types/database';

type PageKey = 'dashboard' | 'leads' | 'lead-detail' | 'jobs' | 'fleet' | 'calls' | 'reviews' | 'reports' | 'settings';

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
  paid: 'bg-green-100 text-green-700',
  active: 'bg-green-100 text-green-700',
  prospect: 'bg-blue-100 text-blue-700',
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
  paid: 'Оплачено',
  active: 'Активный',
  prospect: 'Потенциальный',
  scheduled: 'Запланировано',
  waiting_parts: 'Ожидает запчасти',
  invoiced: 'Счет выставлен',
  answered: 'Ответили',
  voicemail: 'Голосовая почта',
};

const sourceLabel: Record<string, string> = {
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

const serviceLabel: Record<string, string> = {
  repair: 'Ремонт',
  tire: 'Шины',
  road_service: 'Выездной сервис',
  maintenance: 'Обслуживание',
  diagnostic: 'Диагностика',
  other: 'Другое',
};

const locationLabel: Record<string, string> = {
  channahon: 'Channahon',
  markham: 'Markham',
  peaty_tire: 'Peaty Tire',
};

const roleLabel: Record<string, string> = {
  owner: 'Владелец',
  marketing_manager: 'Маркетинг',
  shop_manager: 'Менеджер сервиса',
  admin: 'Администратор',
};

function money(value: number | null | undefined) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
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

function Shell({ page, children, user = activeUser }: { page: PageKey; children: React.ReactNode; user?: AppUser }) {
  const missed = getRecentMissedCalls(calls).length;

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
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold lg:flex-row lg:px-3 lg:text-sm ${
                  active ? 'bg-[#2E75B6] text-white' : 'text-blue-100 hover:bg-white/10'
                }`}
              >
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
              <p className="text-sm font-semibold text-[#2E75B6]">Вид владельца для Iulian</p>
              <h1 className="text-2xl font-black text-slate-950">365 Truck Repair CRM</h1>
            </div>
            <div className="flex items-center gap-2">
              {user.role === 'shop_manager' && <Badge tone="bg-blue-100 text-blue-700">{locationLabel[user.location || '']}</Badge>}
              <Badge tone="bg-slate-100 text-slate-700">{user.name} · {roleLabel[user.role]}</Badge>
            </div>
          </div>
        </header>
        <section className="p-4 lg:p-8">{children}</section>
      </main>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="font-black">{value}</p></div>;
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

function ListToolbar({ title, button }: { title: string; button: string }) {
  return <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-3xl font-black">{title}</h2><button className="rounded-lg bg-[#1F4E79] px-4 py-2 font-bold text-white" onClick={() => console.info(`${button} modal TODO`)}>{button}</button></div>;
}

function Dashboard() {
  const [weekCutoff] = useState(() => new Date(Date.now() - 7 * 86400000));
  const followUps = getFollowUpsDueToday(leads);
  const leadsBySource = Object.entries(leads.reduce<Record<string, number>>((acc, lead) => {
    acc[sourceLabel[lead.source]] = (acc[sourceLabel[lead.source]] || 0) + 1;
    return acc;
  }, {})).map(([source, count]) => ({ source, count }));
  const jobsByType = Object.entries(jobs.reduce<Record<string, number>>((acc, job) => {
    acc[serviceLabel[job.service_type]] = (acc[serviceLabel[job.service_type]] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));
  const revenueTrend = monthlyReports.map((report) => ({ month: report.month.slice(0, 7), revenue: report.total_revenue }));
  const activeJobs = jobs.filter((job) => !['completed', 'invoiced', 'paid'].includes(job.status));
  const shopStats = (location: Location) => ({
    leads: leads.filter((lead) => lead.location === location).length,
    jobs: jobs.filter((job) => job.location === location && !['paid', 'completed'].includes(job.status)).length,
    revenue: monthlyRevenue(jobs, '2026-06-01', location),
  });

  return (
    <Shell page="dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card title="Лиды за неделю" value={String(leads.filter((lead) => new Date(lead.created_at) > weekCutoff).length)} sub="Все источники" />
          <Card title="Выручка за месяц" value={money(monthlyRevenue(jobs, '2026-06-01'))} sub="Только оплаченные работы" />
          <Card title="Активные работы" value={String(activeJobs.length)} sub="Запланировано / в работе / запчасти" />
          <Card title="Новые отзывы" value={String(reviews.filter((review) => !review.responded).length)} sub="Нужен ответ" />
        </div>
        {followUps.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-bold text-amber-900">Повторные контакты на сегодня</p>
            <div className="mt-2 flex flex-wrap gap-2">{followUps.map((lead) => <Badge key={lead.id} tone="bg-amber-100 text-amber-800">{lead.name}</Badge>)}</div>
          </div>
        )}
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="card p-5 xl:col-span-1">
            <h2 className="font-bold">Лиды по источникам · последние 30 дней</h2>
            <div className="mt-4 h-72"><ResponsiveContainer><BarChart data={leadsBySource}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="source" hide /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#2E75B6" /></BarChart></ResponsiveContainer></div>
          </div>
          <div className="card p-5">
            <h2 className="font-bold">Работы по типу сервиса</h2>
            <div className="mt-4 h-72"><ResponsiveContainer><PieChart><Pie data={jobsByType} dataKey="value" nameKey="name" outerRadius={100}>{jobsByType.map((_, i) => <Cell key={i} fill={['#1F4E79', '#2E75B6', '#22c55e', '#f59e0b', '#ef4444'][i % 5]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          </div>
          <div className="card p-5">
            <h2 className="font-bold">Динамика выручки · 6 месяцев</h2>
            <div className="mt-4 h-72"><ResponsiveContainer><LineChart data={revenueTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(v) => money(Number(v))} /><Line dataKey="revenue" stroke="#1F4E79" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <DataTable title="Топ fleet-клиентов по ценности" rows={fleetClients.sort((a, b) => (b.monthly_value || 0) - (a.monthly_value || 0)).slice(0, 5).map((f) => [f.company_name, `${f.number_of_trucks} грузовиков`, money(f.monthly_value), statusLabel[f.status] || f.status])} />
          {(['channahon', 'markham'] as Location[]).map((loc) => {
            const stats = shopStats(loc);
            return <div key={loc} className="card p-5"><h3 className="font-bold">{locationLabel[loc]}</h3><div className="mt-4 grid grid-cols-3 gap-3 text-center"><Mini label="Лиды" value={stats.leads} /><Mini label="Работы" value={stats.jobs} /><Mini label="Выручка" value={money(stats.revenue)} /></div></div>;
          })}
        </div>
      </div>
    </Shell>
  );
}

function LeadsPage({ leadId }: { leadId?: string }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const selected = leadId ? leads.find((lead) => lead.id === leadId) : null;
  const filtered = leads
    .filter((lead) => lead.source === 'road_service' || (status === 'all' || lead.status === status))
    .filter((lead) => `${lead.name} ${lead.phone} ${lead.email || ''}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(b.source === 'road_service') - Number(a.source === 'road_service'));

  if (selected) {
    const relatedJobs = jobs.filter((job) => job.lead_id === selected.id);
    const relatedCalls = calls.filter((call) => call.lead_id === selected.id);
    return (
      <Shell page="lead-detail">
        <div className="space-y-5">
          <Link href="/leads" className="font-semibold text-[#2E75B6]">Назад к лидам</Link>
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-3xl font-black">{selected.name}</h2><p className="text-slate-500">{selected.phone} · {selected.email || 'Нет email'}</p></div>
              <div className="flex gap-2"><Badge tone={statusColors[selected.status]}>{statusLabel[selected.status] || selected.status}</Badge><Badge>{sourceLabel[selected.source]}</Badge><Badge>{locationLabel[selected.location]}</Badge></div>
            </div>
            <p className="mt-5 text-slate-700">{selected.service_requested}</p>
            <p className="mt-2 text-sm text-slate-500">{selected.notes}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <DataTable title="История" rows={[['Создано', new Date(selected.created_at).toLocaleString()], ['Обновлено', new Date(selected.updated_at).toLocaleString()], ['Повторный контакт', selected.follow_up_date || 'Нет']]} />
            <DataTable title="Связанные работы" rows={relatedJobs.map((job) => [serviceLabel[job.service_type], <Badge key={job.id} tone={statusColors[job.status]}>{statusLabel[job.status] || job.status}</Badge>, money(job.invoice_amount)])} />
            <DataTable title="История звонков" rows={relatedCalls.map((call) => [call.phone_from, call.phone_to, <Badge key={call.id} tone={statusColors[call.outcome]}>{statusLabel[call.outcome] || call.outcome}</Badge>])} />
            <div className="card p-5"><h2 className="font-bold">Заметки</h2><textarea className="mt-3 min-h-28 w-full rounded-lg border p-3" placeholder="Добавить заметку с временем..." /><button className="mt-3 rounded-lg bg-[#1F4E79] px-4 py-2 font-bold text-white">Добавить заметку</button></div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell page="leads">
      <ListToolbar title="Управление лидами" button="Добавить лид" />
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <input className="rounded-lg border p-3 md:col-span-2" placeholder="Поиск по имени, телефону, компании..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="rounded-lg border p-3" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">Все статусы</option>{['new', 'contacted', 'in_progress', 'completed', 'lost', 'follow_up'].map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}</select>
        <button className="rounded-lg border bg-white p-3 font-bold">Экспорт CSV</button>
      </div>
      <DataTable title="25 на странице · сортируемый список лидов" rows={filtered.map((lead) => [<Link key={lead.id} href={`/leads/${lead.id}`} className="font-bold text-[#1F4E79]">{lead.name}</Link>, lead.phone, <Badge key={`${lead.id}-s`} tone={statusColors[lead.status]}>{statusLabel[lead.status] || lead.status}</Badge>, <Badge key={`${lead.id}-source`} tone={lead.source === 'road_service' ? 'bg-orange-100 text-orange-700' : undefined}>{sourceLabel[lead.source]}</Badge>, locationLabel[lead.location], money(lead.estimated_value)])} />
    </Shell>
  );
}

function JobsPage() {
  const columns = ['scheduled', 'in_progress', 'waiting_parts', 'completed', 'invoiced', 'paid'];
  return (
    <Shell page="jobs">
      <ListToolbar title="Управление работами" button="Создать работу" />
      <div className="grid gap-4 xl:grid-cols-6">{columns.map((col) => <div key={col} className="card min-h-64 p-3"><h3 className="mb-3 text-sm font-black uppercase text-slate-500">{statusLabel[col] || col}</h3>{jobs.filter((job) => job.status === col).map((job) => <div key={job.id} className="mb-3 rounded-lg border p-3"><p className="font-bold">{serviceLabel[job.service_type]}</p><p className="text-sm text-slate-500">{locationLabel[job.location]} · {job.technician_name}</p><p className="mt-2 font-black">{money(job.invoice_amount)}</p>{job.status !== 'paid' && <button className="mt-2 text-sm font-bold text-[#2E75B6]">Отметить как оплачено</button>}</div>)}</div>)}</div>
    </Shell>
  );
}

function FleetPage() {
  return (
    <Shell page="fleet">
      <ListToolbar title="Fleet-клиенты" button="Добавить fleet-клиента" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{fleetClients.map((client) => <div key={client.id} className="card p-5"><div className="flex items-start justify-between"><div><h3 className="text-xl font-black">{client.company_name}</h3><p className="text-sm text-slate-500">{client.contact_person} · {client.phone}</p></div><Badge tone={statusColors[client.status]}>{statusLabel[client.status] || client.status}</Badge></div><div className="mt-5 grid grid-cols-3 gap-3"><Mini label="Грузовики" value={client.number_of_trucks || 0} /><Mini label="Месяц" value={money(client.monthly_value)} /><Mini label="Год" value={money((client.monthly_value || 0) * 12)} /></div><button onClick={() => sendSmsNotification(client.phone, '365 Truck Repair: follow-up по fleet-клиенту')} className="mt-4 rounded-lg bg-[#2E75B6] px-4 py-2 text-sm font-bold text-white">SMS</button></div>)}</div>
    </Shell>
  );
}

function CallsPage() {
  const answerRate = Math.round((calls.filter((call) => call.outcome !== 'missed').length / calls.length) * 100);
  return (
    <Shell page="calls">
      <div className="grid gap-4 md:grid-cols-3"><Card title="Доля отвеченных" value={`${answerRate}%`} /><Card title="Средняя длительность" value={`${Math.round(calls.reduce((s, c) => s + (c.duration_seconds || 0), 0) / calls.length)}s`} /><Card title="Очередь пропущенных" value={String(calls.filter((call) => call.outcome === 'missed').length)} /></div>
      <div className="mt-5"><DataTable title="Журнал входящих звонков" rows={calls.map((call) => [new Date(call.created_at).toLocaleString(), call.phone_from, call.phone_to, sourceLabel[call.source], locationLabel[call.location], <Badge key={call.id} tone={statusColors[call.outcome]}>{statusLabel[call.outcome] || call.outcome}</Badge>, call.handled_by || 'Нужен обратный звонок'])} /></div>
    </Shell>
  );
}

function ReviewsPage() {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <Shell page="reviews">
      <div className="grid gap-4 md:grid-cols-3"><Card title="Текущий рейтинг" value={`${avg.toFixed(1)}★`} sub={`${reviews.length} отзывов`} /><Card title="Нужен ответ" value={String(reviews.filter((r) => !r.responded).length)} /><Card title="Отзывы Google" value={String(reviews.filter((r) => r.platform === 'google').length)} /></div>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">{reviews.map((review) => <div key={review.id} className={`card p-5 ${!review.responded ? 'border-amber-300' : ''}`}><div className="flex justify-between"><h3 className="font-black">{review.author_name}</h3><Badge>{review.platform}</Badge></div><p className="mt-2 text-amber-500">{'★'.repeat(review.rating)}</p><p className="mt-3 text-slate-700">{review.content}</p><button onClick={() => sendReviewRequest('630-277-3663', String(review.location))} className="mt-4 rounded-lg bg-[#1F4E79] px-4 py-2 text-sm font-bold text-white">Быстрый ответ</button></div>)}</div>
    </Shell>
  );
}

function ReportsPage() {
  return (
    <Shell page="reports">
      <ListToolbar title="Отчеты и аналитика" button="Отправить Iulian" />
      <div className="grid gap-4 md:grid-cols-3">{monthlyReports.map((report) => <div key={report.id} className="card p-5"><h3 className="font-black">{report.month.slice(0, 7)}</h3><p className="mt-3 text-3xl font-black">{money(report.total_revenue)}</p><p className="text-sm text-slate-500">{report.total_leads} лидов · {report.total_jobs_completed} работ</p><p className="mt-3 text-sm">CPL: {money(report.cost_per_lead)} · Meta {money(report.meta_ads_spend)} · Google {money(report.google_ads_spend)}</p></div>)}</div>
      <button onClick={() => window.print()} className="mt-5 rounded-lg border bg-white px-4 py-2 font-bold">Экспорт в PDF</button>
    </Shell>
  );
}

function SettingsPage() {
  return (
    <Shell page="settings">
      <div className="grid gap-4 xl:grid-cols-2">
        <DataTable title="Пользователи" rows={users.map((user) => [user.name, user.email, roleLabel[user.role], user.location ? locationLabel[user.location] : 'Все локации'])} />
        <DataTable title="Настройка номеров CallRail" rows={[['630-277-3663', 'Channahon', 'Звонки по ремонту'], ['815-641-4718', 'Markham', 'Звонки по ремонту'], ['Номера 779', 'Peaty Tire', 'Перекрестные рекомендации']]} />
        <DataTable title="Информация о бизнесе" rows={[['365 Truck Repair Channahon', '630-277-3663'], ['365 Truck Repair Markham', '815-641-4718'], ['Peaty Tire', 'Тот же адрес, что Channahon']]} />
        <DataTable title="Интеграции" rows={[['CallRail', 'TODO: добавить CALLRAIL_API_KEY'], ['Meta Ads', 'Не подключено'], ['Twilio', 'TODO: добавить env-переменные Twilio'], ['Supabase', 'Готово']]} />
      </div>
    </Shell>
  );
}

export function TruckCrmPage({ page, leadId }: { page: PageKey; leadId?: string }) {
  const view = useMemo(() => {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'leads': return <LeadsPage />;
      case 'lead-detail': return <LeadsPage leadId={leadId} />;
      case 'jobs': return <JobsPage />;
      case 'fleet': return <FleetPage />;
      case 'calls': return <CallsPage />;
      case 'reviews': return <ReviewsPage />;
      case 'reports': return <ReportsPage />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  }, [page, leadId]);
  return view;
}
