import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import type { Notification } from '../../../../types/notification';
import { useTranslation } from '../../../../utils/translations';
import styles from './Inbox.module.scss';

const Inbox: React.FC = () => {
  // Получаем данные пользователя из Redux store
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { boards } = useSelector((state: RootState) => state.boards);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');
  
  // Состояние для уведомлений (пока пустое, будет заполняться из API)
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [boardFilter, setBoardFilter] = useState<string>('all');
  const [displayedItems, setDisplayedItems] = useState<Notification[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hasMoreItems, setHasMoreItems] = useState(false);

  // Загрузка уведомлений (пока заглушка, будет заменена на API)
  useEffect(() => {
    const loadNotifications = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        setNotifications([]);
      } catch (error) {
        console.error('Ошибка при загрузке уведомлений:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [currentUser]);

  // Фильтрация уведомлений
  useEffect(() => {
    const filtered = notifications.filter(notification => {
      if (filter === 'unread' && notification.isRead) return false;
      if (filter === 'read' && !notification.isRead) return false;
      if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
      if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;
      if (boardFilter !== 'all' && notification.data.boardId) {
        const board = boards.find(b => b.id === notification.data.boardId);
        if (!board || board.title !== boardFilter) return false;
      }
      return true;
    });
    
    // Сбрасываем пагинацию при изменении фильтров
    setItemsPerPage(10);
    setDisplayedItems(filtered.slice(0, 10));
    setHasMoreItems(filtered.length > 10);
  }, [notifications, filter, typeFilter, priorityFilter, boardFilter, boards]);

  const loadMoreItems = () => {
    const filtered = notifications.filter(notification => {
      if (filter === 'unread' && notification.isRead) return false;
      if (filter === 'read' && !notification.isRead) return false;
      if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
      if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;
      if (boardFilter !== 'all' && notification.data.boardId) {
        const board = boards.find(b => b.id === notification.data.boardId);
        if (!board || board.title !== boardFilter) return false;
      }
      return true;
    });
    
    const newItemsPerPage = itemsPerPage + 10;
    setItemsPerPage(newItemsPerPage);
    setDisplayedItems(filtered.slice(0, newItemsPerPage));
    setHasMoreItems(filtered.length > newItemsPerPage);
  };

  const markAsRead = async (id: string) => {
    try {
      // TODO: API вызов для отметки как прочитанное
      // await notificationsApi.markAsRead(id);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        )
      );
    } catch (error) {
      console.error('Ошибка при отметке уведомления как прочитанного:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: API вызов для отметки всех как прочитанные
      // await notificationsApi.markAllAsRead();
      
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          isRead: true, 
          readAt: new Date() 
        }))
      );
    } catch (error) {
      console.error('Ошибка при отметке всех уведомлений как прочитанных:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // TODO: API вызов для удаления уведомления
      // await notificationsApi.deleteNotification(id);
      
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении уведомления:', error);
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'task_assigned': return '📋';
      case 'task_due_soon': return '⏰';
      case 'task_overdue': return '🚨';
      case 'task_completed': return '✅';
      case 'comment_added': return '💬';
      case 'mention': return '👤';
      case 'board_invite': return '📁';
      case 'team_invite': return '👥';
      case 'friend_request': return '🤝';
      case 'system_update': return '⚙️';
      case 'security_alert': return '🔒';
      default: return '📥';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'task_assigned': return t('inbox.task_assigned');
      case 'task_due_soon': return t('inbox.task_due_soon');
      case 'task_overdue': return t('inbox.task_overdue');
      case 'task_completed': return t('inbox.task_completed');
      case 'comment_added': return t('inbox.comment_added');
      case 'mention': return t('inbox.mention');
      case 'board_invite': return t('inbox.board_invite');
      case 'team_invite': return t('inbox.team_invite');
      case 'friend_request': return t('inbox.friend_request');
      case 'system_update': return t('inbox.system_update');
      case 'security_alert': return t('inbox.security_alert');
      default: return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return styles.urgentPriority;
      case 'high': return styles.highPriority;
      case 'normal': return styles.mediumPriority;
      case 'low': return styles.lowPriority;
      default: return '';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return t('inbox.urgent_priority');
      case 'high': return t('inbox.high_priority');
      case 'normal': return t('inbox.normal_priority');
      case 'low': return t('inbox.low_priority');
      default: return priority;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className={styles.inbox}>
      {/* Заголовок */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>
            <span className={styles.icon}>📥</span>
            {t('inbox.title')}
          </h2>
          <p className={styles.subtitle}>{t('inbox.subtitle')}</p>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.markAllReadBtn}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            {t('inbox.mark_all_read')}
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{notifications.length}</span>
          <span className={styles.statLabel}>{t('inbox.total')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{unreadCount}</span>
          <span className={styles.statLabel}>{t('inbox.unread')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {notifications.filter(n => n.priority === 'urgent').length}
          </span>
          <span className={styles.statLabel}>{t('inbox.urgent')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {notifications.filter(n => n.data.boardId).length}
          </span>
          <span className={styles.statLabel}>{t('inbox.by_boards')}</span>
        </div>
      </div>

      {/* Фильтры */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>{t('inbox.status')}</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
            className={styles.filterSelect}
          >
            <option value="all">{t('inbox.all')}</option>
            <option value="unread">{t('inbox.unread_notifications')}</option>
            <option value="read">{t('inbox.read_notifications')}</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>{t('inbox.type')}</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">{t('inbox.all_types')}</option>
            <option value="task_assigned">{t('inbox.task_assigned')}</option>
            <option value="task_due_soon">{t('inbox.task_due_soon')}</option>
            <option value="task_overdue">{t('inbox.task_overdue')}</option>
            <option value="task_completed">{t('inbox.task_completed')}</option>
            <option value="comment_added">{t('inbox.comment_added')}</option>
            <option value="mention">{t('inbox.mention')}</option>
            <option value="board_invite">{t('inbox.board_invite')}</option>
            <option value="team_invite">{t('inbox.team_invite')}</option>
            <option value="friend_request">{t('inbox.friend_request')}</option>
            <option value="system_update">{t('inbox.system_update')}</option>
            <option value="security_alert">{t('inbox.security_alert')}</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>{t('inbox.priority')}</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">{t('inbox.all_priorities')}</option>
            <option value="urgent">{t('inbox.urgent_priority')}</option>
            <option value="high">{t('inbox.high_priority')}</option>
            <option value="normal">{t('inbox.normal_priority')}</option>
            <option value="low">{t('inbox.low_priority')}</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>{t('inbox.board')}</label>
          <select
            value={boardFilter}
            onChange={(e) => setBoardFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">{t('inbox.all_boards')}</option>
            {boards.map(board => (
              <option key={board.id} value={board.title}>
                {board.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Список уведомлений */}
      <div className={styles.itemsList}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <span className={styles.loadingIcon}>⏳</span>
            <p>{t('inbox.loading_notifications')}</p>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📥</span>
            <h3 className={styles.emptyTitle}>{t('inbox.no_notifications')}</h3>
            <p className={styles.emptyMessage}>
              {filter === 'unread' 
                ? t('inbox.no_unread_notifications')
                : t('inbox.notifications_will_appear')
              }
            </p>
          </div>
        ) : (
          displayedItems.map((notification) => {
            const board = notification.data.boardId 
              ? boards.find(b => b.id === notification.data.boardId)
              : null;
            
            return (
              <div
                key={notification.id}
                className={`${styles.inboxItem} ${
                  !notification.isRead ? styles.unread : ''
                } ${getPriorityColor(notification.priority)}`}
              >
                <div className={styles.itemIcon}>
                  <span className={styles.icon}>{getItemIcon(notification.type)}</span>
                </div>
                
                <div className={styles.itemContent}>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemTitle}>{notification.title}</h3>
                    <div className={styles.itemMeta}>
                      <span className={styles.priority}>
                        {getPriorityLabel(notification.priority)}
                      </span>
                      <span className={styles.time}>
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <p className={styles.itemMessage}>{notification.message}</p>
                  
                  <div className={styles.itemDetails}>
                    <span className={styles.type}>
                      {getTypeLabel(notification.type)}
                    </span>
                    {board && (
                      <span className={styles.project}>📁 {board.title}</span>
                    )}
                    {notification.data.taskId && (
                      <span className={styles.task}>📋 Задача #{notification.data.taskId}</span>
                    )}
                  </div>
                  
                  <div className={styles.itemActions}>
                    {!notification.isRead && (
                      <button
                        className={styles.actionBtn}
                        onClick={() => markAsRead(notification.id)}
                      >
                        {t('inbox.mark_as_read')}
                      </button>
                    )}
                    
                    <button
                      className={styles.actionBtn}
                      onClick={() => deleteNotification(notification.id)}
                    >
                      {t('inbox.delete')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {hasMoreItems && (
          <button 
            className={styles.loadMoreBtn}
            onClick={loadMoreItems}
          >
            {t('inbox.show_more')}
          </button>
        )}
      </div>
    </div>
  );
};

export default Inbox;
