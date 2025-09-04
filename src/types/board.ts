// ===== ОСНОВНЫЕ ТИПЫ ДОСОК =====

export const BoardRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
  GUEST: 'guest'
} as const;

export type BoardRole = typeof BoardRole[keyof typeof BoardRole];

export interface Board {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  color: string;
  ownerId: string;
  teamId?: string;
  members: BoardMember[];
  columns: Column[];
  settings: BoardSettings;
  statistics: BoardStatistics;
  createdAt: number; // timestamp вместо Date
  updatedAt: number; // timestamp вместо Date
  isArchived: boolean;
  isPublic: boolean;
  isTemplate: boolean;
  templateId?: string;
  isFavorite?: boolean; // Флаг для избранных досок
}

export interface BoardMember {
  id: string;
  userId: string;
  boardId: string;
  role: BoardRoleType;
  joinedAt: number; // timestamp вместо Date
  permissions: BoardPermission[];
  isActive: boolean;
  lastSeen?: number; // timestamp вместо Date
}


// Тип для совместимости со строковыми литералами
export type BoardRoleType = BoardRole | 'owner' | 'admin' | 'member' | 'viewer' | 'guest';

export interface BoardPermission {
  id: string;
  name: string;
  description: string;
  resource: 'board' | 'column' | 'task' | 'comment' | 'member' | 'attachment';
  action: 'create' | 'read' | 'update' | 'delete' | 'manage' | 'archive';
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number | boolean | number | null; // timestamp вместо Date
}

export interface BoardSettings {
  // Основные настройки
  allowMemberInvites: boolean;
  allowPublicView: boolean;
  allowComments: boolean;
  allowAttachments: boolean;
  allowTaskCreation: boolean;
  allowTaskEditing: boolean;
  
  // Настройки колонок
  defaultColumnTemplate: string[];
  allowColumnCustomization: boolean;
  maxColumns: number;
  
  // Настройки задач
  allowSubtaskCreation: boolean;
  allowTaskAssignment: boolean;
  allowDueDateSetting: boolean;
  allowPrioritySetting: boolean;
  allowTagging: boolean;
  
  // Автоматизация
  autoArchiveCompleted: boolean;
  archiveAfterDays: number;
  autoAssignTasks: boolean;
  autoNotifyAssignees: boolean;
  
  // Уведомления
  emailNotifications: boolean;
  pushNotifications: boolean;
  desktopNotifications: boolean;
  
  // Приватность
  showTaskDetails: 'all' | 'members' | 'assignees';
  showMemberActivity: boolean;
  showTaskHistory: boolean;
}

export interface BoardStatistics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalMembers: number;
  activeMembers: number;
  lastActivity: number; // timestamp вместо Date
  completionRate: number;
  averageTaskDuration: number;
  totalComments: number;
  totalAttachments: number;
}

// ===== КОЛОНКИ ДОСКИ =====

export interface Column {
  id: string;
  boardId: string;
  title: string;
  description?: string;
  icon?: string;
  color: string;
  order: number;
  isLocked: boolean;
  isCollapsed: boolean;
  isStandard?: boolean; // Флаг для стандартных колонок по умолчанию
  taskLimit?: number;
  wipLimit?: number; // Work In Progress limit
  tasks: Task[];
  settings: ColumnSettings;
  statistics: ColumnStatistics;
  createdAt: number; // timestamp вместо Date
  updatedAt: number; // timestamp вместо Date
}

export interface ColumnSettings {
  allowTaskCreation: boolean;
  allowTaskEditing: boolean;
  allowTaskMoving: boolean;
  allowTaskDeletion: boolean;
  allowSubtaskCreation: boolean;
  allowCommentCreation: boolean;
  allowAttachmentUpload: boolean;
  autoSortTasks: boolean;
  sortBy: 'order' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
  sortDirection: 'asc' | 'desc';
}

export interface ColumnStatistics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  averageTaskDuration: number;
  totalComments: number;
  totalAttachments: number;
  lastTaskUpdate: number; // timestamp вместо Date
}

// ===== ЗАДАЧИ =====

export interface Task {
  id: string;
  boardId: string;
  columnId: string;
  
  // Основная информация
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  
  // Участники
  assigneeId?: string;
  reporterId: string;
  watchers: string[]; // userIds
  collaborators: string[]; // userIds
  
  // Временные параметры
  dueDate?: number; // timestamp вместо Date
  startDate?: number; // timestamp вместо Date
  completedAt?: number; // timestamp вместо Date
  estimatedHours?: number;
  actualHours?: number;
  timeSpent: number;
  
  // Метаданные
  tags: TaskTag[];
  labels: TaskLabel[];
  attachments: Attachment[];
  subtasks: Subtask[];
  comments: Comment[];
  activities: Activity[];
  
  // Статистика
  statistics: TaskStatistics;
  
  // Настройки
  isArchived: boolean;
  isPinned: boolean;
  isPrivate: boolean;
  allowComments: boolean;
  allowAttachments: boolean;
  
  // Системные поля
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  
  // Порядок и группировка
  order: number;
  parentTaskId?: string; // для эпиков
  epicId?: string;
  sprintId?: string;
  
  // Дополнительные поля
  customFields: Record<string, string | number | boolean | Date | null>;
}

