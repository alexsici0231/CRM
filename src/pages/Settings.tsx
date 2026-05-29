import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Building2, Bell, Plug, Shield, CreditCard } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { AppUser, UserRole } from '@/lib/auth';
import type { Locale } from '@/lib/i18n';
import { locales } from '@/lib/i18n';

type SettingsTab = 'profile' | 'company' | 'notifications' | 'integrations' | 'security' | 'billing';

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Профиль', icon: User },
  { id: 'company', label: 'Компания', icon: Building2 },
  { id: 'notifications', label: 'Уведомления', icon: Bell },
  { id: 'integrations', label: 'Интеграции', icon: Plug },
  { id: 'security', label: 'Безопасность', icon: Shield },
  { id: 'billing', label: 'Оплата', icon: CreditCard },
];

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all placeholder:text-[#64748B] focus:ring-1 focus:ring-[#D97706]';
const labelClass = 'text-xs font-medium block mb-1.5';

interface SettingsProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  user: AppUser;
  onUserChange: (user: AppUser) => void;
  onResetData: () => void;
}

export default function Settings({ locale, onLocaleChange, user, onUserChange, onResetData }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [notifications, setNotifications] = useState({
    dealEmails: true,
    taskReminders: true,
    meetingAlerts: true,
    weeklySummary: false,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: '#F1F5F9' }}>
          Настройки
        </h1>
        <button
          className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white cursor-pointer opacity-50"
          style={{ backgroundColor: '#D97706' }}
        >
          Сохранить
        </button>
      </div>

      {/* Settings Layout */}
      <div className="flex gap-6">
        {/* Sub Navigation */}
        <div className="w-[200px] flex-shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                  isActive ? 'font-medium' : ''
                }`}
                style={{
                  backgroundColor: isActive ? '#1E2A42' : 'transparent',
                  color: isActive ? '#F1F5F9' : '#64748B',
                  borderLeft: isActive ? '3px solid #D97706' : '3px solid transparent',
                }}
                whileHover={{ x: isActive ? 0 : 2 }}
              >
                <Icon size={16} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <div
          className="flex-1 rounded-xl p-6"
          style={{
            backgroundColor: '#151D2E',
            border: '1px solid rgba(148,163,184,0.1)',
          }}
        >
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-6" style={{ color: '#F1F5F9' }}>
                Настройки профиля
              </h2>

              {/* Avatar Upload */}
              <div className="mb-8">
                <label className={labelClass} style={{ color: '#64748B' }}>
                  Фото профиля
                </label>
                <div className="relative w-20 h-20">
                  <img
                    src="/assets/avatar-alex.jpg"
                    alt="Профиль"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <button
                    className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <Camera size={20} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Имя
                  </label>
                  <input
                    type="text"
                    value={user.name.split(' ')[0] || ''}
                    onChange={(event) => {
                      const [, lastName = ''] = user.name.split(' ');
                      onUserChange({ ...user, name: `${event.target.value} ${lastName}`.trim() });
                    }}
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Фамилия
                  </label>
                  <input
                    type="text"
                    value={user.name.split(' ')[1] || ''}
                    onChange={(event) => {
                      const [firstName = ''] = user.name.split(' ');
                      onUserChange({ ...user, name: `${firstName} ${event.target.value}`.trim() });
                    }}
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="alex@octavia.com"
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Телефон
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Должность
                  </label>
                  <input
                    type="text"
                    value={user.title}
                    onChange={(event) => onUserChange({ ...user, title: event.target.value })}
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Роль
                  </label>
                  <select
                    value={user.role}
                    onChange={(event) => onUserChange({ ...user, role: event.target.value as UserRole })}
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  >
                    <option value="admin">Администратор</option>
                    <option value="manager">Менеджер</option>
                    <option value="viewer">Наблюдатель</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Язык интерфейса
                  </label>
                  <select
                    value={locale}
                    onChange={(event) => onLocaleChange(event.target.value as Locale)}
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  >
                    {Object.entries(locales).map(([id, label]) => (
                      <option key={id} value={id}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Данные
                  </label>
                  <button
                    type="button"
                    onClick={onResetData}
                    className="w-full rounded-lg px-3.5 py-2.5 text-left text-sm"
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#EF4444',
                    }}
                  >
                    Сбросить демо-данные
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass} style={{ color: '#64748B' }}>
                    О себе
                </label>
                <textarea
                  rows={4}
                  defaultValue="Опытный менеджер по продажам с историей перевыполнения планов и выстраивания прочных отношений с клиентами."
                  className={inputClass}
                  style={{
                    backgroundColor: '#1E2A42',
                    border: '1px solid rgba(148,163,184,0.1)',
                    color: '#F1F5F9',
                    resize: 'vertical',
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-6" style={{ color: '#F1F5F9' }}>
                Настройки уведомлений
              </h2>
              <div className="space-y-6">
                {[
                  {
                    key: 'dealEmails',
                    label: 'Email-уведомления о новых сделках',
                    description: 'Получать письмо, когда вам назначают новую сделку',
                  },
                  {
                    key: 'taskReminders',
                    label: 'Напоминания о задачах',
                    description: 'Получать напоминания о задачах и дедлайнах',
                  },
                  {
                    key: 'meetingAlerts',
                    label: 'Оповещения о встречах',
                    description: 'Получать уведомления перед запланированными встречами',
                  },
                  {
                    key: 'weeklySummary',
                    label: 'Еженедельная сводка',
                    description: 'Получать еженедельный дайджест активности и метрик',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-3 border-b"
                    style={{ borderColor: 'rgba(148,163,184,0.1)' }}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                        {item.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                        {item.description}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Company Settings */}
          {activeTab === 'company' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-6" style={{ color: '#F1F5F9' }}>
                Настройки компании
              </h2>

              {/* Company Logo */}
              <div className="mb-6">
                <label className={labelClass} style={{ color: '#64748B' }}>
                  Логотип компании
                </label>
                <div
                  className="w-[120px] h-[80px] rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#0D1321' }}
                >
                  <span className="text-2xl font-bold" style={{ color: '#D97706' }}>
                    O
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Название компании
                  </label>
                  <input
                    type="text"
                    defaultValue="Octavia Inc."
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Website
                  </label>
                  <input
                    type="text"
                    defaultValue="octavia.com"
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Отрасль
                  </label>
                  <select
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  >
                    <option>Технологии</option>
                    <option>Финансы</option>
                    <option>Здравоохранение</option>
                    <option>Производство</option>
                    <option>Ритейл</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#64748B' }}>
                    Размер команды
                  </label>
                  <select
                    className={inputClass}
                    style={{
                      backgroundColor: '#1E2A42',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: '#F1F5F9',
                    }}
                  >
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-500</option>
                    <option>500+</option>
                  </select>
                </div>
              </div>

              {/* Team Members */}
              <div className="mt-8">
                <h3 className="text-base font-semibold mb-4" style={{ color: '#F1F5F9' }}>
                  Команда
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Алекс Джонсон', role: 'Менеджер', status: 'active', avatar: '/assets/avatar-alex.jpg' },
                    { name: 'Сара Чен', role: 'Менеджер по продажам', status: 'active', avatar: '/assets/avatar-sarah.jpg' },
                    { name: 'Майкл Росс', role: 'Менеджер по продажам', status: 'active', avatar: '/assets/avatar-michael.jpg' },
                    { name: 'Эмма Уилсон', role: 'Аккаунт-менеджер', status: 'inactive', avatar: '/assets/avatar-emma.jpg' },
                  ].map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg"
                      style={{ backgroundColor: '#0D1321' }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                            {member.name}
                          </p>
                          <p className="text-xs" style={{ color: '#64748B' }}>
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize"
                        style={{
                          backgroundColor: member.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: member.status === 'active' ? '#22C55E' : '#EF4444',
                        }}
                      >
                        {member.status === 'active' ? 'активен' : 'неактивен'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tabs placeholder */}
          {['integrations', 'security', 'billing'].includes(activeTab) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#1E2A42' }}
              >
                {activeTab === 'integrations' && <Plug size={24} style={{ color: '#64748B' }} />}
                {activeTab === 'security' && <Shield size={24} style={{ color: '#64748B' }} />}
                {activeTab === 'billing' && <CreditCard size={24} style={{ color: '#64748B' }} />}
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#F1F5F9' }}>
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Скоро появится
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
