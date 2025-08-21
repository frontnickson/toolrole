import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { Board, Task, Column, BoardMember, TaskFilter, TaskView, BoardStatistics } from '../../types/board';

// ===== БАЗОВЫЕ СЕЛЕКТОРЫ =====

export const selectBoardState = (state: RootState) => state.boards;

export const selectBoards = (state: RootState) => state.boards.boards;
export const selectCurrentBoard = (state: RootState) => state.boards.currentBoard;
export const selectArchivedBoards = (state: RootState) => state.boards.archivedBoards;
export const selectSharedBoards = (state: RootState) => state.boards.sharedBoards;
export const selectTemplates = (state: RootState) => state.boards.templates;
export const selectBoardError = (state: RootState) => state.boards.error;
export const selectBoardLoading = (state: RootState) => state.boards.isLoading;

// ===== СЕЛЕКТОРЫ ДОСОК =====

// Получить доску по ID
export const selectBoardById = createSelector(
  [selectBoards, (_state: RootState, boardId: string) => boardId],
  (boards, boardId) => boards.find(board => board.id === boardId)
);

// Получить доску из кэша по ID
export const selectBoardFromCache = createSelector(
  [selectBoardState, (_state: RootState, boardId: string) => boardId],
  (boardState, boardId) => boardState.boardCache[boardId]
);

// Получить все доски пользователя (активные + общие)
export const selectAllUserBoards = createSelector(
  [selectBoards, selectSharedBoards],
  (boards, sharedBoards) => [...boards, ...sharedBoards]
);

// Получить количество досок
export const selectBoardsCount = createSelector(
  [selectBoards],
  (boards) => boards.length
);

// Получить доски по владельцу
export const selectBoardsByOwner = createSelector(
  [selectBoards, (_state: RootState, ownerId: string) => ownerId],
  (boards, ownerId) => boards.filter(board => board.ownerId === ownerId)
);

// Получить доски по команде
export const selectBoardsByTeam = createSelector(
  [selectBoards, (_state: RootState, teamId: string) => teamId],
  (boards, teamId) => boards.filter(board => board.teamId === teamId)
);

// ===== СЕЛЕКТОРЫ КОЛОНОК =====

// Получить колонки текущей доски
export const selectCurrentBoardColumns = createSelector(
  [selectCurrentBoard],
  (currentBoard) => currentBoard?.columns || []
);

// Получить колонку по ID
export const selectColumnById = createSelector(
  [selectCurrentBoard, (_state: RootState, columnId: string) => columnId],
  (currentBoard, columnId) => currentBoard?.columns.find(col => col.id === columnId)
);

// Получить колонку из кэша по ID
export const selectColumnFromCache = createSelector(
  [selectBoardState, (_state: RootState, columnId: string) => columnId],
  (boardState, columnId) => boardState.columnCache[columnId]
);

// Получить колонки с задачами
export const selectColumnsWithTasks = createSelector(
  [selectCurrentBoardColumns],
  (columns) => columns.filter(col => col.tasks.length > 0)
);

// Получить колонки без задач
export const selectEmptyColumns = createSelector(
  [selectCurrentBoardColumns],
  (columns) => columns.filter(col => col.tasks.length === 0)
);

// ===== СЕЛЕКТОРЫ ЗАДАЧ =====

// Получить все задачи текущей доски
export const selectAllTasks = createSelector(
  [selectCurrentBoardColumns],
  (columns) => columns.flatMap(col => col.tasks)
);

// Получить задачу по ID
export const selectTaskById = createSelector(
  [selectAllTasks, (_state: RootState, taskId: string) => taskId],
  (tasks, taskId) => tasks.find(task => task.id === taskId)
);

// Получить задачу из кэша по ID
export const selectTaskFromCache = createSelector(
  [selectBoardState, (_state: RootState, taskId: string) => taskId],
  (boardState, taskId) => boardState.taskCache[taskId]
);

// Получить задачи по статусу
export const selectTasksByStatus = createSelector(
  [selectAllTasks, (_state: RootState, status: string) => status],
  (tasks, status) => tasks.filter(task => task.status === status)
);

// Получить задачи по приоритету
export const selectTasksByPriority = createSelector(
  [selectAllTasks, (_state: RootState, priority: string) => priority],
  (tasks, priority) => tasks.filter(task => task.priority === priority)
);

