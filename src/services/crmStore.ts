import { useCallback, useEffect, useMemo, useState } from 'react';
import { calendarEvents, contacts, deals, tasks } from '@/data/mock';
import type { CalendarEvent, Contact, Deal, Task } from '@/types';

const STORAGE_KEY = 'octavia-crm-data-v1';

export interface CrmData {
  deals: Deal[];
  contacts: Contact[];
  tasks: Task[];
  calendarEvents: CalendarEvent[];
}

export type NewDeal = Omit<Deal, 'id' | 'ownerAvatar' | 'daysInStage' | 'lastActivity'>;
export type NewContact = Omit<Contact, 'id' | 'avatar' | 'lastContacted' | 'engagementScore'>;
export type NewCalendarEvent = Omit<CalendarEvent, 'id'>;

const seedData: CrmData = {
  deals,
  contacts,
  tasks,
  calendarEvents,
};

function reviveDates(data: CrmData): CrmData {
  return {
    ...data,
    calendarEvents: data.calendarEvents.map((event) => ({
      ...event,
      date: new Date(event.date),
    })),
  };
}

function readData(): CrmData {
  if (typeof window === 'undefined') return seedData;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return seedData;

  try {
    return reviveDates(JSON.parse(stored) as CrmData);
  } catch {
    return seedData;
  }
}

function persistData(data: CrmData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useCrmStore() {
  const [data, setData] = useState<CrmData>(() => readData());

  useEffect(() => {
    persistData(data);
  }, [data]);

  const updateData = useCallback((updater: (current: CrmData) => CrmData) => {
    setData((current) => updater(current));
  }, []);

  const api = useMemo(() => ({
    addDeal(input: NewDeal) {
      const deal: Deal = {
        ...input,
        id: createId('deal'),
        ownerAvatar: '/assets/avatar-alex.jpg',
        daysInStage: 0,
        lastActivity: 'только что',
      };

      updateData((current) => ({ ...current, deals: [deal, ...current.deals] }));
      return deal;
    },
    updateDeal(id: string, patch: Partial<Deal>) {
      updateData((current) => ({
        ...current,
        deals: current.deals.map((deal) => (deal.id === id ? { ...deal, ...patch } : deal)),
      }));
    },
    deleteDeal(id: string) {
      updateData((current) => ({
        ...current,
        deals: current.deals.filter((deal) => deal.id !== id),
      }));
    },
    addContact(input: NewContact) {
      const contact: Contact = {
        ...input,
        id: createId('contact'),
        avatar: '/assets/company-logo-acme.jpg',
        lastContacted: 'сегодня',
        engagementScore: 50,
      };

      updateData((current) => ({ ...current, contacts: [contact, ...current.contacts] }));
      return contact;
    },
    updateContact(id: string, patch: Partial<Contact>) {
      updateData((current) => ({
        ...current,
        contacts: current.contacts.map((contact) => (contact.id === id ? { ...contact, ...patch } : contact)),
      }));
    },
    deleteContact(id: string) {
      updateData((current) => ({
        ...current,
        contacts: current.contacts.filter((contact) => contact.id !== id),
      }));
    },
    addTask(title: string) {
      const task: Task = {
        id: createId('task'),
        title,
        completed: false,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0, 10),
      };

      updateData((current) => ({ ...current, tasks: [task, ...current.tasks] }));
      return task;
    },
    updateTask(id: string, patch: Partial<Task>) {
      updateData((current) => ({
        ...current,
        tasks: current.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)),
      }));
    },
    deleteTask(id: string) {
      updateData((current) => ({
        ...current,
        tasks: current.tasks.filter((task) => task.id !== id),
      }));
    },
    addCalendarEvent(input: NewCalendarEvent) {
      const event: CalendarEvent = {
        ...input,
        id: createId('event'),
      };

      updateData((current) => ({ ...current, calendarEvents: [...current.calendarEvents, event] }));
      return event;
    },
    updateCalendarEvent(id: string, patch: Partial<CalendarEvent>) {
      updateData((current) => ({
        ...current,
        calendarEvents: current.calendarEvents.map((event) => (event.id === id ? { ...event, ...patch } : event)),
      }));
    },
    deleteCalendarEvent(id: string) {
      updateData((current) => ({
        ...current,
        calendarEvents: current.calendarEvents.filter((event) => event.id !== id),
      }));
    },
    reset() {
      setData(seedData);
    },
  }), [updateData]);

  return { ...data, ...api };
}
