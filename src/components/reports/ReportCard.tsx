import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ReportCardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const colorVariants = {
  primary: 'bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400',
  success: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400',
  danger: 'bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400',
};

export const ReportCard: React.FC<ReportCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  color = 'primary',
}) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${colorVariants[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </span>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
};