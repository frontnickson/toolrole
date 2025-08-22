import type {
  Board,
  Column,
  Task,
  TaskStatus,
  TaskPriority,
  Subtask,
  Comment,
  Activity,
  ActivityAction,
  ActivityDetails,
  BoardSettings,
  ColumnSettings,
  ColumnStatistics
} from '../types/board';
import {
  TaskStatus as TaskStatusEnum,
  TaskPriority as TaskPriorityEnum
} from '../types/board';
import { 
  DEFAULT_COLUMNS
} from '../constants/boardConstants';

// ===== УТИЛИТЫ ДЛЯ СОЗДАНИЯ ОБЪЕКТОВ =====

/**
 * Создает новую доску с базовыми настройками
 */
export const createBoard = (title: string, description: string, ownerId: string, color: string = '#007bff'): Board => {
  const now = Date.now();
  
  return {
    id: generateId(),
    title,
    description,
    icon: '📋',
    color,
    ownerId,
    teamId: undefined,
    members: [{
      id: generateId(),
      userId: ownerId,
      boardId: '', // будет установлено после создания
      role: 'owner',
      joinedAt: now,
      permissions: [],
      isActive: true,
      lastSeen: now
    }],
    columns: createDefaultColumns(),
    settings: createDefaultBoardSettings(),
    statistics: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      totalMembers: 1,
      activeMembers: 1,
      lastActivity: now,
      completionRate: 0,
      averageTaskDuration: 0,
      totalComments: 0,
      totalAttachments: 0
    },
    createdAt: now,
    updatedAt: now,
    isArchived: false,
    isPublic: false,
    isTemplate: false
  };
};

/**
 * Создает колонки по умолчанию для новой доски
 */
export const createDefaultColumns = (): Column[] => {
  const now = Date.now();
  
  return DEFAULT_COLUMNS.map((col) => ({
    id: generateId(),
    boardId: '', // будет установлено после создания
    title: col.title,
    description: col.description,
    icon: col.icon,
    color: col.color,
    order: col.order,
    isLocked: false,
    isCollapsed: false,
    taskLimit: undefined,
    wipLimit: col.wipLimit,
    tasks: [],
    settings: createDefaultColumnSettings(),
    statistics: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      lastTaskUpdate: now,
      averageTaskDuration: 0,
      totalComments: 0,
      totalAttachments: 0
    },
    createdAt: now,
    updatedAt: now
  }));
};

/**
 * Создает настройки по умолчанию для доски
 */
export const createDefaultBoardSettings = (): BoardSettings => {
  return {
    // Основные настройки
    allowMemberInvites: true,
    allowPublicView: false,
    allowComments: true,
    allowAttachments: true,
    allowTaskCreation: true,
    allowTaskEditing: true,
    
    // Настройки колонок
    defaultColumnTemplate: ['planning', 'in_progress', 'review', 'testing', 'completed'],
    allowColumnCustomization: true,
    maxColumns: 10,
    
    // Настройки задач
    allowSubtaskCreation: true,
    allowTaskAssignment: true,
    allowDueDateSetting: true,
    allowPrioritySetting: true,
    allowTagging: true,
    
    // Автоматизация
    autoArchiveCompleted: true,
    archiveAfterDays: 30,
    autoAssignTasks: false,
    autoNotifyAssignees: true,
    
    // Уведомления
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: true,
    
    // Приватность
    showTaskDetails: 'members',
    showMemberActivity: true,
    showTaskHistory: true
  };
};

/**
 * Создает настройки по умолчанию для колонки
 */
export const createDefaultColumnSettings = (): ColumnSettings => {
  return {
    allowTaskCreation: true,
    allowTaskEditing: true,
    allowTaskMoving: true,
    allowTaskDeletion: true,
    allowSubtaskCreation: true,
    allowCommentCreation: true,
    allowAttachmentUpload: true,
    autoSortTasks: false,
    sortBy: 'order',
    sortDirection: 'asc'
  };
};

/**
 * Создает пустую статистику для колонки
 */
