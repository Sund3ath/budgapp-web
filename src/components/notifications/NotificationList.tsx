import React from 'react';
import { DivideIcon as LucideIcon, X } from 'lucide-react';
import { formatDistanceToNow } from '../../utils/date';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'medium' | 'high';
  icon: LucideIcon;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'bg-gray-100 dark:bg-gray-800',
  normal: 'bg-primary-50 dark:bg-primary-900/10',
  medium: 'bg-amber-50 dark:bg-amber-900/10',
  high: 'bg-rose-50 dark:bg-rose-900/10',
};

const priorityIconColors = {
  low: 'text-gray-500 dark:text-gray-400',
  normal: 'text-primary-500 dark:text-primary-400',
  medium: 'text-amber-500 dark:text-amber-400',
  high: 'text-rose-500 dark:text-rose-400',
};

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl shadow-soft">
        <p className="text-gray-500 dark:text-gray-400">
          No notifications to display
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => {
        const Icon = notification.icon;
        return (
          <div
            key={notification.id}
            className={`relative p-4 rounded-xl transition-colors ${
              notification.isRead
                ? 'bg-surface-light dark:bg-surface-dark'
                : priorityColors[notification.priority]
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-2 rounded-lg ${
                  notification.isRead
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${priorityIconColors[notification.priority]}`}
                />
              </div>
              <div
                className="flex-1 cursor-pointer"
                onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        notification.isRead
                          ? 'text-gray-600 dark:text-gray-300'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm ${
                        notification.isRead
                          ? 'text-gray-500 dark:text-gray-400'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notification.id);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(notification.date))}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};