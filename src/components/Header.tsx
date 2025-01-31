import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Bell, User, LogOut, Settings, CreditCard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  user: { name: string };
  isDark: boolean;
  onThemeToggle: () => void;
  unreadNotifications: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isDark,
  onThemeToggle,
  unreadNotifications,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-surface-light dark:bg-surface-dark shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Budgapp
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => changeLanguage(i18n.language === 'en' ? 'de' : 'en')}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg"
              >
                {i18n.language.toUpperCase()}
              </button>
            </div>
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            <button
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
              aria-label={t('notifications')}
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-500 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <div className="relative flex items-center space-x-2" ref={menuRef}>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user.name}
              </span>
              <button
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors ${
                  showUserMenu ? 'bg-gray-100 dark:bg-gray-800/50' : ''
                }`}
                aria-label="Benutzermenü"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-2"
                      onClick={() => {/* Handle profile click */}}
                    >
                      <User className="w-4 h-4" />
                      {t('profile')}
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-2"
                      onClick={() => {/* Handle settings click */}}
                    >
                      <Settings className="w-4 h-4" />
                      {t('settings_menu')}
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-2"
                      onClick={() => {/* Handle billing click */}}
                    >
                      <CreditCard className="w-4 h-4" />
                      {t('billing')}
                    </button>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-rose-600 dark:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 flex items-center gap-2"
                      onClick={() => {/* Handle logout click */}}
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};