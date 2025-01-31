import React from 'react';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Lock,
  Download,
} from 'lucide-react';

interface SettingsSectionProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const sections = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'preferences', label: 'Einstellungen', icon: SettingsIcon },
    { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
    { id: 'security', label: 'Sicherheit', icon: Lock },
    { id: 'export', label: 'Daten exportieren', icon: Download },
  ];

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-4">
      <nav className="space-y-1">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeSection === id
                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};