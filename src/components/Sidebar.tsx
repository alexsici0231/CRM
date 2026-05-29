import { LayoutDashboard, Handshake, Users, Calendar, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PageId } from '@/types';
import type { AppUser } from '@/lib/auth';
import { t, type Locale } from '@/lib/i18n';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  user: AppUser;
  locale: Locale;
}

const navItems: { id: PageId; labelKey: 'dashboard' | 'deals' | 'contacts' | 'calendar'; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { id: 'deals', labelKey: 'deals', icon: Handshake },
  { id: 'contacts', labelKey: 'contacts', icon: Users },
  { id: 'calendar', labelKey: 'calendar', icon: Calendar },
];

export default function Sidebar({ activePage, onNavigate, user, locale }: SidebarProps) {
  return (
    <aside
      className="fixed bottom-0 left-0 top-auto z-50 flex h-16 w-full border-t border-subtle md:top-0 md:h-screen md:w-[240px] md:flex-col md:border-r md:border-t-0"
      style={{ backgroundColor: '#0D1321' }}
    >
      {/* Logo */}
      <div className="hidden h-14 items-center justify-center gap-2 md:flex">
        <span className="w-2 h-2 rounded-full bg-[#D97706]" />
        <span
          className="text-base font-bold tracking-[-0.02em]"
          style={{ color: '#F1F5F9' }}
        >
          Octavia
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 items-center justify-around px-2 py-2 md:block md:space-y-1 md:px-3 md:py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item flex h-12 min-w-14 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] transition-all duration-200 cursor-pointer md:h-10 md:w-full md:flex-row md:justify-start md:gap-3 md:px-4 md:text-sm ${
                isActive
                  ? 'font-medium md:border-l-[3px] md:border-l-[#D97706]'
                  : 'md:border-l-[3px] md:border-l-transparent hover:bg-[rgba(30,42,66,0.5)]'
              }`}
              style={{
                backgroundColor: isActive ? '#1E2A42' : 'transparent',
                color: isActive ? '#F1F5F9' : '#94A3B8',
              }}
              whileHover={{ x: isActive ? 0 : 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={20} className={isActive ? 'text-[#F1F5F9]' : 'text-[#64748B]'} />
              <span>{t(locale, item.labelKey)}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-5 hidden h-px bg-[rgba(148,163,184,0.1)] md:block" />

      {/* Bottom section */}
      <div className="hidden px-3 py-4 space-y-1 md:block">
        <motion.button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-4 h-10 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
            activePage === 'settings'
              ? 'font-medium border-l-[3px] border-l-[#D97706]'
              : 'border-l-[3px] border-l-transparent hover:bg-[rgba(30,42,66,0.5)]'
          }`}
          style={{
            backgroundColor: activePage === 'settings' ? '#1E2A42' : 'transparent',
            color: activePage === 'settings' ? '#F1F5F9' : '#94A3B8',
          }}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings size={20} className={activePage === 'settings' ? 'text-[#F1F5F9]' : 'text-[#64748B]'} />
          <span>{t(locale, 'settings')}</span>
        </motion.button>

        {/* User profile */}
        <div className="flex items-center gap-3 px-4 py-3 mt-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-[13px] font-medium" style={{ color: '#F1F5F9' }}>
              {user.name}
            </span>
            <span className="text-xs" style={{ color: '#64748B' }}>
              {user.title} - {t(locale, user.role)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
