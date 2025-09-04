// Уведомления
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: NotificationData;
  isRead: boolean;
  isArchived: boolean;
  priority: NotificationPriority;
  expiresAt?: Date;
  createdAt: Date;
  readAt?: Date;
}

export const NotificationType = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_DUE_SOON: 'task_due_soon',
  TASK_OVERDUE: 'task_overdue',
  TASK_COMPLETED: 'task_completed',
  COMMENT_ADDED: 'comment_added',
  MENTION: 'mention',
  BOARD_INVITE: 'board_invite',
  TEAM_INVITE: 'team_invite',
  FRIEND_REQUEST: 'friend_request',
  SYSTEM_UPDATE: 'system_update',
  SECURITY_ALERT: 'security_alert'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const NotificationPriority = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export type NotificationPriority = typeof NotificationPriority[keyof typeof NotificationPriority];

export interface NotificationData {
  taskId?: string;
  boardId?: string;
  commentId?: string;
  userId?: string;
  teamId?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

// Настройки уведомлений для пользователей
export interface UserNotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  desktopNotifications: boolean;
  notificationTypes: NotificationTypeSettings;
  quietHours: QuietHours;
  digestFrequency: DigestFrequency;
}

export interface NotificationTypeSettings {
  [NotificationType.TASK_ASSIGNED]: boolean;
  [NotificationType.TASK_DUE_SOON]: boolean;
  [NotificationType.TASK_OVERDUE]: boolean;
  [NotificationType.TASK_COMPLETED]: boolean;
  [NotificationType.COMMENT_ADDED]: boolean;
  [NotificationType.MENTION]: boolean;
  [NotificationType.BOARD_INVITE]: boolean;
  [NotificationType.TEAM_INVITE]: boolean;
  [NotificationType.FRIEND_REQUEST]: boolean;
  [NotificationType.SYSTEM_UPDATE]: boolean;
  [NotificationType.SECURITY_ALERT]: boolean;
}

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  timezone: string;
  daysOfWeek: number[]; // 0-6, Sunday = 0
}

export const DigestFrequency = {
  NEVER: 'never',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
} as const;

export type DigestFrequency = typeof DigestFrequency[keyof typeof DigestFrequency];

// Шаблоны уведомлений
export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  variables: string[]; // переменные для подстановки
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Группировка уведомлений
export interface NotificationGroup {
  id: string;
  userId: string;
  type: NotificationType;
  notifications: Notification[];
  count: number;
  lastNotificationAt: Date;
  isRead: boolean;
}