// Получить задачи по назначенному пользователю
export const selectTasksByAssignee = createSelector(
  [selectAllTasks, (_state: RootState, assigneeId: string) => assigneeId],
  (tasks, assigneeId) => tasks.filter(task => task.assigneeId === assigneeId)
);

// Получить задачи по создателю
export const selectTasksByCreator = createSelector(
  [selectAllTasks, (_state: RootState, creatorId: string) => creatorId],
  (tasks, creatorId) => tasks.filter(task => task.createdBy === creatorId)
);

// Получить просроченные задачи
export const selectOverdueTasks = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
  )
);

// Получить задачи с сегодняшним дедлайном
export const selectTodayTasks = createSelector(
  [selectAllTasks],
  (tasks) => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) >= todayStart && 
      new Date(task.dueDate) < todayEnd
    );
  }
);

// Получить задачи на этой неделе
export const selectThisWeekTasks = createSelector(
  [selectAllTasks],
  (tasks) => {
    const now = new Date();
    const weekStart = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) >= weekStart && 
      new Date(task.dueDate) < weekEnd
    );
  }
);

// ===== СЕЛЕКТОРЫ УЧАСТНИКОВ =====

// Получить участников текущей доски
export const selectCurrentBoardMembers = createSelector(
  [selectCurrentBoard],
  (currentBoard) => currentBoard?.members || []
);

// Получить участника по ID
export const selectMemberById = createSelector(
  [selectCurrentBoardMembers, (_state: RootState, memberId: string) => memberId],
  (members, memberId) => members.find(member => member.id === memberId)
);

// Получить участников по роли
export const selectMembersByRole = createSelector(
  [selectCurrentBoardMembers, (_state: RootState, role: string) => role],
  (members, role) => members.filter(member => member.role === role)
);

// Получить владельца доски
export const selectBoardOwner = createSelector(
  [selectCurrentBoardMembers],
  (members) => members.find(member => member.role === 'owner')
);

// Получить администраторов доски
export const selectBoardAdmins = createSelector(
  [selectCurrentBoardMembers],
  (members) => members.filter(member => member.role === 'admin')
);

// ===== СЕЛЕКТОРЫ ФИЛЬТРОВ И ПРЕДСТАВЛЕНИЙ =====

export const selectActiveFilters = (state: RootState) => state.boards.activeFilters;
export const selectActiveView = (state: RootState) => state.boards.activeView;
export const selectSavedFilters = (state: RootState) => state.boards.savedFilters;
export const selectSavedViews = (state: RootState) => state.boards.savedViews;

// Получить сохраненный фильтр по ID
export const selectSavedFilterById = createSelector(
  [selectSavedFilters, (_state: RootState, filterId: string) => filterId],
  (filters, filterId) => filters.find(filter => filter.id === filterId)
);

// Получить сохраненное представление по ID
export const selectSavedViewById = createSelector(
  [selectSavedViews, (_state: RootState, viewId: string) => viewId],
  (views, viewId) => views.find(view => view.id === viewId)
);

// ===== СЕЛЕКТОРЫ СТАТИСТИКИ =====

export const selectGlobalStatistics = (state: RootState) => state.boards.globalStatistics;

// Получить статистику текущей доски
export const selectCurrentBoardStatistics = createSelector(
  [selectCurrentBoard],
  (currentBoard) => currentBoard?.statistics
);

// Получить статистику по колонкам
export const selectColumnsStatistics = createSelector(
  [selectCurrentBoardColumns],
  (columns) => columns.map(col => ({
    columnId: col.id,
    columnTitle: col.title,
    totalTasks: col.tasks.length,
    completedTasks: col.tasks.filter(task => task.status === 'completed').length,
    inProgressTasks: col.tasks.filter(task => 
      ['in_progress', 'review', 'testing'].includes(task.status)
    ).length,
    overdueTasks: col.tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
    ).length
  }))
);

// Получить прогресс выполнения задач
export const selectTaskCompletionProgress = createSelector(
  [selectAllTasks],
  (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => 
      ['in_progress', 'review', 'testing'].includes(task.status)
    ).length;
    const planning = tasks.filter(task => task.status === 'planning').length;
    
    return {
      total,
      completed,
      inProgress,
      planning,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      inProgressRate: total > 0 ? (inProgress / total) * 100 : 0,
      planningRate: total > 0 ? (planning / total) * 100 : 0
    };
  }
);

