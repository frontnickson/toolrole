import { useCallback } from 'react';
import { useBoards } from './useBoards';
import { useTasks } from './useTasks';

/**
 * Хук для интеграции работы с досками и задачами
 * Обеспечивает правильное управление кэшем и синхронизацию данных
 */
export const useBoardTasks = () => {
  const boardsHook = useBoards();
  const tasksHook = useTasks();

  // Создание задачи с очисткой кэша
  const createTask = useCallback(async (taskData: any) => {
    const result = await tasksHook.createTask(taskData);
    
    if (result.success && result.task) {
      // Очищаем кэш задач для доски, чтобы при следующем обращении загрузились актуальные данные
      boardsHook.clearBoardTasksCache(result.task.boardId);
    }
    
    return result;
  }, [tasksHook, boardsHook]);

  // Обновление задачи с очисткой кэша
  const updateTask = useCallback(async (taskId: string, updates: any) => {
    const result = await tasksHook.updateTask(taskId, updates);
    
    if (result.success && result.task) {
      // Очищаем кэш задач для доски
      boardsHook.clearBoardTasksCache(result.task.boardId);
    }
    
    return result;
  }, [tasksHook, boardsHook]);

  // Удаление задачи с очисткой кэша
  const deleteTask = useCallback(async (taskId: string, boardId: string) => {
    const result = await tasksHook.deleteTask(taskId, boardId);
    
    if (result.success) {
      // Очищаем кэш задач для доски
      boardsHook.clearBoardTasksCache(boardId);
    }
    
    return result;
  }, [tasksHook, boardsHook]);

  // Перемещение задачи с очисткой кэша
  const moveTask = useCallback(async (taskId: string, fromColumnId: string, toColumnId: string, newStatus: any, newOrder?: number) => {
    const result = await tasksHook.moveTask(taskId, fromColumnId, toColumnId, newStatus, newOrder);
    
    if (result.success && result.task) {
      // Очищаем кэш задач для доски
      boardsHook.clearBoardTasksCache(result.task.boardId);
    }
    
    return result;
  }, [tasksHook, boardsHook]);

  return {
    // Данные из useBoards
    boards: boardsHook.boards,
    currentBoard: boardsHook.currentBoard,
    isLoading: boardsHook.isLoading,
    error: boardsHook.error,
    
    // Действия с досками
    loadUserBoards: boardsHook.loadUserBoards,
    createBoard: boardsHook.createBoard,
    updateBoard: boardsHook.updateBoard,
    deleteBoard: boardsHook.deleteBoard,
    toggleFavorite: boardsHook.toggleFavorite,
    loadBoard: boardsHook.loadBoard,
    loadBoardTasks: boardsHook.loadBoardTasks,
    loadBoardStatistics: boardsHook.loadBoardStatistics,
    clearError: boardsHook.clearError,
    setCurrentBoard: boardsHook.setCurrentBoard,
    
    // Действия с задачами (с очисткой кэша)
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    changeTaskStatus: tasksHook.changeTaskStatus,
    changeTaskPriority: tasksHook.changeTaskPriority,
    assignTask: tasksHook.assignTask,
    unassignTask: tasksHook.unassignTask,
    addComment: tasksHook.addComment,
    addAttachment: tasksHook.addAttachment,
    
    // Состояния задач
    isTaskLoading: tasksHook.isLoading,
    taskError: tasksHook.error,
    clearTaskError: tasksHook.clearError
  };
};
