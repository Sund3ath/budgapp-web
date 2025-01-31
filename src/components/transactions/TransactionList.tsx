import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring: boolean;
  frequency?: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete,
}) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft overflow-hidden">
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Beschreibung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Betrag
              </th>
              {onDelete && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aktionen
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {new Date(transaction.date).toLocaleDateString()}
                  {transaction.isRecurring && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200">
                      {transaction.frequency}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1 rounded ${
                        transaction.type === 'income'
                          ? 'bg-emerald-100 dark:bg-emerald-900/20'
                          : 'bg-rose-100 dark:bg-rose-900/20'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      )}
                    </div>
                    {transaction.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {transaction.category}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </td>
                {onDelete && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1 rounded ${
                    transaction.type === 'income'
                      ? 'bg-emerald-100 dark:bg-emerald-900/20'
                      : 'bg-rose-100 dark:bg-rose-900/20'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {transaction.description}
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  transaction.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div>
                <div>{transaction.category}</div>
                <div className="flex items-center gap-1">
                  {new Date(transaction.date).toLocaleDateString()}
                  {transaction.isRecurring && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200">
                      {transaction.frequency}
                    </span>
                  )}
                </div>
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};