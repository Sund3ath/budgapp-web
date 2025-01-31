import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Home,
  DollarSign,
  CreditCard,
  PieChart,
  Bell,
  Settings,
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
}) => {
  const { t } = useTranslation();
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: t('dashboard') },
    { id: 'transactions', icon: DollarSign, label: t('transactions') },
    { id: 'loans', icon: CreditCard, label: t('loans') },
    { id: 'reports', icon: PieChart, label: t('reports') },
    { id: 'notifications', icon: Bell, label: t('notifications') },
    { id: 'settings', icon: Settings, label: t('settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface-light dark:bg-surface-dark shadow-soft md:relative md:w-64 md:min-h-screen">
      <div className="flex md:flex-col items-center justify-center md:justify-start p-4 gap-4 md:gap-0">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex items-center justify-center md:justify-start p-2 rounded-lg w-14 md:w-full mb-0 md:mb-2 ${
              currentPage === id
                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors'
            }`}
          >
            <Icon className="w-5 h-5 md:mr-3 transition-colors" />
            <span className="hidden md:inline transition-colors">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};