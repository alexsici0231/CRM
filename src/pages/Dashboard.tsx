import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Mail, Phone, DollarSign, FileText, ChevronRight } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import StatusBadge from '@/components/StatusBadge';
import { meetings, messages, sparklineData } from '@/data/mock';
import type { useCrmStore } from '@/services/crmStore';

interface DashboardProps {
  crm: ReturnType<typeof useCrmStore>;
}

export default function Dashboard({ crm }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const metricsRef = useRef<HTMLDivElement>(null);
  const dealsRef = useRef<HTMLDivElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);
  const commsRef = useRef<HTMLDivElement>(null);

  const toggleTask = (id: string) => {
    const task = crm.tasks.find((item) => item.id === id);
    if (task) crm.updateTask(id, { completed: !task.completed });
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    crm.addTask(newTaskTitle.trim());
    setNewTaskTitle('');
  };

  const attentionDeals = crm.deals.slice(0, 5);
  const dateStr = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 p-4 pb-24 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: '#F1F5F9' }}>
            Панель
          </h1>
          <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
            С возвращением, Алекс
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px]" style={{ color: '#64748B' }}>
            {dateStr}
          </span>
          <button className="relative p-2 rounded-lg hover:bg-[#1E2A42] transition-colors cursor-pointer">
            <Bell size={20} style={{ color: '#64748B' }} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div ref={metricsRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Выручка"
          value={142580}
          prefix="$"
          trend={12.5}
          sparklineData={sparklineData[0]}
          delay={0.4}
        />
        <MetricCard
          label="Активные сделки"
          value={24}
          trend={14.3}
          sparklineData={sparklineData[1]}
          delay={0.5}
        />
        <MetricCard
          label="Конверсия"
          value={68}
          suffix="%"
          trend={5.2}
          sparklineData={sparklineData[2]}
          delay={0.6}
        />
        <MetricCard
          label="Задачи"
          value={7}
          trend={-22.2}
          sparklineData={sparklineData[3]}
          delay={0.7}
        />
      </div>

      {/* Deals Requiring Attention */}
      <motion.div
        ref={dealsRef}
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: '#151D2E',
          border: '1px solid rgba(148,163,184,0.1)',
        }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-xl font-semibold" style={{ color: '#F1F5F9' }}>
            Сделки, требующие внимания
          </h2>
          <button className="text-xs font-medium hover:underline cursor-pointer" style={{ color: '#D97706' }}>
            Все сделки
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#1E2A42' }}>
                {['Компания', 'Сделка', 'Этап', 'Сумма', 'Активность', 'Ответственный'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium uppercase tracking-[0.05em]"
                    style={{ color: '#64748B' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attentionDeals.map((deal, i) => (
                <motion.tr
                  key={deal.id}
                  className="border-t transition-colors duration-150 hover:bg-[rgba(30,42,66,0.4)] cursor-pointer"
                  style={{ borderColor: 'rgba(148,163,184,0.1)' }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                >
                  <td className="px-4 py-3.5 text-sm font-medium" style={{ color: '#F1F5F9' }}>
                    {deal.company}
                  </td>
                  <td className="px-4 py-3.5 text-sm" style={{ color: '#94A3B8' }}>
                    {deal.dealName}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge stage={deal.stage} />
                  </td>
                  <td className="px-4 py-3.5 text-xl font-semibold" style={{ color: '#F1F5F9' }}>
                    ${deal.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: '#64748B' }}>
                    {deal.lastActivity}
                  </td>
                  <td className="px-4 py-3.5">
                    <img
                      src={deal.ownerAvatar}
                      alt={deal.owner}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Task Summary + Meetings */}
      <div ref={tasksRef} className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Today's Tasks */}
        <motion.div
          className="rounded-xl p-5 xl:col-span-3"
          style={{
            backgroundColor: '#151D2E',
            border: '1px solid rgba(148,163,184,0.1)',
          }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold" style={{ color: '#F1F5F9' }}>
                Задачи на сегодня
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(217,119,6,0.15)',
                  color: '#D97706',
                }}
              >
                {crm.tasks.filter(t => !t.completed).length}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            {crm.tasks.map((task) => (
              <motion.div
                key={task.id}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors hover:bg-[rgba(30,42,66,0.3)] cursor-pointer group"
                onClick={() => toggleTask(task.id)}
                whileTap={{ scale: 0.99 }}
              >
                <div
                  className="w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 flex-shrink-0"
                  style={{
                    borderColor: task.completed ? '#22C55E' : 'rgba(148,163,184,0.2)',
                    backgroundColor: task.completed ? 'rgba(34,197,94,0.2)' : 'transparent',
                  }}
                >
                  {task.completed && <Check size={10} className="text-[#22C55E]" />}
                </div>
                <span
                  className={`text-sm flex-1 transition-all duration-200 ${
                    task.completed ? 'line-through' : ''
                  }`}
                  style={{ color: task.completed ? '#64748B' : '#F1F5F9' }}
                >
                  {task.title}
                </span>
                <span className="text-xs flex-shrink-0" style={{ color: '#64748B' }}>
                  {task.time}
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    crm.deleteTask(task.id);
                  }}
                  className="text-xs opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color: '#EF4444' }}
                >
                  Удалить
                </button>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') addTask();
              }}
              placeholder="+ Добавить задачу..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-[#64748B]"
              style={{ color: '#F1F5F9' }}
            />
          </div>
        </motion.div>

        {/* Upcoming Meetings */}
        <motion.div
          className="rounded-xl p-5 xl:col-span-2"
          style={{
            backgroundColor: '#151D2E',
            border: '1px solid rgba(148,163,184,0.1)',
          }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-base font-semibold mb-4" style={{ color: '#F1F5F9' }}>
            Ближайшие встречи
          </h3>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="pl-3 py-2"
                style={{ borderLeft: '3px solid #D97706' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: '#D97706' }}>
                    {meeting.time}
                  </span>
                  <span className="text-xs" style={{ color: '#64748B' }}>
                    {meeting.duration}
                  </span>
                </div>
                <p className="text-[13px] mt-1" style={{ color: '#F1F5F9' }}>
                  {meeting.title}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Communication Hub */}
      <div ref={commsRef} className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Recent Messages */}
        <motion.div
          className="rounded-xl p-5"
          style={{
            backgroundColor: '#151D2E',
            border: '1px solid rgba(148,163,184,0.1)',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold" style={{ color: '#F1F5F9' }}>
              Последние сообщения
            </h3>
            <div className="flex gap-4">
              {(['inbox', 'sent'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs capitalize pb-1 border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab ? 'border-b-[#D97706] text-[#F1F5F9]' : 'border-b-transparent text-[#64748B]'
                  }`}
                >
                  {tab === 'inbox' ? 'входящие' : 'отправленные'}
                </button>
              ))}
            </div>
          </div>
          <div>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className="flex items-start gap-3 py-3 border-b last:border-b-0 transition-colors hover:bg-[rgba(30,42,66,0.3)] rounded-lg px-2 -mx-2 cursor-pointer"
                style={{ borderColor: 'rgba(148,163,184,0.1)' }}
                whileHover={{ x: 2 }}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={msg.senderAvatar}
                    alt={msg.sender}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {msg.unread && (
                    <span className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full bg-[#D97706]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium" style={{ color: '#F1F5F9' }}>
                      {msg.sender}
                    </span>
                    <span className="text-xs flex-shrink-0" style={{ color: '#64748B' }}>
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-[13px] font-medium truncate" style={{ color: '#F1F5F9' }}>
                    {msg.subject}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#64748B' }}>
                    {msg.preview}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="rounded-xl p-5"
          style={{
            backgroundColor: '#151D2E',
            border: '1px solid rgba(148,163,184,0.1)',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          <h3 className="text-base font-semibold mb-4" style={{ color: '#F1F5F9' }}>
            Быстрые действия
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Mail, label: 'Отправить письмо' },
              { icon: Phone, label: 'Назначить звонок' },
              { icon: DollarSign, label: 'Создать сделку' },
              { icon: FileText, label: 'Добавить заметку' },
            ].map(({ icon: Icon, label }) => (
              <motion.button
                key={label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: '#1E2A42',
                  borderColor: 'rgba(148,163,184,0.1)',
                }}
                whileHover={{
                  borderColor: '#D97706',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon size={20} style={{ color: '#94A3B8' }} />
                <span className="text-[13px]" style={{ color: '#F1F5F9' }}>
                  {label}
                </span>
              </motion.button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
            <p className="text-xs mb-2" style={{ color: '#64748B' }}>
              Последние шаблоны
            </p>
            {['Шаблон предложения', 'Письмо follow-up', 'Черновик контракта'].map((template) => (
              <button
                key={template}
                className="flex items-center gap-2 py-1.5 text-xs transition-colors hover:text-[#D97706] cursor-pointer"
                style={{ color: '#94A3B8' }}
              >
                <ChevronRight size={12} />
                {template}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
