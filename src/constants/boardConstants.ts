// ===== КОНСТАНТЫ ДОСОК =====

// Стандартные колонки
export const DEFAULT_COLUMNS = [
  {
    title: 'Planning',
    description: 'Задачи в планировании',
    icon: '📋',
    color: '#6B7280',
    order: 0,
    wipLimit: undefined
  },
  {
    title: 'In Progress',
    description: 'Задачи в работе',
    icon: '🚀',
    color: '#3B82F6',
    order: 1,
    wipLimit: 5
  },
  {
    title: 'Review',
    description: 'Задачи на проверке',
    icon: '👀',
    color: '#F59E0B',
    order: 2,
    wipLimit: 3
  },
  {
    title: 'Completed',
    description: 'Завершенные задачи',
    icon: '✅',
    color: '#10B981',
    order: 3,
    wipLimit: undefined
  },
  {
    title: 'Overdue',
    description: 'Просроченные задачи',
    icon: '⚠️',
    color: '#DC2626',
    order: 4,
    wipLimit: undefined
  }
] as const;

// Цвета для приоритетов
export const PRIORITY_COLORS = {
  low: '#6B7280',
  medium: '#3B82F6',
  high: '#F59E0B',
  urgent: '#EF4444',
  critical: '#7C2D12'
} as const;

// Цвета для статусов
export const STATUS_COLORS = {
  planning: '#6B7280',
  in_progress: '#3B82F6',
  review: '#F59E0B',
  testing: '#8B5CF6',
  completed: '#10B981',
  cancelled: '#EF4444',
  blocked: '#DC2626',
  on_hold: '#F97316',
  overdue: '#DC2626'
} as const;

// Лимиты по умолчанию
export const DEFAULT_LIMITS = {
  maxColumns: 20,
  maxTasksPerColumn: 100,
  maxSubtasksPerTask: 50,
  maxCommentsPerTask: 1000,
  maxAttachmentsPerTask: 20,
  maxTagsPerTask: 10,
  maxLabelsPerTask: 5
} as const;

// Настройки по умолчанию
export const DEFAULT_SETTINGS = {
  autoArchiveDays: 30,
  refreshInterval: 30000, // 30 секунд
  pageSize: 50,
  maxSearchResults: 100
} as const;

// Типы представлений
export const VIEW_TYPES = {
  KANBAN: 'kanban',
  LIST: 'list',
  CALENDAR: 'calendar',
  TIMELINE: 'timeline',
  GANTT: 'gantt'
} as const;

// Категории шаблонов
export const TEMPLATE_CATEGORIES = {
  SOFTWARE_DEVELOPMENT: 'software_development',
  PROJECT_MANAGEMENT: 'project_management',
  MARKETING: 'marketing',
  SALES: 'sales',
  SUPPORT: 'support',
  HR: 'hr',
  FINANCE: 'finance',
  OPERATIONS: 'operations',
  CUSTOM: 'custom'
} as const;

// Роли участников
export const MEMBER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
  GUEST: 'guest'
} as const;

