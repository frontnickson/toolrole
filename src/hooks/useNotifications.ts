import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { Notification } from '../types/notification';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Подписка на изменения уведомлений
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });

    return unsubscribe;
  }, [currentUser]);

  // Подсчет непрочитанных уведомлений
  useEffect(() => {
    const unread = notifications.filter(notification => !notification.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Отметить как прочитанное
  const markAsRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
  };

  // Отметить все как прочитанные
  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
  };

  // Удалить уведомление
  const deleteNotification = async (notificationId: string) => {
    await notificationService.deleteNotification(notificationId);
  };

  // Создать уведомление
  const createNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    notificationService.createNotification(notification);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  };
};
