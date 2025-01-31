import React from 'react';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

interface MonthlyOverviewProps {
  transactions: Array<{
    type: 'income' | 'expense';
    amount: number;
    date: string;
  }>;
}

export const MonthlyOverview: React.FC<MonthlyOverviewProps> = ({
  transactions,
}) => {
  const monthlyData = transactions.reduce(
    (acc, t) => {
      const month = new Date(t.date).getMonth();
      if (t.type === 'income') {
        acc.income[month] = (acc.income[month] || 0) + t.amount;
      } else {
        acc.expenses[month] = (acc.expenses[month] || 0) + t.amount;
      }
      return acc;
    },
    { income: Array(12).fill(0), expenses: Array(12).fill(0) }
  );

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const maxValue = Math.max(
    ...monthlyData.income,
    ...monthlyData.expenses
  );

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Monatsübersicht
        </h3>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {months.map((month, index) => (
            <div key={month} className="flex-1 flex flex-col items-stretch gap-1">
              <div
                className="bg-emerald-500/20 dark:bg-emerald-500/30 rounded-t transition-all duration-300"
                style={{
                  height: `${(monthlyData.income[index] / maxValue) * 100}%`,
                }}
              ></div>
              <div
                className="bg-rose-500/20 dark:bg-rose-500/30 rounded-t transition-all duration-300"
                style={{
                  height: `${(monthlyData.expenses[index] / maxValue) * 100}%`,
                }}
              ></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                {month}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500/20 dark:bg-emerald-500/30 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Einnahmen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-rose-500/20 dark:bg-rose-500/30 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Ausgaben</span>
        </div>
      </div>
    </div>
  );
};