// Действия активности
export const ACTIVITY_ACTIONS = {
  // Задачи
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_DELETED: 'task_deleted',
  TASK_ARCHIVED: 'task_archived',
  TASK_RESTORED: 'task_restored',
  TASK_MOVED: 'task_moved',
  TASK_ASSIGNED: 'task_assigned',
  TASK_UNASSIGNED: 'task_unassigned',
  
  // Статусы
  STATUS_CHANGED: 'status_changed',
  PRIORITY_CHANGED: 'priority_changed',
  DUE_DATE_CHANGED: 'due_date_changed',
  
  // Комментарии
  COMMENT_ADDED: 'comment_added',
  COMMENT_EDITED: 'comment_edited',
  COMMENT_DELETED: 'comment_deleted',
  COMMENT_PINNED: 'comment_pinned',
  
  // Вложения
  ATTACHMENT_ADDED: 'attachment_added',
  ATTACHMENT_DELETED: 'attachment_deleted',
  
  // Подзадачи
  SUBTASK_ADDED: 'subtask_added',
  SUBTASK_COMPLETED: 'subtask_completed',
  SUBTASK_DELETED: 'subtask_deleted',
  
  // Участники
  WATCHER_ADDED: 'watcher_added',
  WATCHER_REMOVED: 'watcher_removed',
  COLLABORATOR_ADDED: 'collaborator_added',
  COLLABORATOR_REMOVED: 'collaborator_removed',
  
  // Время
  TIME_LOGGED: 'time_logged',
  TIME_ESTIMATE_CHANGED: 'time_estimate_changed',
  
  // Теги и метки
  TAG_ADDED: 'tag_added',
  TAG_REMOVED: 'tag_removed',
  LABEL_ADDED: 'label_added',
  LABEL_REMOVED: 'label_removed'
} as const;

// Операторы фильтров
export const FILTER_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'not_contains',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  BETWEEN: 'between',
  IN: 'in',
  NOT_IN: 'not_in',
  IS_NULL: 'is_null',
  IS_NOT_NULL: 'is_not_null'
} as const;

// Направления сортировки
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

// Поля для сортировки
export const SORT_FIELDS = {
  ORDER: 'order',
  PRIORITY: 'priority',
  DUE_DATE: 'dueDate',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  TITLE: 'title',
  STATUS: 'status',
  ASSIGNEE: 'assigneeId'
} as const;

// Типы задач
export const TASK_TYPES = {
  TASK: 'task',
  BUG: 'bug',
  FEATURE: 'feature',
  STORY: 'story',
  EPIC: 'epic',
  SUBTASK: 'subtask'
} as const;

// Статусы задач
export const TASK_STATUSES = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  TESTING: 'testing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  BLOCKED: 'blocked',
  ON_HOLD: 'on_hold',
  OVERDUE: 'overdue'
} as const;

// Приоритеты задач
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical'
} as const;

// Ресурсы для разрешений
export const PERMISSION_RESOURCES = {
  BOARD: 'board',
  COLUMN: 'column',
  TASK: 'task',
  COMMENT: 'comment',
  MEMBER: 'member',
  ATTACHMENT: 'attachment'
} as const;

// Действия для разрешений
export const PERMISSION_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  ARCHIVE: 'archive'
} as const;

// Настройки приватности
export const PRIVACY_LEVELS = {
  ALL: 'all',
  MEMBERS: 'members',
  ASSIGNEES: 'assignees'
} as const;

// Интервалы обновления
export const REFRESH_INTERVALS = {
  NEVER: 0,
  LOW: 60000, // 1 минута
  MEDIUM: 30000, // 30 секунд
  HIGH: 10000, // 10 секунд
  REAL_TIME: 1000 // 1 секунда
} as const;

// Размеры страниц
export const PAGE_SIZES = {
  SMALL: 25,
  MEDIUM: 50,
  LARGE: 100,
  EXTRA_LARGE: 200
} as const;

// Максимальные значения
export const MAX_VALUES = {
  TITLE_LENGTH: 200,
  DESCRIPTION_LENGTH: 2000,
  COMMENT_LENGTH: 10000,
  TAG_NAME_LENGTH: 50,
  LABEL_NAME_LENGTH: 50,
  CUSTOM_FIELD_KEY_LENGTH: 100,
  CUSTOM_FIELD_VALUE_LENGTH: 1000
} as const;

// Минимальные значения
export const MIN_VALUES = {
  TITLE_LENGTH: 1,
  DESCRIPTION_LENGTH: 0,
  COMMENT_LENGTH: 1,
  TAG_NAME_LENGTH: 1,
  LABEL_NAME_LENGTH: 1,
  CUSTOM_FIELD_KEY_LENGTH: 1,
  CUSTOM_FIELD_VALUE_LENGTH: 0
} as const;
