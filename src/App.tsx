import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/dashboard/Dashboard';
import { Transactions } from './components/transactions/Transactions';
import { Loans } from './components/loans/Loans';
import { Reports } from './components/reports/Reports';
import { Notifications } from './components/notifications/Notifications';
import { Settings } from './components/settings/Settings';
import { AuthForm } from './components/auth/AuthForm';
import { useAuth } from './lib/AuthProvider';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { session, user, loading } = useAuth();
  
  const userName = useMemo(() => {
    if (!user) return '';
    // Try to get name from user metadata first
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    // Fall back to email if no name is set
    return user.email?.split('@')[0] || 'User';
  }, [user]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const { t } = useTranslation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  if (!session) {
    return <AuthForm />;
  }
  return (
    <div
      className={`min-h-screen ${
        isDark ? 'dark' : ''
      } bg-background-light dark:bg-background-dark`}
    >
      <Header
        user={{ name: userName }}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        unreadNotifications={3}
      />
      <div className="flex">
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              {t(currentPage)}
            </h2>
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'transactions' && <Transactions />}
            {currentPage === 'loans' && <Loans />}
            {currentPage === 'reports' && <Reports />}
            {currentPage === 'notifications' && <Notifications />}
            {currentPage === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
