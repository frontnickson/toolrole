import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Board, Column, Task, TaskStatus, TaskPriority, TaskType } from '../../types';
import type { BoardState } from '../../types/state';
import { notificationService } from '../../services/notificationService';

// ===== УТИЛИТЫ ДЛЯ API =====
// localStorage больше не используется - все данные загружаются с сервера

// ===== СТАНДАРТНЫЕ КОЛОНКИ =====
// Эти колонки создаются автоматически при создании доски и защищены от изменений
// Пользователи не могут их переименовать или удалить

const createStandardColumns = (boardId: string): Column[] => [
  {
    id: `col-${boardId}-planning`,
    boardId: boardId,
    title: 'Начало работы',
    description: 'Задачи, которые нужно начать выполнять',
    icon: '📋',
    color: '#3b82f6',
    order: 0,
    isLocked: false,
    isCollapsed: false,
    isStandard: true,
    tasks: [
      {
        id: 'test-task-1',
        boardId: boardId,
        columnId: `col-${boardId}-planning`,
        title: 'Тестовая задача 1',
        description: 'Задача для тестирования календаря',
        status: 'planning' as TaskStatus,
        priority: 'medium' as TaskPriority,
        type: 'task' as TaskType,
        assigneeId: undefined,
        reporterId: 'user-1',
        watchers: ['user-1'],
        collaborators: [],
        dueDate: Date.now() + 2 * 24 * 60 * 60 * 1000, // +2 дня
        startDate: undefined,
        estimatedHours: 4,
        actualHours: 0,
        tags: [],
        labels: [],
        attachments: [],
        subtasks: [],
        comments: [],
        isArchived: false,
        isPinned: false,
        isPrivate: false,
        allowComments: true,
        allowAttachments: true,
        parentTaskId: undefined,
        epicId: undefined,
        sprintId: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user-1',
        updatedBy: 'user-1',
        statistics: {
          totalComments: 0,
          totalAttachments: 0,
          totalSubtasks: 0,
          completedSubtasks: 0,
          totalLikes: 0,
          totalViews: 0,
          lastActivityAt: Date.now(),
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
        activities: [],
        timeSpent: 0,
        order: 0,
        customFields: {}
      },
      {
        id: 'test-task-2',
        boardId: boardId,
        columnId: `col-${boardId}-planning`,
        title: 'Тестовая задача 2',
        description: 'Еще одна задача для тестирования',
        status: 'planning' as TaskStatus,
        priority: 'high' as TaskPriority,
        type: 'task' as TaskType,
        assigneeId: undefined,
        reporterId: 'user-1',
        watchers: ['user-1'],
        collaborators: [],
        dueDate: Date.now() + 5 * 24 * 60 * 60 * 1000, // +5 дней
        startDate: undefined,
        estimatedHours: 8,
        actualHours: 0,
        tags: [],
        labels: [],
        attachments: [],
        subtasks: [],
        comments: [],
        isArchived: false,
        isPinned: false,
        isPrivate: false,
        allowComments: true,
        allowAttachments: true,
        parentTaskId: undefined,
        epicId: undefined,
        sprintId: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user-1',
        updatedBy: 'user-1',
        statistics: {
          totalComments: 0,
          totalAttachments: 0,
          totalSubtasks: 0,
          completedSubtasks: 0,
          totalLikes: 0,
          totalViews: 0,
          lastActivityAt: Date.now(),
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
        activities: [],
        timeSpent: 0,
        order: 1,
        customFields: {}
      }
    ],
    settings: {
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
    },
    statistics: {
      totalTasks: 2,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      averageTaskDuration: 0,
      totalComments: 0,
      totalAttachments: 0,
      lastTaskUpdate: Date.now()
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: `col-${boardId}-progress`,
    boardId: boardId,
    title: 'В работе',
    description: 'Задачи, которые выполняются в данный момент',
    icon: '⚡',
    color: '#f59e0b',
    order: 1,
    isLocked: false,
    isCollapsed: false,
    isStandard: true,
    tasks: [],
    settings: {
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
    },
    statistics: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      averageTaskDuration: 0,
      totalComments: 0,
      totalAttachments: 0,
      lastTaskUpdate: Date.now()
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: `col-${boardId}-review`,
    boardId: boardId,
    title: 'Проверка',
    description: 'Задачи, готовые к проверке и тестированию',
    icon: '👀',
    color: '#8b5cf6',
    order: 2,
    isLocked: false,
    isCollapsed: false,
    isStandard: true,
    tasks: [],
    settings: {
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
    },
    statistics: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      averageTaskDuration: 0,
      totalComments: 0,
      totalAttachments: 0,
      lastTaskUpdate: Date.now()
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: `col-${boardId}-completed`,
    boardId: boardId,
    title: 'Завершение',
    description: 'Завершенные задачи',
    icon: '✅',
    color: '#10b981',
    order: 3,
    isLocked: false,
    isCollapsed: false,
    isStandard: true,
    tasks: [],
    settings: {
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
    },
    statistics: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      averageTaskDuration: 0,
      totalComments: 0,
      totalAttachments: 0,
      lastTaskUpdate: Date.now()
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: `col-${boardId}-overdue`,
    boardId: boardId,
    title: 'Просрочено',
    description: 'Просроченные задачи',
    icon: '⚠️',
    color: '#DC2626',
    order: 4,
    isLocked: false,
    isCollapsed: false,
    isStandard: true,
    tasks: [],
    settings: {
      allowTaskCreation: false, // Нельзя создавать новые задачи в колонке просроченных
      allowTaskEditing: true,
      allowTaskMoving: true,
      allowTaskDeletion: true,
      allowSubtaskCreation: false,
      allowCommentCreation: true,
      allowAttachmentUpload: true,
      autoSortTasks: false,
      sortBy: 'dueDate',
      sortDirection: 'asc'
    },
    statistics: {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      averageTaskDuration: 0,
      totalComments: 0,
      totalAttachments: 0,
      lastTaskUpdate: Date.now()
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

// ===== НАЧАЛЬНЫЕ ТЕСТОВЫЕ ДАННЫЕ =====

/*
const createTestBoard = (): Board => ({
  id: 'board-1',
  title: 'Проект разработки',
  description: 'Основная доска для управления разработкой проекта',
  icon: '🚀',
  color: '#4A90E2',
  ownerId: 'user-1',
  teamId: undefined,
  members: [],
  columns: createStandardColumns('board-1'),
  settings: {
    allowMemberInvites: true,
    allowPublicView: true,
    allowComments: true,
    allowAttachments: true,
    allowTaskCreation: true,
    allowTaskEditing: true,
    defaultColumnTemplate: ['Планирование', 'В работе', 'На проверке', 'Завершено'],
    allowColumnCustomization: true,
    maxColumns: 10,
    allowSubtaskCreation: true,
    allowTaskAssignment: true,
    allowDueDateSetting: true,
    allowPrioritySetting: true,
    allowTagging: true,
    autoArchiveCompleted: false,
    archiveAfterDays: 30,
    autoAssignTasks: false,
    autoNotifyAssignees: false,
    emailNotifications: false,
    pushNotifications: false,
    desktopNotifications: false,
    showTaskDetails: 'all',
    showMemberActivity: true,
    showTaskHistory: true
  },
  statistics: {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    totalMembers: 1,
    activeMembers: 1,
    lastActivity: Date.now(),
    completionRate: 0,
    averageTaskDuration: 0,
    totalComments: 0,
    totalAttachments: 0
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isArchived: false,
  isPublic: true,
  isTemplate: false,
  isFavorite: true
});
*/

// ===== НАЧАЛЬНОЕ СОСТОЯНИЕ =====

const getInitialState = (): BoardState => {
  // Начинаем с пустого состояния - данные будут загружены с сервера
  return {
    boards: [],
    currentBoard: null,
    templates: [],
    isLoading: false,
    error: null,
  };
};

const initialState = getInitialState();

// ===== BOARD SLICE =====

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    // ===== УПРАВЛЕНИЕ ДОСКАМИ =====
    
    // Установка текущей доски
    setCurrentBoard: (state, action: PayloadAction<Board | null>) => {
      state.currentBoard = action.payload;
    },

    // Добавление новой доски
    addBoard: (state, action: PayloadAction<Board>) => {
      const board = action.payload;
      
      // Если у доски нет колонок, добавляем стандартные
      if (!board.columns || board.columns.length === 0) {
        board.columns = createStandardColumns(board.id);
      }
      
      state.boards.push(board);
    },

    // Замена всех досок (для загрузки с сервера)
    replaceAllBoards: (state, action: PayloadAction<Board[]>) => {
      // Сохраняем задачи из существующих досок
      const existingTasksMap = new Map<string, Map<string, Task[]>>();
      
      state.boards.forEach(board => {
        const boardTasks = new Map<string, Task[]>();
        board.columns.forEach(column => {
          if (column.tasks && column.tasks.length > 0) {
            boardTasks.set(column.id, [...column.tasks]);
          }
        });
        if (boardTasks.size > 0) {
          existingTasksMap.set(board.id, boardTasks);
        }
      });

      // Заменяем доски, но сохраняем существующие задачи
      state.boards = action.payload.map(board => {
        // Если у доски нет колонок, добавляем стандартные
        if (!board.columns || board.columns.length === 0) {
          board.columns = createStandardColumns(board.id);
        }
        
        // Восстанавливаем задачи из существующих досок
        const existingBoardTasks = existingTasksMap.get(board.id);
        if (existingBoardTasks) {
          board.columns.forEach(column => {
            const existingTasks = existingBoardTasks.get(column.id);
            if (existingTasks) {
              column.tasks = existingTasks;
            }
          });
        }
        
        return board;
      });
    },

    // Переключение статуса избранного
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const boardId = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.isFavorite = !board.isFavorite;
      }
    },

    // Удаление доски
    deleteBoard: (state, action: PayloadAction<string>) => {
      const boardId = action.payload;
      state.boards = state.boards.filter(b => b.id !== boardId);
      
      // Если удаляемая доска была текущей, сбрасываем currentBoard
      if (state.currentBoard?.id === boardId) {
        state.currentBoard = null;
      }
    },

    // Очистка всех досок
    clearBoards: (state) => {
      state.boards = [];
      state.currentBoard = null;
    },

    // Обновление доски
    updateBoard: (state, action: PayloadAction<{ boardId: string; updates: Partial<Board> }>) => {
      const { boardId, updates } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        // Если обновления содержат колонки с задачами, обновляем их
        if (updates.columns) {
          board.columns = updates.columns;
        } else {
          Object.assign(board, updates);
        }
        board.updatedAt = Date.now();
      }
      
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        if (updates.columns) {
          state.currentBoard.columns = updates.columns;
        } else {
          Object.assign(state.currentBoard, updates);
        }
        state.currentBoard.updatedAt = Date.now();
      }
    },

    // Обновление задач в доске (специальная функция для загрузки задач)
    updateBoardTasks: (state, action: PayloadAction<{ boardId: string; tasks: Task[] }>) => {
      const { boardId, tasks } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        // Очищаем существующие задачи и добавляем новые
        board.columns.forEach(column => {
          column.tasks = tasks.filter(task => task.columnId === column.id);
        });
        board.updatedAt = Date.now();
      }
      
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        state.currentBoard.columns.forEach(column => {
          column.tasks = tasks.filter(task => task.columnId === column.id);
        });
        state.currentBoard.updatedAt = Date.now();
      }
    },

    // ===== УПРАВЛЕНИЕ КОЛОНКАМИ =====

    // Добавление новой колонки в доску
    addColumn: (state, action: PayloadAction<{ boardId: string; column: Column }>) => {
      const { boardId, column } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        // Устанавливаем правильный порядок для новой колонки
        column.order = board.columns.length;
        board.columns.push(column);
        
        // Обновляем currentBoard если это текущая доска
        if (state.currentBoard?.id === boardId) {
          state.currentBoard.columns.push(column);
        }
      }
    },

    // Обновление колонки (включая переименование)
    updateColumn: (state, action: PayloadAction<{ boardId: string; columnId: string; updates: Partial<Column> }>) => {
      const { boardId, columnId, updates } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        const columnIndex = board.columns.findIndex(c => c.id === columnId);
        if (columnIndex !== -1) {
          board.columns[columnIndex] = { 
            ...board.columns[columnIndex], 
            ...updates,
            updatedAt: Date.now()
          };
        }
      }
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        const columnIndex = state.currentBoard.columns.findIndex(c => c.id === columnId);
        if (columnIndex !== -1) {
          state.currentBoard.columns[columnIndex] = { 
            ...state.currentBoard.columns[columnIndex], 
            ...updates,
            updatedAt: Date.now()
          };
        }
      }
    },

    // Удаление колонки
    deleteColumn: (state, action: PayloadAction<{ boardId: string; columnId: string }>) => {
      const { boardId, columnId } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        // Удаляем колонку
        board.columns = board.columns.filter(c => c.id !== columnId);
        
        // Пересчитываем порядок оставшихся колонок
        board.columns.forEach((col, index) => {
          col.order = index;
        });
      }
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        state.currentBoard.columns = state.currentBoard.columns.filter(c => c.id !== columnId);
        state.currentBoard.columns.forEach((col, index) => {
          col.order = index;
        });
      }
    },

    // Переупорядочивание колонок
    reorderColumns: (state, action: PayloadAction<{ boardId: string; columnIds: string[] }>) => {
      const { boardId, columnIds } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        const reorderedColumns = columnIds.map((id, index) => {
          const col = board.columns.find(c => c.id === id);
          if (col) {
            col.order = index;
            return col;
          }
          return null;
        }).filter(Boolean) as Column[];
        board.columns = reorderedColumns;
      }
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        const reorderedColumns = columnIds.map((id, index) => {
          const col = state.currentBoard!.columns.find(c => c.id === id);
          if (col) {
            col.order = index;
            return col;
          }
          return null;
        }).filter(Boolean) as Column[];
        state.currentBoard.columns = reorderedColumns;
      }
    },

    // ===== УПРАВЛЕНИЕ ЗАДАЧАМИ =====

    // Добавление задачи в конкретную колонку
    addTaskToColumn: (state, action: PayloadAction<{ boardId: string; columnId: string; task: Task }>) => {
      const { boardId, columnId, task } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        const column = board.columns.find(c => c.id === columnId);
        if (column) {
          column.tasks.push(task);
          
          // Создаем уведомление о новой задаче
          notificationService.notifyTaskCreated(task, board, column);
          
          // Если задача добавлена в колонку "Новые задачи" (planning), создаем специальное уведомление
          const columnType = getColumnByStatus(task.status);
          if (columnType === 'planning') {
            notificationService.notifyNewTaskInInbox(task, board, column);
          }
        }
      }
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        const column = state.currentBoard.columns.find(c => c.id === columnId);
        if (column) {
          column.tasks.push(task);
        }
      }
    },

    // Обновление задачи
    updateTask: (state, action: PayloadAction<{ boardId: string; taskId: string; updates: Partial<Task> }>) => {
      const { boardId, taskId, updates } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.columns.forEach(column => {
          const taskIndex = column.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            column.tasks[taskIndex] = { ...column.tasks[taskIndex], ...updates };
          }
        });
      }
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        state.currentBoard.columns.forEach(column => {
          const taskIndex = column.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            column.tasks[taskIndex] = { ...column.tasks[taskIndex], ...updates };
          }
        });
      }
    },

    // Удаление задачи
    deleteTask: (state, action: PayloadAction<{ boardId: string; taskId: string }>) => {
      const { boardId, taskId } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        board.columns.forEach(column => {
          column.tasks = column.tasks.filter(t => t.id !== taskId);
        });
      }
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        state.currentBoard.columns.forEach(column => {
          column.tasks = column.tasks.filter(t => t.id !== taskId);
        });
      }
    },

    // Перемещение задачи между колонками
    moveTask: (state, action: PayloadAction<{ 
      boardId: string; 
      taskId: string; 
      fromColumnId: string; 
      toColumnId: string; 
      newStatus: string;
      newOrder?: number;
    }>) => {
      const { boardId, taskId, fromColumnId, toColumnId, newStatus, newOrder } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        // Удаляем задачу из исходной колонки
        const fromColumn = board.columns.find(c => c.id === fromColumnId);
        if (fromColumn) {
          fromColumn.tasks = fromColumn.tasks.filter(t => t.id !== taskId);
        }
        
        // Добавляем задачу в целевую колонку
        const toColumn = board.columns.find(c => c.id === toColumnId);
        if (toColumn) {
          const task = board.columns.flatMap(c => c.tasks).find(t => t.id === taskId);
          if (task) {
            const updatedTask = { ...task, status: newStatus as TaskStatus };
            if (newOrder !== undefined) {
              updatedTask.order = newOrder;
            }
            toColumn.tasks.push(updatedTask);
          }
        }
      }
      
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        // Удаляем задачу из исходной колонки
        const fromColumn = state.currentBoard.columns.find(c => c.id === fromColumnId);
        if (fromColumn) {
          fromColumn.tasks = fromColumn.tasks.filter(t => t.id !== taskId);
        }
        
        // Добавляем задачу в целевую колонку
        const toColumn = state.currentBoard.columns.find(c => c.id === toColumnId);
        if (toColumn) {
          const task = state.currentBoard.columns.flatMap(c => c.tasks).find(t => t.id === taskId);
          if (task) {
            const updatedTask = { ...task, status: newStatus as TaskStatus };
            if (newOrder !== undefined) {
              updatedTask.order = newOrder;
            }
            toColumn.tasks.push(updatedTask);
          }
        }
      }
    },

    // Переупорядочивание задач в колонке
    reorderTasksInColumn: (state, action: PayloadAction<{ 
      boardId: string; 
      columnId: string; 
      taskIds: string[] 
    }>) => {
      const { boardId, columnId, taskIds } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (board) {
        const column = board.columns.find(c => c.id === columnId);
        if (column) {
          const reorderedTasks = taskIds.map((id, index) => {
            const task = column.tasks.find(t => t.id === id);
            if (task) {
              task.order = index;
              return task;
            }
            return null;
          }).filter(Boolean) as Task[];
          column.tasks = reorderedTasks;
        }
      }
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        const column = state.currentBoard.columns.find(c => c.id === columnId);
        if (column) {
          const reorderedTasks = taskIds.map((id, index) => {
            const task = column.tasks.find(t => t.id === id);
            if (task) {
              task.order = index;
              return task;
            }
            return null;
          }).filter(Boolean) as Task[];
          column.tasks = reorderedTasks;
        }
      }
    },

    // Автоматическое перемещение задачи при изменении статуса
    moveTaskByStatus: (state, action: PayloadAction<{ 
      boardId: string; 
      taskId: string; 
      newStatus: TaskStatus;
    }>) => {
      const { boardId, taskId, newStatus } = action.payload;
      const board = state.boards.find(b => b.id === boardId);
      if (!board) return;
      
      // Определяем тип колонки по новому статусу
      const columnType = getColumnByStatus(newStatus);
      const targetColumn = findColumnByType(board.columns, columnType);
      
      if (!targetColumn) return;
      
      // Ищем задачу во всех колонках
      let sourceColumn: Column | null = null;
      let task: Task | null = null;
      
      for (const col of board.columns) {
        const foundTask = col.tasks.find(t => t.id === taskId);
        if (foundTask) {
          sourceColumn = col;
          task = foundTask;
          break;
        }
      }
      
      if (!sourceColumn || !task) return;
      
      // Если задача уже в целевой колонке, просто обновляем статус
      if (sourceColumn.id === targetColumn.id) {
        task.status = newStatus;
        task.updatedAt = new Date();
      } else {
        // Удаляем задачу из исходной колонки
        sourceColumn.tasks = sourceColumn.tasks.filter(t => t.id !== taskId);
        
        // Обновляем задачу и добавляем в целевую колонку
        const updatedTask = { 
          ...task, 
          status: newStatus,
          columnId: targetColumn.id,
          updatedAt: new Date()
        };
        
        targetColumn.tasks.push(updatedTask);
        
        // Создаем уведомление о перемещении задачи
        notificationService.notifyTaskMoved(updatedTask, board, sourceColumn, targetColumn);
        
        // Если задача перемещена в колонку "Новые задачи" (planning), создаем специальное уведомление
        if (columnType === 'planning') {
          notificationService.notifyNewTaskInInbox(updatedTask, board, targetColumn);
        }
        
        // Если задача завершена, создаем уведомление о завершении
        if (newStatus === 'completed') {
          notificationService.notifyTaskCompleted(updatedTask, board, targetColumn);
        }
      }
      
      // Обновляем currentBoard если это текущая доска
      if (state.currentBoard?.id === boardId) {
        const currentSourceColumn = state.currentBoard.columns.find(c => c.id === sourceColumn!.id);
        const currentTargetColumn = state.currentBoard.columns.find(c => c.id === targetColumn.id);
        
        if (currentSourceColumn && currentTargetColumn) {
          if (sourceColumn!.id === targetColumn.id) {
            // Обновляем статус в текущей колонке
            const currentTask = currentSourceColumn.tasks.find(t => t.id === taskId);
            if (currentTask) {
              currentTask.status = newStatus;
              currentTask.updatedAt = new Date();
            }
          } else {
            // Перемещаем задачу между колонками
            currentSourceColumn.tasks = currentSourceColumn.tasks.filter(t => t.id !== taskId);
            const updatedTask = { 
              ...task!, 
              status: newStatus,
              columnId: targetColumn.id,
              updatedAt: new Date()
            };
            currentTargetColumn.tasks.push(updatedTask);
          }
        }
      }
    },
  },
});

