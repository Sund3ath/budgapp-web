import React from 'react';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { useTransactions } from '../../hooks/useTransactions';


export const Transactions: React.FC = () => {
  const { transactions, loading, error, addTransaction, deleteTransaction } = useTransactions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Lädt...</div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-lg">
        {error}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <TransactionForm onSubmit={addTransaction} />
      <TransactionList
        transactions={transactions}
        onDelete={deleteTransaction}
      />
    </div>
  );
};