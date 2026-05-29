import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, ChevronDown, Pencil, Search, Trash2 } from 'lucide-react';
import { winRateData, revenueForecast } from '@/data/mock';
import type { Deal, DealStage } from '@/types';
import type { AppUser } from '@/lib/auth';
import { rolePermissions } from '@/lib/auth';
import type { NewDeal, useCrmStore } from '@/services/crmStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const stages: { stage: DealStage; color: string; bg: string }[] = [
  { stage: 'Новый лид', color: '#06B6D4', bg: 'rgba(6,182,212,0.08)' },
  { stage: 'Выявление потребностей', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  { stage: 'Предложение отправлено', color: '#F97316', bg: 'rgba(249,115,22,0.08)' },
  { stage: 'Переговоры', color: '#A855F7', bg: 'rgba(168,85,247,0.08)' },
  { stage: 'Успешно закрыта', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
];

const priorityColor = {
  high: '#EF4444',
  medium: '#D97706',
  low: '#64748B',
};

type CrmStore = ReturnType<typeof useCrmStore>;
type SortBy = 'value-desc' | 'value-asc' | 'activity';

const emptyDeal: NewDeal = {
  company: '',
  dealName: '',
  stage: 'Новый лид',
  value: 0,
  owner: 'Алекс Джонсон',
  priority: 'medium',
};

const priorityLabel = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

export default function Deals({ crm, user }: { crm: CrmStore; user: AppUser }) {
  const [forecastPeriod, setForecastPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('value-desc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [form, setForm] = useState<NewDeal>(emptyDeal);
  const headerRef = useRef<HTMLDivElement>(null);
  const permissions = rolePermissions[user.role];

  const deals = crm.deals
    .filter((deal) => {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        deal.company.toLowerCase().includes(query) ||
        deal.dealName.toLowerCase().includes(query) ||
        deal.owner.toLowerCase().includes(query);
      const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
      return matchesQuery && matchesStage;
    })
    .sort((a, b) => {
      if (sortBy === 'value-asc') return a.value - b.value;
      if (sortBy === 'activity') return a.daysInStage - b.daysInStage;
      return b.value - a.value;
    });

  const getDealsByStage = (stage: DealStage) => deals.filter(d => d.stage === stage);
  const getStageTotal = (stage: DealStage) => {
    const stageDeals = getDealsByStage(stage);
    const total = stageDeals.reduce((sum, d) => sum + d.value, 0);
          return total >= 1000 ? `$${(total / 1000).toFixed(0)} тыс.` : `$${total}`;
  };

  const handleDragEnd = (dealId: string, newStage: DealStage) => {
    if (!permissions.canManage) return;
    crm.updateDeal(dealId, { stage: newStage, lastActivity: 'только что', daysInStage: 0 });
  };

  const openCreateDialog = () => {
    setEditingDeal(null);
    setForm(emptyDeal);
    setDialogOpen(true);
  };

  const openEditDialog = (deal: Deal) => {
    setEditingDeal(deal);
    setForm({
      company: deal.company,
      dealName: deal.dealName,
      stage: deal.stage,
      value: deal.value,
      owner: deal.owner,
      priority: deal.priority,
    });
    setDialogOpen(true);
  };

  const submitDeal = () => {
    if (!form.company.trim() || !form.dealName.trim()) return;

    if (editingDeal) {
      crm.updateDeal(editingDeal.id, { ...form, lastActivity: 'только что' });
    } else {
      crm.addDeal(form);
    }

    setDialogOpen(false);
  };

  const maxBarValue = Math.max(...winRateData.map(d => d.rate));

  return (
    <div className="space-y-6 p-4 pb-24 md:p-6">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: '#F1F5F9' }}>
            Воронка сделок
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Управляйте продажами и этапами сделок
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{
              backgroundColor: '#1E2A42',
              border: '1px solid rgba(148,163,184,0.1)',
            }}
          >
            <Search size={14} style={{ color: '#64748B' }} />
            <input
              type="text"
              placeholder="Поиск сделок..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 bg-transparent text-sm outline-none placeholder:text-[#64748B]"
              style={{ color: '#F1F5F9' }}
            />
          </div>
          <button
            onClick={openCreateDialog}
            disabled={!permissions.canManage}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
            style={{ backgroundColor: '#D97706', opacity: permissions.canManage ? 1 : 0.45 }}
          >
            <Plus size={16} />
            Новая сделка
          </button>
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs"
            style={{
              backgroundColor: '#1E2A42',
              color: '#94A3B8',
              border: '1px solid rgba(148,163,184,0.1)',
            }}
          >
            <Filter size={14} />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as DealStage | 'all')}
              className="bg-transparent outline-none"
            >
              <option value="all">Все этапы</option>
              {stages.map((stage) => (
                <option key={stage.stage} value={stage.stage}>{stage.stage}</option>
              ))}
            </select>
            <ChevronDown size={14} />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-lg px-4 py-2.5 text-xs outline-none"
            style={{
              backgroundColor: '#1E2A42',
              color: '#94A3B8',
              border: '1px solid rgba(148,163,184,0.1)',
            }}
          >
            <option value="value-desc">Сначала крупные</option>
            <option value="value-asc">Сначала малые</option>
            <option value="activity">По сроку на этапе</option>
          </select>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((col, colIndex) => {
          const stageDeals = getDealsByStage(col.stage);
          return (
            <motion.div
              key={col.stage}
              className="w-[280px] flex-shrink-0 rounded-xl p-4"
              style={{ backgroundColor: '#0D1321' }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: colIndex * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dealId = e.dataTransfer.getData('dealId');
                if (dealId) handleDragEnd(dealId, col.stage);
              }}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
                    {col.stage}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: col.bg, color: col.color }}
                  >
                    {stageDeals.length}
                  </span>
                </div>
              </div>
              <p className="text-xs mb-3" style={{ color: '#64748B' }}>
                {getStageTotal(col.stage)}
              </p>

              {/* Deal cards */}
              <div className="space-y-3">
                {stageDeals.map((deal, i) => (
                  <motion.div
                    key={deal.id}
                    draggable={permissions.canManage}
                    onDragStart={(e) => {
                      const dt = (e as unknown as React.DragEvent).dataTransfer;
                      if (dt) dt.setData('dealId', deal.id);
                    }}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <div
                      className="rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all duration-200"
                      style={{
                        backgroundColor: '#151D2E',
                        border: '1px solid rgba(148,163,184,0.1)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[13px] font-semibold" style={{ color: '#F1F5F9' }}>
                          {deal.company}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            title={`Приоритет: ${priorityLabel[deal.priority]}`}
                            style={{ backgroundColor: priorityColor[deal.priority] }}
                          />
                          {permissions.canManage && (
                            <button
                              type="button"
                              onClick={() => openEditDialog(deal)}
                              className="rounded p-1 hover:bg-[rgba(148,163,184,0.1)]"
                            >
                              <Pencil size={12} style={{ color: '#94A3B8' }} />
                            </button>
                          )}
                          {permissions.canDelete && (
                            <button
                              type="button"
                              onClick={() => crm.deleteDeal(deal.id)}
                              className="rounded p-1 hover:bg-[rgba(239,68,68,0.12)]"
                            >
                              <Trash2 size={12} style={{ color: '#EF4444' }} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs mb-2" style={{ color: '#64748B' }}>
                        {deal.dealName}
                      </p>
                      <p className="text-lg font-semibold mb-3" style={{ color: '#F1F5F9' }}>
                        ${(deal.value / 1000).toFixed(0)}K
                      </p>
                      <div className="flex items-center justify-between">
                        <img
                          src={deal.ownerAvatar}
                          alt={deal.owner}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs" style={{ color: '#64748B' }}>
                          {deal.daysInStage} дн.
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Win Rate */}
        <motion.div
          className="rounded-xl p-5"
          style={{
            backgroundColor: '#151D2E',
            border: '1px solid rgba(148,163,184,0.1)',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-base font-semibold mb-5" style={{ color: '#F1F5F9' }}>
            Конверсия по этапам
          </h3>
          <div className="space-y-4">
            {winRateData.map((item) => (
              <div key={item.stage}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm" style={{ color: '#94A3B8' }}>
                    {item.stage}
                  </span>
                  <span className="text-xs font-medium" style={{ color: item.color }}>
                    {item.rate}%
                  </span>
                </div>
                <div
                  className="w-full h-6 rounded-md overflow-hidden"
                  style={{ backgroundColor: 'rgba(30,42,66,0.5)' }}
                >
                  <motion.div
                    className="h-full rounded-md"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.rate / maxBarValue) * 100}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Forecast */}
        <motion.div
          className="rounded-xl p-5"
          style={{
            backgroundColor: '#151D2E',
            border: '1px solid rgba(148,163,184,0.1)',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold" style={{ color: '#F1F5F9' }}>
              Прогноз выручки
            </h3>
            <div className="flex rounded-lg overflow-hidden" style={{ backgroundColor: '#1E2A42' }}>
              {(['weekly', 'monthly'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setForecastPeriod(p)}
                  className={`px-3 py-1 text-xs capitalize transition-colors cursor-pointer ${
                    forecastPeriod === p ? 'text-[#F1F5F9]' : 'text-[#64748B]'
                  }`}
                  style={{
                    backgroundColor: forecastPeriod === p ? '#1E2A42' : 'transparent',
                  }}
                >
                  {p === 'weekly' ? 'неделя' : 'месяц'}
                </button>
              ))}
            </div>
          </div>

          {/* Mini line chart */}
          <svg viewBox="0 0 400 120" className="w-full h-28">
            <defs>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="0"
                y1={30 + i * 25}
                x2="400"
                y2={30 + i * 25}
                stroke="rgba(148,163,184,0.05)"
                strokeWidth="1"
              />
            ))}
            {/* Area */}
            <polygon
              points={`0,120 ${revenueForecast.map((d, i) => {
                const x = (i / (revenueForecast.length - 1)) * 400;
                const y = 120 - ((d.value - 25000) / 35000) * 100;
                return `${x},${y}`;
              }).join(' ')} 400,120`}
              fill="url(#forecastGradient)"
            />
            {/* Line */}
            <polyline
              points={revenueForecast.map((d, i) => {
                const x = (i / (revenueForecast.length - 1)) * 400;
                const y = 120 - ((d.value - 25000) / 35000) * 100;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#D97706"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dots */}
            {revenueForecast.map((d, i) => {
              const x = (i / (revenueForecast.length - 1)) * 400;
              const y = 120 - ((d.value - 25000) / 35000) * 100;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#D97706"
                />
              );
            })}
            {/* X labels */}
            {revenueForecast.map((d, i) => {
              const x = (i / (revenueForecast.length - 1)) * 400;
              return (
                <text
                  key={i}
                  x={x}
                  y="115"
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="10"
                >
                  {d.week}
                </text>
              );
            })}
          </svg>

          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
            <span className="text-xs" style={{ color: '#64748B' }}>Общий прогноз</span>
            <p className="text-[32px] font-bold tracking-[-0.02em]" style={{ color: '#F1F5F9' }}>
              $385,000
            </p>
          </div>
        </motion.div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="border-0"
          style={{
            backgroundColor: '#151D2E',
            color: '#F1F5F9',
          }}
        >
          <DialogHeader>
            <DialogTitle>{editingDeal ? 'Редактировать сделку' : 'Новая сделка'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
              Компания
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }}
              />
            </label>
            <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
              Название сделки
              <input
                value={form.dealName}
                onChange={(e) => setForm({ ...form, dealName: e.target.value })}
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
                Этап
                <select
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value as DealStage })}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }}
                >
                  {stages.map((stage) => (
                    <option key={stage.stage} value={stage.stage}>{stage.stage}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
                Сумма
                <input
                  type="number"
                  min="0"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
                Ответственный
                <input
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }}
                />
              </label>
              <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
                Приоритет
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as Deal['priority'] })}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }}
                >
                  <option value="high">Высокий</option>
                  <option value="medium">Средний</option>
                  <option value="low">Низкий</option>
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={submitDeal}
              className="mt-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: '#D97706' }}
            >
              {editingDeal ? 'Сохранить изменения' : 'Создать сделку'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
