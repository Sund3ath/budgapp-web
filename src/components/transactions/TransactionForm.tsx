import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    isRecurring: boolean;
    frequency?: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  }) => void;
}

const categories = {
  income: [
    'Salary',
    'Freelance',
    'Investments',
    'Rental Income',
    'Other Income',
  ],
  expense: [
    'Housing',
    'Transportation',
    'Food',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Other',
  ],
};

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'yearly'>('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      isRecurring,
      ...(isRecurring && { frequency }),
    });
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsRecurring(false);
    setFrequency('monthly');
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Transaktion hinzufügen
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Art
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="w-4 h-4 text-primary-500"
                      checked={type === 'expense'}
                      onChange={() => setType('expense')}
                    />
                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">Ausgabe</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="w-4 h-4 text-primary-500"
                      checked={type === 'income'}
                      onChange={() => setType('income')}
                    />
                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">Einnahme</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Betrag
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategorie
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Kategorie auswählen</option>
                  {categories[type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Beschreibung
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Beschreibung eingeben"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Datum
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-500"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                    Wiederkehrende Transaktion
                  </span>
                </label>
              </div>

              {isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Häufigkeit
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as typeof frequency)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="weekly">Wöchentlich</option>
                    <option value="biweekly">Zweiwöchentlich</option>
                    <option value="monthly">Monatlich</option>
                    <option value="yearly">Jährlich</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Transaktion speichern
            </button>
          </div>
        </form>
      )}
    </div>
  );
};