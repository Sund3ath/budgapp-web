import React, { useState } from 'react';
import { Calendar, Clock, PieChart } from 'lucide-react';

export const PreferencesSettings: React.FC = () => {
  const [startDay, setStartDay] = useState('monday');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [defaultView, setDefaultView] = useState('dashboard');

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Preferences
      </h2>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4" />
            Week Starts On
          </label>
          <select
            value={startDay}
            onChange={(e) => setStartDay(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="monday">Monday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock className="w-4 h-4" />
            Time Format
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                className="w-4 h-4 text-primary-500"
                checked={timeFormat === '12h'}
                onChange={() => setTimeFormat('12h')}
              />
              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                12-hour
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                className="w-4 h-4 text-primary-500"
                checked={timeFormat === '24h'}
                onChange={() => setTimeFormat('24h')}
              />
              <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                24-hour
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <PieChart className="w-4 h-4" />
            Default View
          </label>
          <select
            value={defaultView}
            onChange={(e) => setDefaultView(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="dashboard">Dashboard</option>
            <option value="transactions">Transactions</option>
            <option value="reports">Reports</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};