// ===== СЕЛЕКТОРЫ ДЛЯ ОПТИМИЗАЦИИ =====

// Получить задачи с комментариями (для отображения количества)
export const selectTasksWithCommentCounts = createSelector(
  [selectAllTasks],
  (tasks) => tasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId,
    dueDate: task.dueDate,
    commentCount: task.statistics.totalComments,
    attachmentCount: task.statistics.totalAttachments,
    subtaskCount: task.statistics.totalSubtasks,
    completedSubtasks: task.statistics.completedSubtasks,
    lastActivity: task.statistics.lastActivityAt
  }))
);

// Получить колонки с количеством задач (для отображения)
export const selectColumnsWithTaskCounts = createSelector(
  [selectCurrentBoardColumns],
  (columns) => columns.map(col => ({
    id: col.id,
    title: col.title,
    description: col.description,
    icon: col.icon,
    color: col.color,
    order: col.order,
    taskCount: col.tasks.length,
    isCollapsed: col.isCollapsed,
    taskLimit: col.taskLimit,
    wipLimit: col.wipLimit
  }))
);

// Получить участников с основной информацией (для отображения)
export const selectMembersWithBasicInfo = createSelector(
  [selectCurrentBoardMembers],
  (members) => members.map(member => ({
    id: member.id,
    userId: member.userId,
    role: member.role,
    joinedAt: member.joinedAt,
    isActive: member.isActive,
    lastSeen: member.lastSeen
  }))
);

// ===== СЕЛЕКТОРЫ ДЛЯ ПОИСКА =====

// Поиск задач по тексту
export const selectTasksBySearchText = createSelector(
  [selectAllTasks, (_state: RootState, searchText: string) => searchText],
  (tasks, searchText) => {
    if (!searchText.trim()) return tasks;
    
    const lowerSearchText = searchText.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerSearchText) ||
      (task.description && task.description.toLowerCase().includes(lowerSearchText)) ||
      task.tags.some(tag => tag.name.toLowerCase().includes(lowerSearchText)) ||
      task.labels.some(label => label.name.toLowerCase().includes(lowerSearchText))
    );
  }
);

// Поиск досок по тексту
export const selectBoardsBySearchText = createSelector(
  [selectBoards, (_state: RootState, searchText: string) => searchText],
  (boards, searchText) => {
    if (!searchText.trim()) return boards;
    
    const lowerSearchText = searchText.toLowerCase();
    return boards.filter(board => 
      board.title.toLowerCase().includes(lowerSearchText) ||
      (board.description && board.description.toLowerCase().includes(lowerSearchText))
    );
  }
);

// ===== СЕЛЕКТОРЫ ДЛЯ УВЕДОМЛЕНИЙ =====

// Получить задачи, требующие внимания
export const selectTasksRequiringAttention = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter(task => 
    task.priority === 'urgent' || 
    task.priority === 'critical' ||
    (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed')
  )
);

// Получить задачи с новыми комментариями (для пользователя)
export const selectTasksWithNewComments = createSelector(
  [selectAllTasks, (_state: RootState, userId: string) => userId],
  (tasks, userId) => tasks.filter(task => 
    task.comments.some(comment => 
      comment.authorId !== userId && 
      comment.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000) // последние 24 часа
    )
  )
);

// ===== СЕЛЕКТОРЫ ДЛЯ ЭКСПОРТА =====

// Получить данные доски для экспорта
export const selectBoardForExport = createSelector(
  [selectCurrentBoard],
  (currentBoard) => {
    if (!currentBoard) return null;
    
    return {
      id: currentBoard.id,
      title: currentBoard.title,
      description: currentBoard.description,
      createdAt: currentBoard.createdAt,
      updatedAt: currentBoard.updatedAt,
      columns: currentBoard.columns.map(col => ({
        id: col.id,
        title: col.title,
        description: col.description,
        order: col.order,
        tasks: col.tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigneeId: task.assigneeId,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          commentCount: task.statistics.totalComments,
          attachmentCount: task.statistics.totalAttachments,
          subtaskCount: task.statistics.totalSubtasks
        }))
      })),
      members: currentBoard.members.map(member => ({
        id: member.id,
        userId: member.userId,
        role: member.role,
        joinedAt: member.joinedAt
      }))
    };
  }
);
