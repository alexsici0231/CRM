import { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import type { PageId } from '@/types';
import { defaultUser, type AppUser } from '@/lib/auth';
import { t, type Locale } from '@/lib/i18n';
import { useCrmStore } from '@/services/crmStore';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Deals = lazy(() => import('@/pages/Deals'));
const Contacts = lazy(() => import('@/pages/Contacts'));
const CalendarPage = lazy(() => import('@/pages/Calendar'));
const Settings = lazy(() => import('@/pages/Settings'));

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [locale, setLocale] = useState<Locale>('ru');
  const [user, setUser] = useState<AppUser>(defaultUser);
  const crm = useCrmStore();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard crm={crm} />;
      case 'deals':
        return <Deals crm={crm} user={user} />;
      case 'contacts':
        return <Contacts crm={crm} user={user} />;
      case 'calendar':
        return <CalendarPage crm={crm} user={user} />;
      case 'settings':
        return (
          <Settings
            locale={locale}
            onLocaleChange={setLocale}
            user={user}
            onUserChange={setUser}
            onResetData={crm.reset}
          />
        );
      default:
        return <Dashboard crm={crm} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: '#0B1120' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} user={user} locale={locale} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden md:ml-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense
              fallback={
                <div className="p-6 text-sm" style={{ color: '#94A3B8' }}>
                  {t(locale, 'loading')}
                </div>
              }
            >
              {renderPage()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <AIAssistant />
    </div>
  );
}
