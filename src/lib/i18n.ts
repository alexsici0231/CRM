export type Locale = 'ru' | 'en';

export const locales: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
};

const dictionary = {
  ru: {
    dashboard: 'Панель',
    deals: 'Сделки',
    contacts: 'Контакты',
    calendar: 'Календарь',
    settings: 'Настройки',
    loading: 'Загрузка...',
    admin: 'Администратор',
    manager: 'Менеджер',
    viewer: 'Наблюдатель',
  },
  en: {
    dashboard: 'Dashboard',
    deals: 'Deals',
    contacts: 'Contacts',
    calendar: 'Calendar',
    settings: 'Settings',
    loading: 'Loading...',
    admin: 'Admin',
    manager: 'Manager',
    viewer: 'Viewer',
  },
} as const;

export type TranslationKey = keyof typeof dictionary.ru;

export function t(locale: Locale, key: TranslationKey) {
  return dictionary[locale][key];
}
