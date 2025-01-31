import React from 'react';
import { Filter, Bell, AlertTriangle, CreditCard, Target } from 'lucide-react';

interface NotificationFilterProps {
  filter: 'all' | 'unread' | 'read';
  onFilterChange: (filter: 'all' | 'unread' | 'read') => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
}

export const NotificationFilter: React.FC<NotificationFilterProps> = ({
  filter,
  onFilterChange,
  typeFilter,
  onTypeFilterChange,
}) => {
  const types = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'payment', label: 'Payments', icon: CreditCard },
    { id: 'alert', label: 'Alerts', icon: AlertTriangle },
    { id: 'goal', label: 'Goals', icon: Target },
  ];

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Filter className="w-4 h-4" />
            Status
          </label>
          <div className="flex gap-2">
            {(['all', 'unread', 'read'] as const).map((value) => (
              <button
                key={value}
                onClick={() => onFilterChange(value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === value
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Type
          </label>
          <div className="flex flex-wrap gap-2">
            {types.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTypeFilterChange(id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  typeFilter === id
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};