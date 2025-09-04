import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, BackButton } from '../../components/ui/Button';
import styles from './Notifications.module.scss';

interface Notification {
  id: string;
  type: 'task' | 'comment' | 'mention' | 'system' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

const Notifications: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'task',
      title: 'Новая задача',
      message: 'Вам назначена новая задача "Обновить дизайн"',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
      actionUrl: '/todo'
    },
    {
      id: '2',
      type: 'comment',
      title: 'Новый комментарий',
      message: 'Алексей прокомментировал задачу "Исправить баг"',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 час назад
      actionUrl: '/todo'
    },
    {
      id: '3',
      type: 'system',
      title: 'Обновление системы',
      message: 'Система была обновлена до версии 2.1.0',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день назад
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      setNotificationSettings({
        email: user.preferences?.notifications?.email ?? true,
        push: user.preferences?.notifications?.push ?? true,
        sms: user.preferences?.notifications?.sms ?? false
      });
    }
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task': return '📋';
      case 'comment': return '💬';
      case 'mention': return '👤';
      case 'system': return '⚙️';
      case 'reminder': return '⏰';
      default: return '🔔';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.isRead) return false;
    if (filter === 'read' && !notification.isRead) return false;
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className={styles.notificationsPage}>
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка уведомлений...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.notificationsPage}>
        <div className={styles.container}>
          <div className={styles.error}>Пользователь не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.notificationsPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <BackButton>К профилю</BackButton>
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Уведомления</h1>
            <p className={styles.subtitle}>Управляйте своими уведомлениями</p>
          </div>
        </header>

        <div className={styles.content}>
          {/* Статистика */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{notifications.length}</span>
              <span className={styles.statLabel}>Всего</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{unreadCount}</span>
              <span className={styles.statLabel}>Непрочитанные</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>
                {notifications.filter(n => n.type === 'task').length}
              </span>
              <span className={styles.statLabel}>Задачи</span>
            </div>
          </div>

          {/* Фильтры */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Статус:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
                className={styles.filterSelect}
              >
                <option value="all">Все</option>
                <option value="unread">Непрочитанные</option>
                <option value="read">Прочитанные</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Тип:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Все типы</option>
                <option value="task">Задачи</option>
                <option value="comment">Комментарии</option>
                <option value="mention">Упоминания</option>
                <option value="system">Система</option>
                <option value="reminder">Напоминания</option>
              </select>
            </div>

            <Button variant="secondary" size="sm" onClick={markAllAsRead}>
              Отметить все как прочитанные
            </Button>
          </div>

          {/* Список уведомлений */}
          <div className={styles.notificationsList}>
            {filteredNotifications.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🔔</span>
                <h3 className={styles.emptyTitle}>Нет уведомлений</h3>
                <p className={styles.emptyMessage}>
                  {filter === 'unread' 
                    ? 'У вас нет непрочитанных уведомлений'
                    : 'Уведомления появятся здесь'
                  }
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    !notification.isRead ? styles.unread : ''
                  }`}
                >
                  <div className={styles.notificationIcon}>
                    <span className={styles.icon}>{getNotificationIcon(notification.type)}</span>
                  </div>
                  
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationHeader}>
                      <h3 className={styles.notificationTitle}>{notification.title}</h3>
                      <span className={styles.notificationTime}>
                        {notification.createdAt.toLocaleString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <p className={styles.notificationMessage}>{notification.message}</p>
                    
                    <div className={styles.notificationActions}>
                      {!notification.isRead && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Отметить как прочитанное
                        </Button>
                      )}
                      
                      {notification.actionUrl && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => window.location.href = notification.actionUrl!}
                        >
                          Перейти
                        </Button>
                      )}
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
