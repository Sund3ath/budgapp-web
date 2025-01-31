import React, { useState } from 'react';
import { Bell, CreditCard, PiggyBank, AlertTriangle } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    paymentReminders: true,
    budgetAlerts: true,
    goalUpdates: true,
    weeklyReports: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Notification Settings
      </h2>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Bell className="w-4 h-4" />
            Notification Channels
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-gray-100">
                Email Notifications
              </span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => toggleSetting('emailNotifications')}
                className="w-4 h-4 text-primary-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-gray-100">
                Push Notifications
              </span>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={() => toggleSetting('pushNotifications')}
                className="w-4 h-4 text-primary-500"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <CreditCard className="w-4 h-4" />
            Payment Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-gray-100">
                Payment Reminders
              </span>
              <input
                type="checkbox"
                checked={settings.paymentReminders}
                onChange={() => toggleSetting('paymentReminders')}
                className="w-4 h-4 text-primary-500"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <AlertTriangle className="w-4 h-4" />
            Budget & Goals
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-gray-100">
                Budget Alerts
              </span>
              <input
                type="checkbox"
                checked={settings.budgetAlerts}
                onChange={() => toggleSetting('budgetAlerts')}
                className="w-4 h-4 text-primary-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-gray-100">
                Goal Updates
              </span>
              <input
                type="checkbox"
                checked={settings.goalUpdates}
                onChange={() => toggleSetting('goalUpdates')}
                className="w-4 h-4 text-primary-500"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <PiggyBank className="w-4 h-4" />
            Reports & Summaries
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-gray-100">
                Weekly Summary Reports
              </span>
              <input
                type="checkbox"
                checked={settings.weeklyReports}
                onChange={() => toggleSetting('weeklyReports')}
                className="w-4 h-4 text-primary-500"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
};