export const TaskStatus = {
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

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical'
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export const TaskType = {
  TASK: 'task',
  BUG: 'bug',
  FEATURE: 'feature',
  STORY: 'story',
  EPIC: 'epic',
  SUBTASK: 'subtask'
} as const;

export type TaskType = typeof TaskType[keyof typeof TaskType];

export interface TaskTag {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: number; // timestamp вместо Date
  createdBy: string;
}

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
  description?: string;
  isSystem: boolean;
  createdAt: number; // timestamp вместо Date
}

export interface TaskStatistics {
  totalComments: number;
  totalAttachments: number;
  totalSubtasks: number;
  completedSubtasks: number;
  totalLikes: number;
  totalViews: number;
  lastCommentAt?: number; // timestamp вместо Date
  lastActivityAt: number; // timestamp вместо Date
  timeInStatus: Record<TaskStatus, number>; // время в каждом статусе
}

// ===== ПОДЗАДАЧИ =====

export interface Subtask {
  id: string;
  taskId: string;
  boardId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: number; // timestamp вместо Date
  completedBy?: string;
  assigneeId?: string;
  dueDate?: number; // timestamp вместо Date
  priority: TaskPriority;
  order: number;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  createdAt: number; // timestamp вместо Date
  updatedAt: number; // timestamp вместо Date
  createdBy: string;
}

// ===== КОММЕНТАРИИ =====

export interface Comment {
  id: string;
  taskId: string;
  boardId: string;
  authorId: string;
  content: string;
  contentHtml?: string;
  mentions: string[]; // userIds
  attachments: Attachment[];
  isEdited: boolean;
  editedAt?: number; // timestamp вместо Date
  editedBy?: string;
  parentCommentId?: string; // для ответов
  replies: Comment[];
  likes: string[]; // userIds
  reactions: CommentReaction[];
  isPinned: boolean;
  isPrivate: boolean;
  createdAt: number; // timestamp вместо Date
  updatedAt: number; // timestamp вместо Date
}

export interface CommentReaction {
  id: string;
  commentId: string;
  userId: string;
  emoji: string;
  createdAt: number; // timestamp вместо Date
}

// ===== ВЛОЖЕНИЯ =====

export interface Attachment {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedAt: number; // timestamp вместо Date
  taskId?: string;
  commentId?: string;
  boardId: string;
  isPublic: boolean;
  downloadCount: number;
  lastDownloadedAt?: number; // timestamp вместо Date
  metadata?: Record<string, string | number | boolean | number | null>; // timestamp вместо Date
}

// ===== АКТИВНОСТЬ И ИСТОРИЯ =====

export interface Activity {
  id: string;
  taskId: string;
  boardId: string;
  userId: string;
  action: ActivityAction;
  details: ActivityDetails;
  metadata?: Record<string, string | number | boolean | number | null>; // timestamp вместо Date
  timestamp: number; // timestamp вместо Date
  ipAddress?: string;
  userAgent?: string;
}

export const ActivityAction = {
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

export type ActivityAction = typeof ActivityAction[keyof typeof ActivityAction];

export interface ActivityDetails {
  field?: string;
  oldValue?: string | number | boolean | number | null; // timestamp вместо Date
  newValue?: string | number | boolean | number | null; // timestamp вместо Date
  message?: string;
  metadata?: Record<string, string | number | boolean | number | null>; // timestamp вместо Date
  relatedEntityId?: string;
  relatedEntityType?: string;
}

// ===== ШАБЛОНЫ И НАСТРОЙКИ =====

export interface BoardTemplate {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  columns: ColumnTemplate[];
  defaultSettings: BoardSettings;
  isDefault: boolean;
  isPublic: boolean;
  isSystem: boolean;
  category: TemplateCategory;
  tags: string[];
  createdBy: string;
  createdAt: number; // timestamp вместо Date
  updatedAt: number; // timestamp вместо Date
  usageCount: number;
  rating: number;
  totalRatings: number;
}

export const TemplateCategory = {
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

export type TemplateCategory = typeof TemplateCategory[keyof typeof TemplateCategory];

export interface ColumnTemplate {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  color: string;
  order: number;
  taskLimit?: number;
  wipLimit?: number;
  defaultSettings: ColumnSettings;
  isRequired: boolean;
  isSystem: boolean;
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ТИПЫ =====

export interface TaskFilter {
  id: string;
  name: string;
  boardId: string;
  userId: string;
  isGlobal: boolean;
  isDefault: boolean;
  criteria: FilterCriteria[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  createdAt: number; // timestamp вместо Date
  updatedAt: number; // timestamp вместо Date
}

export interface FilterCriteria {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in' | 'is_null' | 'is_not_null';
  value: string | number | boolean | Date | null;
  value2?: string | number | boolean | Date | null; // для оператора 'between'
}

export interface TaskView {
  id: string;
  name: string;
  boardId: string;
  userId: string;
  type: 'kanban' | 'list' | 'calendar' | 'timeline' | 'gantt';
  settings: ViewSettings;
  filters: TaskFilter[];
  columns: string[]; // column IDs
  isDefault: boolean;
  createdAt: number; // timestamp вместо Date
  updatedAt: number; // timestamp вместо Date
}

export interface ViewSettings {
  showSubtasks: boolean;
  showComments: boolean;
  showAttachments: boolean;
  showActivity: boolean;
  groupBy?: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageSize: number;
  autoRefresh: boolean;
  refreshInterval: number;
}

// ===== СИСТЕМНЫЕ ТИПЫ =====