export const createEmptyColumnStatistics = (): ColumnStatistics => {
  return {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    averageTaskDuration: 0,
    totalComments: 0,
    totalAttachments: 0,
    lastTaskUpdate: new Date()
  };
};

// ===== УТИЛИТЫ ДЛЯ ЗАДАЧ =====

/**
 * Создает новую задачу
 */
export const createTask = (
  boardId: string,
  columnId: string,
  title: string,
  description: string,
  status: TaskStatus,
  priority: TaskPriority,
  assigneeId?: string,
  reporterId?: string,
  dueDate?: Date,
  tags: string[] = [],
  estimatedHours?: number
): Task => {
  const now = Date.now();
  
  return {
    id: generateId(),
    boardId,
    columnId,
    title,
    description,
    status,
    priority,
    type: 'task', // TaskTypeEnum.TASK was removed, so using 'task'
    assigneeId,
    reporterId: reporterId || 'unknown',
    watchers: reporterId ? [reporterId] : [],
    collaborators: [],
    dueDate: dueDate ? dueDate.getTime() : undefined,
    startDate: undefined,
    completedAt: undefined,
    estimatedHours,
    actualHours: 0,
    timeSpent: 0,
    tags: tags.map(tag => ({
      id: generateId(),
      name: tag,
      color: '#007bff',
      description: '',
      createdAt: now,
      createdBy: reporterId || 'unknown'
    })),
    labels: [],
    attachments: [],
    subtasks: [],
    comments: [],
    activities: [],
    statistics: {
      totalComments: 0,
      totalAttachments: 0,
      totalSubtasks: 0,
      completedSubtasks: 0,
      totalLikes: 0,
      totalViews: 0,
      lastActivityAt: now,
      timeInStatus: {
        [TaskStatusEnum.PLANNING]: 0,
        [TaskStatusEnum.IN_PROGRESS]: 0,
        [TaskStatusEnum.REVIEW]: 0,
        [TaskStatusEnum.TESTING]: 0,
        [TaskStatusEnum.COMPLETED]: 0,
        [TaskStatusEnum.CANCELLED]: 0,
        [TaskStatusEnum.BLOCKED]: 0,
        [TaskStatusEnum.ON_HOLD]: 0
      }
    },
    isArchived: false,
    isPinned: false,
    isPrivate: false,
    allowComments: true,
    allowAttachments: true,
    parentTaskId: undefined,
    epicId: undefined,
    sprintId: undefined,
    order: 0,
    customFields: {},
    createdAt: now,
    updatedAt: now,
    createdBy: reporterId || 'unknown',
    updatedBy: reporterId || 'unknown'
  };
};

/**
 * Создает новую подзадачу
 */
export const createSubtask = (
  taskId: string,
  boardId: string,
  title: string,
  description: string,
  assigneeId?: string,
  priority: TaskPriority = TaskPriorityEnum.MEDIUM,
  dueDate?: Date,
  estimatedHours?: number
): Subtask => {
  const now = Date.now();
  
  return {
    id: generateId(),
    taskId,
    boardId,
    title,
    description,
    isCompleted: false,
    completedAt: undefined,
    completedBy: undefined,
    assigneeId,
    dueDate: dueDate ? dueDate.getTime() : undefined,
    priority,
    order: 0,
    estimatedHours,
    actualHours: 0,
    tags: [],
    attachments: [],
    comments: [],
    createdAt: now,
    updatedAt: now,
    createdBy: 'unknown',
  };
};

/**
 * Создает новый комментарий
 */
export const createComment = (
  taskId: string,
  boardId: string,
  authorId: string,
  content: string,
  parentCommentId?: string
): Comment => {
  const now = Date.now();
  
  return {
    id: generateId(),
    taskId,
    boardId,
    authorId,
    content,
    contentHtml: undefined,
    mentions: [],
    attachments: [],
    isEdited: false,
    editedAt: undefined,
    editedBy: undefined,
    parentCommentId,
    replies: [],
    likes: [],
    reactions: [],
    isPinned: false,
    isPrivate: false,
    createdAt: now,
    updatedAt: now
  };
};