// ===== ЭКСПОРТ ДЕЙСТВИЙ =====

export const {
  // Управление досками
  setCurrentBoard,
  addBoard,
  replaceAllBoards,
  toggleFavorite,
  deleteBoard,
  clearBoards,
  updateBoard,
  updateBoardTasks,
  
  // Управление колонками
  addColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
  
  // Управление задачами
  addTaskToColumn,
  updateTask,
  deleteTask,
  moveTask,
  reorderTasksInColumn,
  moveTaskByStatus,
} = boardSlice.actions;

export default boardSlice.reducer;

// ===== УТИЛИТЫ ДЛЯ ПЕРЕМЕЩЕНИЯ ЗАДАЧ =====

// Функция для определения колонки по статусу задачи
const getColumnByStatus = (status: TaskStatus): string => {
  switch (status) {
    case 'planning':
      return 'planning';
    case 'in_progress':
      return 'progress';
    case 'review':
      return 'review';
    case 'completed':
      return 'completed';
    default:
      return 'planning'; // По умолчанию в "Начало работы"
  }
};

// Функция для поиска колонки по типу
const findColumnByType = (columns: Column[], columnType: string): Column | null => {
  return columns.find(col => {
    const columnTitle = col.title.toLowerCase();
    switch (columnType) {
      case 'planning':
        return columnTitle.includes('начало') || columnTitle.includes('planning');
      case 'progress':
        return columnTitle.includes('работа') || columnTitle.includes('progress');
      case 'review':
        return columnTitle.includes('проверка') || columnTitle.includes('review');
      case 'completed':
        return columnTitle.includes('завершение') || columnTitle.includes('completed');
      default:
        return false;
    }
  }) || null;
};

