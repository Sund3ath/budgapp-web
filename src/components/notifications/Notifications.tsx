import React, { useState } from 'react';
import { NotificationList } from './NotificationList';
import { NotificationFilter } from './NotificationFilter';
import { formatDistanceToNow } from '../../utils/date';
import {
  Bell,
  CreditCard,
  PiggyBank,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';

// Mock data for development
const mockNotifications = [
  {
    id: '1',
    type: 'payment',
    title: 'Upcoming Loan Payment',
    message: 'Car loan payment of $471.78 is due in 3 days',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high',
    icon: CreditCard,
  },
  {
    id: '2',
    type: 'goal',
    title: 'Savings Goal Achieved',
    message: 'Congratulations! You\'ve reached your emergency fund goal of $10,000',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'normal',
    icon: PiggyBank,
  },
  {
    id: '3',
    type: 'alert',
    title: 'Unusual Spending Detected',
    message: 'We noticed higher than usual spending in Entertainment category this month',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium',
    icon: AlertTriangle,
  },
  {
    id: '4',
    type: 'system',
    title: 'Automatic Payment Successful',
    message: 'Monthly utility bill payment of $145.50 was processed successfully',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'normal',
    icon: CheckCircle,
  },
  {
    id: '5',
    type: 'system',
    title: 'New Feature Available',
    message: 'Check out our new budget planning tools in the Reports section',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'low',
    icon: Info,
  },
];

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true,
    })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'unread') return !notification.isRead;
      if (filter === 'read') return notification.isRead;
      return true;
    })
    .filter(notification => {
      if (typeFilter === 'all') return true;
      return notification.type === typeFilter;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Mark all as read
          </button>
        )}
      </div>

      <NotificationFilter
        filter={filter}
        onFilterChange={setFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <NotificationList
        notifications={filteredNotifications}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </div>
  );
};