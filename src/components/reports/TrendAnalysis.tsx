import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

interface TrendAnalysisProps {
  transactions: Array<{
    type: 'income' | 'expense';
    amount: number;
    date: string;
  }>;
  dateRange: 'week' | 'month' | 'year';
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  transactions,
  dateRange,
}) => {
  const calculateTrends = () => {
    const now = new Date();
    const periods = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 12;
    
    const data = Array(periods).fill(0).map((_, i) => {
      const date = new Date(now);
      if (dateRange === 'week') {
        date.setDate(date.getDate() - i);
      } else if (dateRange === 'month') {
        date.setDate(date.getDate() - i);
      } else {
        date.setMonth(date.getMonth() - i);
      }
      
      const periodTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        if (dateRange === 'year') {
          return tDate.getMonth() === date.getMonth() &&
                 tDate.getFullYear() === date.getFullYear();
        }
        return tDate.toDateString() === date.toDateString();
      });

      const income = periodTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = periodTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: date.toLocaleDateString('en-US', {
          month: dateRange === 'year' ? 'short' : 'numeric',
          day: dateRange === 'year' ? undefined : 'numeric',
        }),
        income,
        expenses,
        balance: income - expenses,
      };
    }).reverse();

    return data;
  };

  const trends = calculateTrends();
  const maxValue = Math.max(
    ...trends.map(t => Math.max(t.income, t.expenses, Math.abs(t.balance)))
  );

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Finanzielle Trends
        </h3>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0">
          {[100, 75, 50, 25, 0].map((percent) => (
            <div
              key={percent}
              className="absolute w-full h-px bg-gray-200 dark:bg-gray-700"
              style={{ bottom: `${percent}%` }}
            >
              <span className="absolute right-full pr-2 text-xs text-gray-500 dark:text-gray-400">
                {formatCurrency(maxValue * (percent / 100))}
              </span>
            </div>
          ))}

          <div className="absolute inset-0 flex items-end">
            {trends.map((data, index) => {
              const prevData = trends[index - 1];
              if (!prevData) return null;

              return (
                <React.Fragment key={data.date}>
                  <svg
                    className="h-full flex-1"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={`
                        M 0 ${100 - (prevData.balance / maxValue) * 100}
                        L 100 ${100 - (data.balance / maxValue) * 100}
                      `}
                      className="stroke-primary-500 stroke-2 fill-none"
                    />
                  </svg>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mt-4">
        {trends.map((data) => (
          <div
            key={data.date}
            className="text-center text-xs text-gray-500 dark:text-gray-400"
          >
            {data.date}
          </div>
        ))}
      </div>
    </div>
  );
};