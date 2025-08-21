import type { 
  Board, 
  Column, 
  Task, 
  BoardMember, 
  TaskStatus, 
  TaskPriority, 
  TaskType,
  Subtask,
  Comment,
  Activity,
  ActivityAction,
  BoardTemplate,
  BoardSettings,
  ColumnSettings
} from '../types/board';
import { 
  DEFAULT_COLUMNS, 
  PRIORITY_COLORS, 
  STATUS_COLORS, 
  MAX_VALUES, 
  MIN_VALUES,
  ACTIVITY_ACTIONS 
} from '../constants/boardConstants';

// ===== УТИЛИТЫ ДЛЯ СОЗДАНИЯ ОБЪЕКТОВ =====

/**
 * Создает новую доску с базовыми настройками
 */
export const createNewBoard = (
  title: string,
  ownerId: string,
  description?: string,
  icon?: string,
  color: string = '#3B82F6'
): Board => {
  const now = new Date();
  
  return {
    id: generateId(),
    title,
    description,
    icon,
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
  const now = new Date();
  
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
    statistics: createEmptyColumnStatistics(),
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
export const createEmptyColumnStatistics = () => {
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
export const createNewTask = (
  title: string,
  boardId: string,
  columnId: string,
  reporterId: string,
  description?: string,
  assigneeId?: string,
  priority: TaskPriority = 'medium' as TaskPriority,
  type: TaskType = 'task' as TaskType,
  dueDate?: Date
): Task => {
  const now = new Date();
  
  return {
    id: generateId(),
    boardId,
    columnId,
    title,
    description,
    status: 'planning' as TaskStatus,
    priority,
    type,
    assigneeId,
    reporterId,
    watchers: [reporterId],
    collaborators: assigneeId ? [assigneeId] : [],
    dueDate,
    startDate: undefined,
    completedAt: undefined,
    estimatedHours: undefined,
    actualHours: 0,
    timeSpent: 0,
    tags: [],
    labels: [],
    attachments: [],
    subtasks: [],
    comments: [],
    activities: [{
      id: generateId(),
      taskId: '', // будет установлено после создания
      boardId,
      userId: reporterId,
      action: 'TASK_CREATED' as ActivityAction,
      details: {
        message: 'Задача создана',
        metadata: { title, priority, type }
      },
      timestamp: now
    }],
    statistics: {
      totalComments: 0,
      totalAttachments: 0,
      totalSubtasks: 0,
      completedSubtasks: 0,
      totalLikes: 0,
      totalViews: 0,
      lastCommentAt: undefined,
      lastActivityAt: now,
      timeInStatus: {
        planning: 0,
        in_progress: 0,
        review: 0,
        testing: 0,
        completed: 0,
        cancelled: 0,
        blocked: 0,
        on_hold: 0
      }
    },
    isArchived: false,
    isPinned: false,
    isPrivate: false,
    allowComments: true,
    allowAttachments: true,
    createdAt: now,
    updatedAt: now,
    createdBy: reporterId,
    updatedBy: reporterId,
    order: 0,
    parentTaskId: undefined,
    epicId: undefined,
    sprintId: undefined,
    customFields: {}
  };
};

/**
 * Создает новую подзадачу
 */
export const createNewSubtask = (
  title: string,
  taskId: string,
  boardId: string,
  createdBy: string,
  description?: string,
  assigneeId?: string,
  priority: TaskPriority = 'medium' as TaskPriority
): Subtask => {
  const now = new Date();
  
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
    dueDate: undefined,
    priority,
    order: 0,
    estimatedHours: undefined,
    actualHours: 0,
    tags: [],
    attachments: [],
    comments: [],
    createdAt: now,
    updatedAt: now,
    createdBy
  };
};

/**
 * Создает новый комментарий
 */
export const createNewComment = (
  content: string,
  taskId: string,
  boardId: string,
  authorId: string,
  mentions: string[] = [],
  parentCommentId?: string
): Comment => {
  const now = new Date();
  
  return {
    id: generateId(),
    taskId,
    boardId,
    authorId,
    content,
    contentHtml: undefined,
    mentions,
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
  details: {
    field?: string;
    oldValue?: string | number | boolean | Date | null;
    newValue?: string | number | boolean | Date | null;
    message?: string;
    metadata?: Record<string, string | number | boolean | Date | null>;
    relatedEntityId?: string;
    relatedEntityType?: string;
  }
): Activity => {
  return {
    id: generateId(),
    taskId,
    boardId,
    userId,
    action,
    details,
    metadata: details.metadata,
    timestamp: new Date()
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
  
  if (board.title.length > MAX_VALUES.TITLE_LENGTH) {
    errors.push(`Название доски не может быть длиннее ${MAX_VALUES.TITLE_LENGTH} символов`);
  }
  
  if (board.title.length < MIN_VALUES.TITLE_LENGTH) {
    errors.push(`Название доски должно содержать минимум ${MIN_VALUES.TITLE_LENGTH} символ`);
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
  
  if (task.title.length > MAX_VALUES.TITLE_LENGTH) {
    errors.push(`Название задачи не может быть длиннее ${MAX_VALUES.TITLE_LENGTH} символов`);
  }
  
  if (task.title.length < MIN_VALUES.TITLE_LENGTH) {
    errors.push(`Название задачи должно содержать минимум ${MIN_VALUES.TITLE_LENGTH} символ`);
  }
  
  if (task.description && task.description.length > MAX_VALUES.DESCRIPTION_LENGTH) {
    errors.push(`Описание задачи не может быть длиннее ${MAX_VALUES.DESCRIPTION_LENGTH} символов`);
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

/**
 * Обновляет статистику доски
 */
export const updateBoardStatistics = (board: Board): void => {
  let totalTasks = 0;
  let completedTasks = 0;
  let inProgressTasks = 0;
  let overdueTasks = 0;
  let totalComments = 0;
  let totalAttachments = 0;
  
  const now = new Date();
  
  board.columns.forEach(column => {
    totalTasks += column.tasks.length;
    
    column.tasks.forEach(task => {
      if (task.status === 'completed') {
        completedTasks++;
      } else if (['in_progress', 'review', 'testing'].includes(task.status)) {
        inProgressTasks++;
      }
      
      if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed') {
        overdueTasks++;
      }
      
      totalComments += task.statistics.totalComments;
      totalAttachments += task.statistics.totalAttachments;
    });
    
    // Обновляем статистику колонки
    column.statistics.totalTasks = column.tasks.length;
    column.statistics.completedTasks = column.tasks.filter(t => t.status === 'completed').length;
    column.statistics.inProgressTasks = column.tasks.filter(t => 
      ['in_progress', 'review', 'testing'].includes(t.status)
    ).length;
    column.statistics.overdueTasks = column.tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
    ).length;
    column.statistics.totalComments = column.tasks.reduce((sum, t) => sum + t.statistics.totalComments, 0);
    column.statistics.totalAttachments = column.tasks.reduce((sum, t) => sum + t.statistics.totalAttachments, 0);
    
    if (column.tasks.length > 0) {
      column.statistics.lastTaskUpdate = new Date(Math.max(...column.tasks.map(t => t.updatedAt.getTime())));
    }
  });
  
  // Обновляем статистику доски
  board.statistics = {
    ...board.statistics,
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
    totalComments,
    totalAttachments,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    lastActivity: now
  };
};

/**
 * Проверяет, может ли пользователь выполнить действие
 */
export const canUserPerformAction = (
  user: BoardMember,
  action: string,
  resource: string
): boolean => {
  // Владелец может все
  if (user.role === 'owner') return true;
  
  // Админ может управлять участниками и настройками
  if (user.role === 'admin') {
    if (['manage', 'delete'].includes(action)) return true;
    if (resource === 'member' && action === 'update') return true;
  }
  
  // Проверяем конкретные разрешения
  return user.permissions.some(permission => 
    permission.resource === resource && 
    permission.action === action
  );
};

// ===== УТИЛИТЫ ДЛЯ ШАБЛОНОВ =====

/**
 * Создает доску из шаблона
 */
export const createBoardFromTemplate = (
  template: BoardTemplate,
  ownerId: string,
  title: string,
  description?: string
): Board => {
  const now = new Date();
  
  return {
    id: generateId(),
    title: title || template.name,
    description: description || template.description,
    icon: template.icon,
    color: template.color,
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
    columns: template.columns.map((colTemplate) => ({
      id: generateId(),
      boardId: '', // будет установлено после создания
      title: colTemplate.title,
      description: colTemplate.description,
      icon: colTemplate.icon,
      color: colTemplate.color,
      order: colTemplate.order,
      isLocked: colTemplate.isSystem,
      isCollapsed: false,
      taskLimit: colTemplate.taskLimit,
      wipLimit: colTemplate.wipLimit,
      tasks: [],
      settings: colTemplate.defaultSettings || createDefaultColumnSettings(),
      statistics: createEmptyColumnStatistics(),
      createdAt: now,
      updatedAt: now
    })),
    settings: template.defaultSettings || createDefaultBoardSettings(),
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
    isTemplate: false,
    templateId: template.id
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
  return PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;
};

/**
 * Получает цвет для статуса задачи
 */
export const getStatusColor = (status: TaskStatus): string => {
  return STATUS_COLORS[status] || STATUS_COLORS.planning;
};
