import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Grid3X3, List, Mail, Phone, MapPin, Building2, TrendingUp, Trash2 } from 'lucide-react';
import type { Contact } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AppUser } from '@/lib/auth';
import { rolePermissions } from '@/lib/auth';
import type { NewContact, useCrmStore } from '@/services/crmStore';

type CrmStore = ReturnType<typeof useCrmStore>;

const emptyContact: NewContact = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  title: '',
  company: '',
  tags: [],
};

function ContactCard({
  contact,
  onClick,
  onDelete,
  canDelete,
}: {
  contact: Contact;
  onClick: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`;

  return (
    <motion.div
      className="relative rounded-xl p-5 cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: '#151D2E',
        border: '1px solid rgba(148,163,184,0.1)',
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        borderColor: '#D97706',
      }}
      onClick={onClick}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3 h-14 w-14 overflow-hidden rounded-full" style={{ backgroundColor: '#1E2A42' }}>
          <img
            src={contact.avatar}
            alt={`${contact.firstName} ${contact.lastName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="w-full h-full flex items-center justify-center text-lg font-semibold" style={{ color: '#D97706' }}>
            {initials}
          </div>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute right-3 top-3 rounded-lg p-1.5 hover:bg-[rgba(239,68,68,0.12)]"
          >
            <Trash2 size={14} style={{ color: '#EF4444' }} />
          </button>
        )}
        <h4 className="text-base font-semibold" style={{ color: '#F1F5F9' }}>
          {contact.firstName} {contact.lastName}
        </h4>
        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
          {contact.title}, {contact.company}
        </p>
        <div className="flex flex-wrap gap-1.5 justify-center mt-3">
          {contact.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                backgroundColor: 'rgba(217,119,6,0.1)',
                color: '#D97706',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 pt-3 w-full border-t space-y-1.5" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
          <div className="flex items-center gap-2 justify-center">
            <Mail size={11} style={{ color: '#64748B' }} />
            <span className="text-[11px] truncate" style={{ color: '#94A3B8' }}>
              {contact.email}
            </span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Phone size={11} style={{ color: '#64748B' }} />
            <span className="text-[11px]" style={{ color: '#94A3B8' }}>
              {contact.phone}
            </span>
          </div>
        </div>
        <p className="text-[10px] mt-2" style={{ color: '#64748B' }}>
          Последний контакт: {contact.lastContacted}
        </p>
      </div>
    </motion.div>
  );
}

