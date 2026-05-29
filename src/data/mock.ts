import type { Deal, Contact, Task, Meeting, Message, CalendarEvent } from '@/types';

export const deals: Deal[] = [
  { id: '1', company: 'Acme Inc', dealName: 'Корпоративная лицензия', stage: 'Предложение отправлено', value: 45000, lastActivity: '2 часа назад', owner: 'Алекс Джонсон', ownerAvatar: '/assets/avatar-alex.jpg', priority: 'high', daysInStage: 5 },
  { id: '2', company: 'Globex Corp', dealName: 'Пакет консалтинга', stage: 'Переговоры', value: 28500, lastActivity: '5 часов назад', owner: 'Сара Чен', ownerAvatar: '/assets/avatar-sarah.jpg', priority: 'medium', daysInStage: 3 },
  { id: '3', company: 'Soylent Co', dealName: 'Годовой контракт', stage: 'Выявление потребностей', value: 62000, lastActivity: '1 день назад', owner: 'Майкл Росс', ownerAvatar: '/assets/avatar-michael.jpg', priority: 'high', daysInStage: 8 },
  { id: '4', company: 'Initech LLC', dealName: 'Расширение команды', stage: 'Предложение отправлено', value: 18200, lastActivity: '1 день назад', owner: 'Алекс Джонсон', ownerAvatar: '/assets/avatar-alex.jpg', priority: 'low', daysInStage: 4 },
  { id: '5', company: 'Umbrella Enterprises', dealName: 'Индивидуальная интеграция', stage: 'Переговоры', value: 95000, lastActivity: '2 дня назад', owner: 'Эмма Уилсон', ownerAvatar: '/assets/avatar-emma.jpg', priority: 'high', daysInStage: 6 },
  { id: '6', company: 'Stark Industries', dealName: 'Лицензия платформы', stage: 'Новый лид', value: 78000, lastActivity: '3 часа назад', owner: 'Сара Чен', ownerAvatar: '/assets/avatar-sarah.jpg', priority: 'medium', daysInStage: 1 },
  { id: '7', company: 'Wayne Corp', dealName: 'Корпоративная сделка', stage: 'Новый лид', value: 120000, lastActivity: '1 день назад', owner: 'Майкл Росс', ownerAvatar: '/assets/avatar-michael.jpg', priority: 'high', daysInStage: 2 },
  { id: '8', company: 'Cyberdyne', dealName: 'Интеграция ИИ', stage: 'Выявление потребностей', value: 54000, lastActivity: '4 часа назад', owner: 'Алекс Джонсон', ownerAvatar: '/assets/avatar-alex.jpg', priority: 'medium', daysInStage: 5 },
  { id: '9', company: 'Massive Dynamic', dealName: 'Исследовательский пакет', stage: 'Выявление потребностей', value: 35000, lastActivity: '6 часов назад', owner: 'Эмма Уилсон', ownerAvatar: '/assets/avatar-emma.jpg', priority: 'low', daysInStage: 3 },
  { id: '10', company: 'Oceanic Airlines', dealName: 'Сервисный контракт', stage: 'Новый лид', value: 22000, lastActivity: '2 дня назад', owner: 'Сара Чен', ownerAvatar: '/assets/avatar-sarah.jpg', priority: 'low', daysInStage: 1 },
  { id: '11', company: 'Dharma Initiative', dealName: 'Финансирование исследований', stage: 'Предложение отправлено', value: 67000, lastActivity: '12 часов назад', owner: 'Майкл Росс', ownerAvatar: '/assets/avatar-michael.jpg', priority: 'medium', daysInStage: 7 },
  { id: '12', company: 'Aperture Science', dealName: 'Портальная технология', stage: 'Успешно закрыта', value: 89000, lastActivity: '1 неделю назад', owner: 'Алекс Джонсон', ownerAvatar: '/assets/avatar-alex.jpg', priority: 'high', daysInStage: 0 },
  { id: '13', company: 'Black Mesa', dealName: 'Исследовательский грант', stage: 'Успешно закрыта', value: 110000, lastActivity: '3 дня назад', owner: 'Эмма Уилсон', ownerAvatar: '/assets/avatar-emma.jpg', priority: 'medium', daysInStage: 0 },
  { id: '14', company: 'Tyrell Corp', dealName: 'Лицензия репликантов', stage: 'Выявление потребностей', value: 150000, lastActivity: '8 часов назад', owner: 'Сара Чен', ownerAvatar: '/assets/avatar-sarah.jpg', priority: 'high', daysInStage: 4 },
  { id: '15', company: 'Weyland-Yutani', dealName: 'Колониальный контракт', stage: 'Предложение отправлено', value: 200000, lastActivity: '1 день назад', owner: 'Майкл Росс', ownerAvatar: '/assets/avatar-michael.jpg', priority: 'high', daysInStage: 10 },
  { id: '16', company: 'Omni Consumer', dealName: 'Линейка продуктов', stage: 'Новый лид', value: 31000, lastActivity: '5 часов назад', owner: 'Алекс Джонсон', ownerAvatar: '/assets/avatar-alex.jpg', priority: 'low', daysInStage: 1 },
  { id: '17', company: 'Gringotts Bank', dealName: 'Безопасность хранилища', stage: 'Переговоры', value: 75000, lastActivity: '3 дня назад', owner: 'Эмма Уилсон', ownerAvatar: '/assets/avatar-emma.jpg', priority: 'medium', daysInStage: 8 },
];

