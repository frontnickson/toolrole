import type { Notification } from '../types/notification';

// Сервис для работы с уведомлениями
export class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];

  private constructor() {
    this.loadNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Загрузка уведомлений
  private async loadNotifications() {
    try {
      // TODO: Заменить на реальный API вызов
      // const response = await fetch('/api/v1/notifications');
      // const data = await response.json();
      // this.notifications = data.notifications;
      
      // Временные тестовые данные
      this.notifications = [];
    } catch (error) {
      console.error('Ошибка при загрузке уведомлений:', error);
    }
  }

  // Подписка на изменения уведомлений
  public subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    // Сразу вызываем с текущими уведомлениями
    listener(this.notifications);
    
    // Возвращаем функцию отписки
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Уведомление всех подписчиков
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Создание уведомления
  public createNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    
    this.notifications.unshift(newNotification);
    this.notifyListeners();
    
    return newNotification;
  }

  // Отметить как прочитанное
  public async markAsRead(notificationId: string) {
    try {
      // TODO: API вызов
      // await fetch(`/api/v1/notifications/${notificationId}/read`, { method: 'POST' });
      
      this.notifications = this.notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true, readAt: new Date() }
          : notification
      );
      
      this.notifyListeners();
    } catch (error) {
      console.error('Ошибка при отметке уведомления как прочитанного:', error);
    }
  }

  // Отметить все как прочитанные
  public async markAllAsRead() {
    try {
      // TODO: API вызов
      // await fetch('/api/v1/notifications/read-all', { method: 'POST' });
      
      this.notifications = this.notifications.map(notification => ({
        ...notification,
        isRead: true,
        readAt: new Date()
      }));
      
      this.notifyListeners();
    } catch (error) {
      console.error('Ошибка при отметке всех уведомлений как прочитанных:', error);
    }
  }

  // Удалить уведомление
  public async deleteNotification(notificationId: string) {
    try {
      // TODO: API вызов
      // await fetch(`/api/v1/notifications/${notificationId}`, { method: 'DELETE' });
      
      this.notifications = this.notifications.filter(notification => 
        notification.id !== notificationId
      );
      
      this.notifyListeners();
    } catch (error) {
      console.error('Ошибка при удалении уведомления:', error);
    }
  }

  // Получить количество непрочитанных уведомлений
  public getUnreadCount(): number {
    return this.notifications.filter(notification => !notification.isRead).length;
  }

  // Получить все уведомления
  public getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Создать уведомление о новой задаче
  public notifyTaskCreated(task: any, board: any, column: any) {
    this.createNotification({
      userId: task.assigneeId || task.reporterId,
      type: 'task_assigned',
      title: 'Новая задача',
      message: `Вам назначена новая задача "${task.title}" в доске "${board.title}"`,
      data: {
        boardId: board.id,
        taskId: task.id,
        columnId: column.id
      },
      isRead: false,
      isArchived: false,
      priority: 'medium'
    });
  }

  // Создать уведомление о перемещении задачи
  public notifyTaskMoved(task: any, board: any, fromColumn: any, toColumn: any) {
    this.createNotification({
      userId: task.assigneeId || task.reporterId,
      type: 'task_moved',
      title: 'Задача перемещена',
      message: `Задача "${task.title}" перемещена из "${fromColumn.title}" в "${toColumn.title}"`,
      data: {
        boardId: board.id,
        taskId: task.id,
        fromColumnId: fromColumn.id,
        toColumnId: toColumn.id
      },
      isRead: false,
      isArchived: false,
      priority: 'low'
    });
  }

  // Создать уведомление о завершении задачи
  public notifyTaskCompleted(task: any, board: any, column: any) {
    this.createNotification({
      userId: task.assigneeId || task.reporterId,
      type: 'task_completed',
      title: 'Задача завершена',
      message: `Задача "${task.title}" завершена в доске "${board.title}"`,
      data: {
        boardId: board.id,
        taskId: task.id,
        columnId: column.id
      },
      isRead: false,
      isArchived: false,
      priority: 'low'
    });
  }

  // Создать уведомление о новой задаче в колонке "Новые задачи"
  public notifyNewTaskInInbox(task: any, board: any, column: any) {
    this.createNotification({
      userId: task.assigneeId || task.reporterId,
      type: 'task_assigned',
      title: 'Новая задача в входящих',
      message: `Новая задача "${task.title}" добавлена в колонку "Новые задачи" доски "${board.title}"`,
      data: {
        boardId: board.id,
        taskId: task.id,
        columnId: column.id
      },
      isRead: false,
      isArchived: false,
      priority: 'high'
    });
  }
}

// Экспортируем singleton
export const notificationService = NotificationService.getInstance();