function ContactDetailModal({
  contact,
  open,
  onClose,
  canManage,
  onEdit,
}: {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
  canManage: boolean;
  onEdit: (contact: Contact) => void;
}) {
  if (!contact) return null;

  const initials = `${contact.firstName[0]}${contact.lastName[0]}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[640px] p-0 overflow-hidden border-0"
        style={{
          backgroundColor: '#151D2E',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: '#1E2A42' }}>
              <img
                src={contact.avatar}
                alt={`${contact.firstName} ${contact.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: '#D97706' }}>
                {initials}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-[28px] font-bold" style={{ color: '#F1F5F9' }}>
                {contact.firstName} {contact.lastName}
              </h2>
              <p className="text-base mt-0.5" style={{ color: '#64748B' }}>
                {contact.title}
              </p>
              <span
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(217,119,6,0.1)',
                  color: '#D97706',
                }}
              >
                <Building2 size={12} />
                {contact.company}
              </span>
              {canManage && (
                <button
                  type="button"
                  onClick={() => onEdit(contact)}
                  className="ml-3 inline-flex rounded-lg px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: '#D97706', color: '#fff' }}
                >
                  Редактировать
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList
            className="w-full rounded-none border-b px-6 gap-0"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(148,163,184,0.1)',
            }}
          >
            {[
              { id: 'overview', label: 'Обзор' },
              { id: 'activity', label: 'Активность' },
              { id: 'deals', label: 'Сделки' },
              { id: 'notes', label: 'Заметки' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-[#D97706] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 text-xs"
                style={{ color: '#64748B' }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="p-6 mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: '#64748B' }}>Email</label>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#F1F5F9' }}>
                    <Mail size={14} style={{ color: '#94A3B8' }} />
                    {contact.email}
                  </div>
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: '#64748B' }}>Телефон</label>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#F1F5F9' }}>
                    <Phone size={14} style={{ color: '#94A3B8' }} />
                    {contact.phone}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs block mb-1" style={{ color: '#64748B' }}>Источник</label>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#F1F5F9' }}>
                    <MapPin size={14} style={{ color: '#94A3B8' }} />
                    Заявка с сайта
                  </div>
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: '#64748B' }}>Теги</label>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                          backgroundColor: 'rgba(217,119,6,0.1)',
                          color: '#D97706',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Score */}
            <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: '#0D1321' }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} style={{ color: '#D97706' }} />
                <span className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                  Индекс вовлеченности
                </span>
              </div>
              <div className="flex items-center gap-4">
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle
                    cx="30"
                    cy="30"
                    r="24"
                    fill="none"
                    stroke="rgba(30,42,66,0.5)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="24"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(contact.engagementScore / 100) * 150.8} 150.8`}
                    transform="rotate(-90 30 30)"
                  />
                  <text x="30" y="34" textAnchor="middle" fill="#F1F5F9" fontSize="14" fontWeight="600">
                    {contact.engagementScore}
                  </text>
                </svg>
                <div>
                  <p className="text-sm" style={{ color: '#94A3B8' }}>
                    {contact.engagementScore >= 80
                      ? 'Высокая вовлеченность'
                      : contact.engagementScore >= 60
                      ? 'Средняя вовлеченность'
                      : 'Низкая вовлеченность'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                    Последний контакт: {contact.lastContacted}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="p-6 mt-0">
            <div className="space-y-4">
              {[
                { type: 'email', title: 'Отправлено follow-up письмо', time: '2 дня назад', icon: Mail },
                { type: 'call', title: 'Проведен discovery-звонок', time: '1 неделю назад', icon: Phone },
                { type: 'meeting', title: 'Вводная встреча', time: '2 недели назад', icon: Building2 },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#1E2A42' }}
                  >
                    <activity.icon size={14} style={{ color: '#94A3B8' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#F1F5F9' }}>{activity.title}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deals" className="p-6 mt-0">
            <p className="text-sm" style={{ color: '#94A3B8' }}>
              С этим контактом связаны 2 активные сделки
            </p>
          </TabsContent>

          <TabsContent value="notes" className="p-6 mt-0">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#0D1321' }}>
              <p className="text-sm" style={{ color: '#94A3B8' }}>
                Первый контакт пришел через заявку на сайте. Интересуются enterprise-функциями. Бюджет подтвержден на уровне $50K+.
              </p>
              <p className="text-xs mt-2" style={{ color: '#64748B' }}>
                Добавил Алекс Джонсон - 3 дня назад
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default function Contacts({ crm, user }: { crm: CrmStore; user: AppUser }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<NewContact>(emptyContact);
  const permissions = rolePermissions[user.role];

  const filteredContacts = crm.contacts.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };

  const openCreateContact = () => {
    setEditingContact(null);
    setForm(emptyContact);
    setFormOpen(true);
  };

  const openEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      title: contact.title,
      company: contact.company,
      tags: contact.tags,
    });
    setModalOpen(false);
    setFormOpen(true);
  };

  const submitContact = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) return;

    if (editingContact) {
      crm.updateContact(editingContact.id, form);
    } else {
      crm.addContact(form);
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6 p-4 pb-24 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: '#F1F5F9' }}>
            Контакты
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Всего контактов: {crm.contacts.length.toLocaleString('ru-RU')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openCreateContact}
            disabled={!permissions.canManage}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
            style={{ backgroundColor: '#D97706', opacity: permissions.canManage ? 1 : 0.45 }}
          >
            <Plus size={16} />
            Добавить контакт
          </button>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              backgroundColor: '#1E2A42',
              border: '1px solid rgba(148,163,184,0.1)',
            }}
          >
            <Search size={14} style={{ color: '#64748B' }} />
            <input
              type="text"
              placeholder="Поиск контактов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm outline-none w-44 placeholder:text-[#64748B]"
              style={{ color: '#F1F5F9' }}
            />
          </div>
          <div className="flex rounded-lg overflow-hidden" style={{ backgroundColor: '#1E2A42' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 cursor-pointer transition-colors ${viewMode === 'grid' ? 'text-[#F1F5F9]' : 'text-[#64748B]'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 cursor-pointer transition-colors ${viewMode === 'list' ? 'text-[#F1F5F9]' : 'text-[#64748B]'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Directory */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredContacts.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <ContactCard
                  contact={contact}
                  onClick={() => handleContactClick(contact)}
                  canDelete={permissions.canDelete}
                  onDelete={() => crm.deleteContact(contact.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: '#151D2E',
              border: '1px solid rgba(148,163,184,0.1)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#1E2A42' }}>
                  {['Имя', 'Компания', 'Должность', 'Email', 'Телефон', 'Последний контакт', 'Теги'].map((h) => (
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
                {filteredContacts.map((contact, i) => (
                  <motion.tr
                    key={contact.id}
                    className="border-t transition-colors hover:bg-[rgba(30,42,66,0.4)] cursor-pointer"
                    style={{ borderColor: 'rgba(148,163,184,0.1)' }}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleContactClick(contact)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden" style={{ backgroundColor: '#1E2A42' }}>
                          <div className="w-full h-full flex items-center justify-center text-xs font-semibold" style={{ color: '#D97706' }}>
                            {contact.firstName[0]}{contact.lastName[0]}
                          </div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                          {contact.firstName} {contact.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#94A3B8' }}>{contact.company}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#94A3B8' }}>{contact.title}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#94A3B8' }}>{contact.email}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#94A3B8' }}>{contact.phone}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>{contact.lastContacted}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {contact.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{
                              backgroundColor: 'rgba(217,119,6,0.1)',
                              color: '#D97706',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {permissions.canDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            crm.deleteContact(contact.id);
                          }}
                          className="mt-2 rounded p-1 hover:bg-[rgba(239,68,68,0.12)]"
                        >
                          <Trash2 size={14} style={{ color: '#EF4444' }} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        canManage={permissions.canManage}
        onEdit={openEditContact}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="border-0" style={{ backgroundColor: '#151D2E', color: '#F1F5F9' }}>
          <DialogHeader>
            <DialogTitle>{editingContact ? 'Редактировать контакт' : 'Новый контакт'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
                Имя
                <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }} />
              </label>
              <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
                Фамилия
                <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }} />
              </label>
            </div>
            <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
              Email
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }} />
            </label>
            <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
              Телефон
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
                Должность
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }} />
              </label>
              <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
                Компания
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }} />
              </label>
            </div>
            <label className="grid gap-1 text-xs" style={{ color: '#94A3B8' }}>
              Теги через запятую
              <input value={form.tags.join(', ')} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: '#1E2A42', color: '#F1F5F9' }} />
            </label>
            <button type="button" onClick={submitContact} className="mt-2 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#D97706' }}>
              {editingContact ? 'Сохранить изменения' : 'Создать контакт'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
