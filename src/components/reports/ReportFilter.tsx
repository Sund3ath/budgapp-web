import React from 'react';
import { Calendar, Tag } from 'lucide-react';

interface ReportFilterProps {
  dateRange: 'week' | 'month' | 'year';
  onDateRangeChange: (range: 'week' | 'month' | 'year') => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const categories = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
];

export const ReportFilter: React.FC<ReportFilterProps> = ({
  dateRange,
  onDateRangeChange,
  selectedCategories,
  onCategoryChange,
}) => {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4" />
            Zeitraum
          </label>
          <div className="flex gap-2">
            {[
              { value: 'week', label: 'Woche' },
              { value: 'month', label: 'Monat' },
              { value: 'year', label: 'Jahr' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onDateRangeChange(value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  dateRange === value
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Tag className="w-4 h-4" />
            Kategorien
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};