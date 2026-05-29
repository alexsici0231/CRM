export type DealStage = 'Новый лид' | 'Выявление потребностей' | 'Предложение отправлено' | 'Переговоры' | 'Успешно закрыта' | 'Проиграна';

export interface Deal {
  id: string;
  company: string;
  companyLogo?: string;
  dealName: string;
  stage: DealStage;
  value: number;
  lastActivity: string;
  owner: string;
  ownerAvatar: string;
  priority: 'high' | 'medium' | 'low';
  daysInStage: number;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  avatar: string;
  tags: string[];
  lastContacted: string;
  engagementScore: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  time: string;
  date: string;
}

export interface Meeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: string[];
}

export interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
  color: 'blue' | 'green' | 'orange' | 'purple';
  attendees: string[];
  location?: string;
  description?: string;
}

export interface PipelineColumn {
  stage: DealStage;
  deals: Deal[];
  color: string;
  bgColor: string;
}

export type PageId = 'dashboard' | 'deals' | 'contacts' | 'calendar' | 'settings';