export const contacts: Contact[] = [
  { id: '1', firstName: 'Джон', lastName: 'Смит', email: 'john@acmeinc.com', phone: '+1 (555) 123-4567', title: 'VP по продажам', company: 'Acme Inc', avatar: '/assets/company-logo-acme.jpg', tags: ['Enterprise', 'VIP'], lastContacted: '2 дня назад', engagementScore: 85 },
  { id: '2', firstName: 'Лиза', lastName: 'Вонг', email: 'lisa@globex.com', phone: '+1 (555) 234-5678', title: 'Менеджер по закупкам', company: 'Globex Corp', avatar: '/assets/company-logo-globex.jpg', tags: ['Средний бизнес'], lastContacted: '5 часов назад', engagementScore: 72 },
  { id: '3', firstName: 'Роберт', lastName: 'Грин', email: 'robert@soylent.com', phone: '+1 (555) 345-6789', title: 'CEO', company: 'Soylent Co', avatar: '/assets/company-logo-soylent.jpg', tags: ['Enterprise', 'ЛПР'], lastContacted: '1 день назад', engagementScore: 91 },
  { id: '4', firstName: 'Милтон', lastName: 'Уэддамс', email: 'milton@initech.com', phone: '+1 (555) 456-7890', title: 'IT-менеджер', company: 'Initech LLC', avatar: '/assets/company-logo-acme.jpg', tags: ['SMB'], lastContacted: '3 дня назад', engagementScore: 45 },
  { id: '5', firstName: 'Альберт', lastName: 'Вескер', email: 'awesker@umbrella.com', phone: '+1 (555) 567-8901', title: 'Операционный директор', company: 'Umbrella Enterprises', avatar: '/assets/company-logo-globex.jpg', tags: ['Enterprise', 'VIP'], lastContacted: '1 неделю назад', engagementScore: 68 },
  { id: '6', firstName: 'Тони', lastName: 'Старк', email: 'tony@stark.com', phone: '+1 (555) 678-9012', title: 'CEO', company: 'Stark Industries', avatar: '/assets/company-logo-acme.jpg', tags: ['Enterprise', 'VIP', 'ЛПР'], lastContacted: '3 часа назад', engagementScore: 95 },
  { id: '7', firstName: 'Брюс', lastName: 'Уэйн', email: 'bruce@wayne.com', phone: '+1 (555) 789-0123', title: 'Председатель', company: 'Wayne Corp', avatar: '/assets/company-logo-globex.jpg', tags: ['Enterprise', 'VIP'], lastContacted: '2 дня назад', engagementScore: 88 },
  { id: '8', firstName: 'Сара', lastName: 'Коннор', email: 'sarah@cyberdyne.com', phone: '+1 (555) 890-1234', title: 'CTO', company: 'Cyberdyne', avatar: '/assets/company-logo-soylent.jpg', tags: ['Enterprise', 'Технический'], lastContacted: '4 часа назад', engagementScore: 76 },
  { id: '9', firstName: 'Уолтер', lastName: 'Бишоп', email: 'walter@massivedynamic.com', phone: '+1 (555) 901-2345', title: 'Главный ученый', company: 'Massive Dynamic', avatar: '/assets/company-logo-acme.jpg', tags: ['Средний бизнес', 'Технический'], lastContacted: '6 часов назад', engagementScore: 63 },
  { id: '10', firstName: 'Джек', lastName: 'Шепард', email: 'jack@oceanic.com', phone: '+1 (555) 012-3456', title: 'Руководитель операций', company: 'Oceanic Airlines', avatar: '/assets/company-logo-globex.jpg', tags: ['SMB'], lastContacted: '2 дня назад', engagementScore: 54 },
  { id: '11', firstName: 'Десмонд', lastName: 'Хьюм', email: 'desmond@dharma.com', phone: '+1 (555) 111-2222', title: 'Директор исследований', company: 'Dharma Initiative', avatar: '/assets/company-logo-soylent.jpg', tags: ['Средний бизнес', 'Технический'], lastContacted: '12 часов назад', engagementScore: 71 },
  { id: '12', firstName: 'Кейв', lastName: 'Джонсон', email: 'cave@aperture.com', phone: '+1 (555) 222-3333', title: 'Основатель', company: 'Aperture Science', avatar: '/assets/company-logo-acme.jpg', tags: ['Enterprise', 'VIP', 'ЛПР'], lastContacted: '1 неделю назад', engagementScore: 92 },
];

export const tasks: Task[] = [
  { id: '1', title: 'Связаться с Acme Inc', completed: false, time: '10:00', date: '2025-03-17' },
  { id: '2', title: 'Подготовить предложение для Globex', completed: false, time: '11:30', date: '2025-03-17' },
  { id: '3', title: 'Созвониться с командой Soylent Co', completed: true, time: '14:00', date: '2025-03-17' },
  { id: '4', title: 'Проверить условия контракта', completed: false, time: '16:00', date: '2025-03-17' },
];

