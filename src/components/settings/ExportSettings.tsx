import React, { useState } from 'react';
import { Download, FileText, Table, Calendar } from 'lucide-react';

export const ExportSettings: React.FC = () => {
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [dataTypes, setDataTypes] = useState<string[]>([
    'transactions',
    'loans',
    'budget',
  ]);

  const handleDataTypeToggle = (type: string) => {
    if (dataTypes.includes(type)) {
      setDataTypes(dataTypes.filter((t) => t !== type));
    } else {
      setDataTypes([...dataTypes, type]);
    }
  };

  const handleExport = () => {
    // Handle data export
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Export Data
      </h2>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileText className="w-4 h-4" />
            Export Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="year">Last Year</option>
            <option value="6months">Last 6 Months</option>
            <option value="month">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Table className="w-4 h-4" />
            Data to Export
          </label>
          <div className="space-y-3">
            {[
              { id: 'transactions', label: 'Transactions' },
              { id: 'loans', label: 'Loans' },
              { id: 'budget', label: 'Budget' },
              { id: 'goals', label: 'Goals' },
              { id: 'reports', label: 'Reports' },
            ].map(({ id, label }) => (
              <label
                key={id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {label}
                </span>
                <input
                  type="checkbox"
                  checked={dataTypes.includes(id)}
                  onChange={() => handleDataTypeToggle(id)}
                  className="w-4 h-4 text-primary-500"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};