/**
 * Создает новую активность
 */
export const createActivity = (
  taskId: string,
  boardId: string,
  userId: string,
  action: ActivityAction,
  details: Partial<ActivityDetails> = {}
): Activity => {
  const now = Date.now();
  
  return {
    id: generateId(),
    taskId,
    boardId,
    userId,
    action,
    details: {
      field: details.field || '',
      oldValue: details.oldValue || null,
      newValue: details.newValue || null,
      message: details.message || '',
      metadata: details.metadata || {},
      relatedEntityId: details.relatedEntityId || undefined,
      relatedEntityType: details.relatedEntityType || undefined
    },
    metadata: details.metadata || {},
    timestamp: now
  };
};

// ===== УТИЛИТЫ ДЛЯ ВАЛИДАЦИИ =====

/**
 * Проверяет валидность доски
 */
export const validateBoard = (board: Board): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!board.title.trim()) {
    errors.push('Название доски обязательно');
  }
  
  if (board.title.length > 20) { // MAX_VALUES.TITLE_LENGTH was removed, so using 20
    errors.push(`Название доски не может быть длиннее 20 символов`);
  }
  
  if (board.title.length < 3) { // MIN_VALUES.TITLE_LENGTH was removed, so using 3
    errors.push(`Название доски должно содержать минимум 3 символ`);
  }
  
  if (board.columns.length === 0) {
    errors.push('Доска должна содержать хотя бы одну колонку');
  }
  
  if (board.columns.length > 20) {
    errors.push('Доска не может содержать более 20 колонок');
  }
  
  if (!board.ownerId) {
    errors.push('Доска должна иметь владельца');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Проверяет валидность задачи
 */
export const validateTask = (task: Task): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!task.title.trim()) {
    errors.push('Название задачи обязательно');
  }
  
  if (task.title.length > 20) { // MAX_VALUES.TITLE_LENGTH was removed, so using 20
    errors.push(`Название задачи не может быть длиннее 20 символов`);
  }
  
  if (task.title.length < 3) { // MIN_VALUES.TITLE_LENGTH was removed, so using 3
    errors.push(`Название задачи должно содержать минимум 3 символ`);
  }
  
  if (task.description && task.description.length > 500) { // MAX_VALUES.DESCRIPTION_LENGTH was removed, so using 500
    errors.push(`Описание задачи не может быть длиннее 500 символов`);
  }
  
  if (!task.boardId) {
    errors.push('Задача должна принадлежать доске');
  }
  
  if (!task.columnId) {
    errors.push('Задача должна находиться в колонке');
  }
  
  if (!task.reporterId) {
    errors.push('Задача должна иметь создателя');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ===== УТИЛИТЫ ДЛЯ ОПЕРАЦИЙ =====

/**
 * Перемещает задачу между колонками
 */
export const moveTask = (
  board: Board,
  taskId: string,
  fromColumnId: string,
  toColumnId: string,
  newOrder: number
): Board => {
  const updatedBoard = { ...board };
  
  // Находим исходную колонку
  const fromColumn = updatedBoard.columns.find(col => col.id === fromColumnId);
  if (!fromColumn) return board;
  
  // Находим задачу
  const taskIndex = fromColumn.tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return board;
  
  // Удаляем задачу из исходной колонки
  const [task] = fromColumn.tasks.splice(taskIndex, 1);
  
  // Находим целевую колонку
  const toColumn = updatedBoard.columns.find(col => col.id === toColumnId);
  if (!toColumn) return board;
  
  // Обновляем данные задачи
  task.columnId = toColumnId;
  task.order = newOrder;
  task.updatedAt = new Date();
  task.updatedBy = task.assigneeId || task.reporterId;
  
  // Добавляем задачу в новую колонку
  toColumn.tasks.splice(newOrder, 0, task);
  
  // Обновляем статистику
  updateBoardStatistics(updatedBoard);
  
  return updatedBoard;
};

export const updateColumnStatistics = (column: Column) => {
  const now = Date.now();
  
  if (column.tasks.length > 0) {
    column.statistics.lastTaskUpdate = Math.max(...column.tasks.map(t => t.updatedAt.getTime()));
  }
  
  return column.statistics;
};

/**
 * Обновляет статистику доски
 */
export const updateBoardStatistics = (board: Board) => {
  const now = Date.now();
  
  // Обновляем статистику доски на основе колонок
  board.columns.forEach(column => {
    updateColumnStatistics(column);
  });
  
  // Обновляем общую статистику доски
  board.statistics.lastActivity = now;
  
  return board.statistics;
};

/**
 * Проверяет, может ли пользователь выполнить действие
 */
export const canUserPerformAction = (
  user: any, // BoardMember type was removed, so using 'any' for now
  action: string,
  resource: string
): boolean => {
  // Базовая логика проверки прав
  if (user.role === 'owner') return true;
  if (user.role === 'admin' && action !== 'delete') return true;
  
  // Проверяем конкретные разрешения
  const hasPermission = user.permissions.some((permission: any) => 
    permission.resource === resource && permission.action === action
  );
  
  return hasPermission;
};

// ===== УТИЛИТЫ ДЛЯ ШАБЛОНОВ =====

/**
 * Создает доску из шаблона
 */
export const createBoardFromTemplate = (
  template: any, // BoardTemplate type was removed, so using 'any' for now
  ownerId: string,
  title: string,
  description?: string,
  color?: string
): Board => {
  const now = Date.now();
  
  return {
    id: generateId(),
    title: title || template.title,
    description: description || template.description,
    icon: template.icon || '📋',
    color: color || template.color,
    ownerId,
    teamId: undefined,
    members: [{
      id: generateId(),
      userId: ownerId,
      boardId: '', // будет установлено после создания
      role: 'owner',
      joinedAt: now,
      permissions: [],
      isActive: true,
      lastSeen: now
    }],
    columns: template.columns.map((colTemplate: any) => ({ // ColumnTemplate type was removed, so using 'any' for now
      id: generateId(),
      boardId: '', // будет установлено после создания
      title: colTemplate.title,
      description: colTemplate.description,
      icon: colTemplate.icon,
      color: colTemplate.color,
      order: colTemplate.order,
      isLocked: false,
      isCollapsed: false,
      taskLimit: colTemplate.taskLimit,
      wipLimit: colTemplate.wipLimit,
      tasks: [],
      settings: createDefaultColumnSettings(),
      statistics: {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        lastTaskUpdate: now,
        averageTaskDuration: 0,
        totalComments: 0,
        totalAttachments: 0
      },
      createdAt: now,
      updatedAt: now
    })),
    settings: template.settings || createDefaultBoardSettings(),
    statistics: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      totalMembers: 1,
      activeMembers: 1,
      lastActivity: now,
      completionRate: 0,
      averageTaskDuration: 0,
      totalComments: 0,
      totalAttachments: 0
    },
    createdAt: now,
    updatedAt: now,
    isArchived: false,
    isPublic: false,
    isTemplate: false
  };
};

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

/**
 * Генерирует уникальный ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Форматирует дату для отображения
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Форматирует относительное время
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  if (hours < 24) return `${hours} ч назад`;
  if (days < 7) return `${days} дн назад`;
  
  return formatDate(date);
};

/**
 * Проверяет, просрочена ли задача
 */
export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === 'completed') return false;
  return new Date(task.dueDate) < new Date();
};

/**
 * Получает цвет для приоритета задачи
 */
export const getPriorityColor = (priority: TaskPriority): string => {
  return priority === 'high' ? '#dc3545' : priority === 'low' ? '#6c757d' : '#007bff';
};

/**
 * Получает цвет для статуса задачи
 */
export const getStatusColor = (status: TaskStatus): string => {
  return status === 'completed' ? '#28a745' : status === 'in_progress' ? '#007bff' : '#6c757d';
};