export const meetings: Meeting[] = [
  { id: '1', title: 'Ежедневный стендап', time: '09:00', duration: '15 мин', attendees: ['Алекс', 'Сара', 'Майкл'] },
  { id: '2', title: 'Acme Inc - Обсуждение предложения', time: '10:00', duration: '45 мин', attendees: ['Алекс', 'Джон'] },
  { id: '3', title: 'Soylent Co - Discovery-звонок', time: '14:00', duration: '30 мин', attendees: ['Алекс', 'Роберт'] },
];

export const messages: Message[] = [
  { id: '1', sender: 'Сара Чен', senderAvatar: '/assets/avatar-sarah.jpg', subject: 'Re: предложение Globex', preview: 'Я посмотрела условия, есть несколько вопросов по структуре цены...', time: '10:32', unread: true },
  { id: '2', sender: 'Майк Росс', senderAvatar: '/assets/avatar-michael.jpg', subject: 'Контракт Soylent', preview: 'Можем назначить звонок, чтобы обсудить сроки и результаты?', time: 'Вчера', unread: true },
  { id: '3', sender: 'Эмма Уилсон', senderAvatar: '/assets/avatar-emma.jpg', subject: 'Спецификация интеграции Umbrella', preview: 'Я приложила технические требования для вашего просмотра...', time: 'Вчера', unread: false },
  { id: '4', sender: 'Тони Старк', senderAvatar: '/assets/avatar-alex.jpg', subject: 'Stark Industries - планы на Q2', preview: 'Давайте обсудим цели и показатели на следующий квартал.', time: '15 мар', unread: false },
];

export const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Ежедневный стендап', startTime: '09:00', endTime: '09:15', date: new Date(2025, 2, 17), color: 'green', attendees: ['Алекс', 'Сара', 'Майкл'], location: 'Zoom' },
  { id: '2', title: 'Acme Inc - Обсуждение предложения', startTime: '10:00', endTime: '10:45', date: new Date(2025, 2, 17), color: 'blue', attendees: ['Алекс', 'Джон Смит'], location: 'Переговорная A' },
  { id: '3', title: 'Soylent Co - Discovery', startTime: '14:00', endTime: '14:30', date: new Date(2025, 2, 17), color: 'orange', attendees: ['Алекс', 'Роберт Грин'], location: 'Google Meet' },
  { id: '4', title: 'Проверка контракта', startTime: '16:00', endTime: '16:30', date: new Date(2025, 2, 17), color: 'purple', attendees: ['Алекс'], location: 'Офис' },
  { id: '5', title: 'Командный обед', startTime: '12:00', endTime: '13:00', date: new Date(2025, 2, 18), color: 'green', attendees: ['Алекс', 'Сара', 'Майкл', 'Эмма'], location: 'Кафетерий' },
  { id: '6', title: 'Globex Corp - Повторный контакт', startTime: '11:00', endTime: '11:30', date: new Date(2025, 2, 18), color: 'blue', attendees: ['Алекс', 'Лиза Вонг'], location: 'Zoom' },
  { id: '7', title: 'Обзор Q1', startTime: '15:00', endTime: '16:00', date: new Date(2025, 2, 19), color: 'purple', attendees: ['Алекс', 'Сара', 'Майкл', 'Эмма'], location: 'Переговорная' },
  { id: '8', title: 'Initech - Демонстрация', startTime: '10:00', endTime: '10:45', date: new Date(2025, 2, 20), color: 'orange', attendees: ['Алекс', 'Милтон Уэддамс'], location: 'Google Meet' },
  { id: '9', title: 'Обзор воронки', startTime: '14:00', endTime: '15:00', date: new Date(2025, 2, 20), color: 'blue', attendees: ['Алекс', 'Сара'], location: 'Переговорная B' },
  { id: '10', title: 'Stark Industries - Старт проекта', startTime: '09:30', endTime: '10:30', date: new Date(2025, 2, 21), color: 'green', attendees: ['Алекс', 'Тони Старк'], location: 'Zoom' },
];

export const sparklineData = [
  [42000, 45000, 48000, 52000, 58000, 62000, 68000, 72000, 85000, 92000, 110000, 142580],
  [18, 19, 20, 21, 20, 22, 23, 22, 24, 23, 24, 24],
  [52, 53, 55, 56, 58, 60, 61, 63, 65, 66, 67, 68],
  [12, 11, 10, 9, 10, 8, 9, 8, 7, 8, 7, 7],
];

export const winRateData = [
  { stage: 'Новый лид', rate: 85, color: '#06B6D4' },
  { stage: 'Выявление потребностей', rate: 72, color: '#3B82F6' },
  { stage: 'Предложение', rate: 58, color: '#F97316' },
  { stage: 'Переговоры', rate: 45, color: '#A855F7' },
];

export const revenueForecast = [
  { week: 'Н1', value: 32000 },
  { week: 'Н2', value: 45000 },
  { week: 'Н3', value: 38000 },
  { week: 'Н4', value: 52000 },
];
