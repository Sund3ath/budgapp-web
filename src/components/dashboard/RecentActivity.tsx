import React from 'react';
import { ArrowDownRight, ArrowUpRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Activity {
  id: string;
  type: 'income' | 'expense' | 'loan-payment';
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const { t } = useTranslation();
  
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
      case 'expense':
        return <ArrowDownRight className="w-4 h-4 text-rose-500" />;
      case 'loan-payment':
        return <Clock className="w-4 h-4 text-primary-500" />;
    }
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t('recent_activity')}
        </h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.category} • {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-medium ${
                  activity.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {activity.type === 'income' ? '+' : '-'}
                ${Math.abs(activity.amount).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};