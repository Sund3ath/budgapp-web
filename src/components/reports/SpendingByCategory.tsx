import React from 'react';
import { PieChart } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

interface SpendingByCategoryProps {
  transactions: Array<{
    type: 'income' | 'expense';
    amount: number;
    category: string;
  }>;
}

export const SpendingByCategory: React.FC<SpendingByCategoryProps> = ({
  transactions,
}) => {
  const categoryTotals = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalSpending = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const categories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalSpending) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);

  const colors = [
    'bg-primary-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-fuchsia-500',
  ];

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Ausgaben nach Kategorie
        </h3>
      </div>

      <div className="space-y-4">
        {categories.map((item, index) => (
          <div key={item.category}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatCurrency(item.amount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Keine Ausgabendaten verfügbar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};