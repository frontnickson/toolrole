import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { tasksApi } from '../services/api/tasks';
import { 
  addTaskToColumn, 
  updateTask, 
  deleteTask, 
  moveTask 
} from '../store/slices/boardSlice';
import type { Task, TaskStatus, TaskPriority } from '../types/board';

/**
 * Хук для работы с задачами через API
 */
export const useTasks = () => {
  const dispatch = useDispatch();
  
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Создание новой задачи
  const createTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await tasksApi.createTask(taskData);
      
      if (response.success && response.data) {
        // Добавляем задачу в Redux store
        dispatch(addTaskToColumn({
          boardId: response.data.boardId,
          columnId: response.data.columnId,
          task: response.data
        }));
        return { success: true, task: response.data };
      } else {
        setError(response.message || 'Ошибка создания задачи');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch]);

  // Обновление задачи
  const updateTaskData = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await tasksApi.updateTask(taskId, updates);
      
      if (response.success && response.data) {
        // Обновляем задачу в Redux store
        dispatch(updateTask({
          boardId: response.data.boardId,
          taskId,
          updates: response.data
        }));
        return { success: true, task: response.data };
      } else {
        setError(response.message || 'Ошибка обновления задачи');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch]);

  // Удаление задачи
  const removeTask = useCallback(async (taskId: string, boardId: string) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await tasksApi.deleteTask(taskId);
      
      if (response.success) {
        // Удаляем задачу из Redux store
        dispatch(deleteTask({ boardId, taskId }));
        return { success: true };
      } else {
        setError(response.message || 'Ошибка удаления задачи');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch]);

  // Перемещение задачи между колонками
  const moveTaskBetweenColumns = useCallback(async (
    taskId: string, 
    fromColumnId: string, 
    toColumnId: string, 
    newStatus: TaskStatus,
    newOrder?: number
  ) => {
    try {
      setError(null);
      
      const response = await tasksApi.moveTask(taskId, {
        fromColumnId,
        toColumnId,
        newStatus,
        newOrder
      });
      
      if (response.success && response.data) {
        // Обновляем задачу в Redux store
        dispatch(moveTask({
          boardId: response.data.boardId,
          taskId,
          fromColumnId,
          toColumnId,
          newStatus,
          newOrder
        }));
        return { success: true, task: response.data };
      } else {
        setError(response.message || 'Ошибка перемещения задачи');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Изменение статуса задачи
  const changeTaskStatus = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    try {
      setError(null);
      
      const response = await tasksApi.changeTaskStatus(taskId, newStatus);
      
      if (response.success && response.data) {
        // Обновляем задачу в Redux store
        dispatch(updateTask({
          boardId: response.data.boardId,
          taskId,
          updates: { status: newStatus }
        }));
        return { success: true, task: response.data };
      } else {
        setError(response.message || 'Ошибка изменения статуса');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Изменение приоритета задачи
  const changeTaskPriority = useCallback(async (taskId: string, newPriority: TaskPriority) => {
    try {
      setError(null);
      
      const response = await tasksApi.changeTaskPriority(taskId, newPriority);
      
      if (response.success && response.data) {
        // Обновляем задачу в Redux store
        dispatch(updateTask({
          boardId: response.data.boardId,
          taskId,
          updates: { priority: newPriority }
        }));
        return { success: true, task: response.data };
      } else {
        setError(response.message || 'Ошибка изменения приоритета');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Назначение исполнителя
  const assignTaskToUser = useCallback(async (taskId: string, assigneeId: string) => {
    try {
      setError(null);
      
      const response = await tasksApi.assignTask(taskId, assigneeId);
      
      if (response.success && response.data) {
        // Обновляем задачу в Redux store
        dispatch(updateTask({
          boardId: response.data.boardId,
          taskId,
          updates: { assigneeId }
        }));
        return { success: true, task: response.data };
      } else {
        setError(response.message || 'Ошибка назначения исполнителя');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Снятие назначения
  const unassignTask = useCallback(async (taskId: string) => {
    try {
      setError(null);
      
      const response = await tasksApi.unassignTask(taskId);
      
      if (response.success && response.data) {
        // Обновляем задачу в Redux store
        dispatch(updateTask({
          boardId: response.data.boardId,
          taskId,
          updates: { assigneeId: undefined }
        }));
        return { success: true, task: response.data };
      } else {
        setError(response.message || 'Ошибка снятия назначения');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Добавление комментария
  const addCommentToTask = useCallback(async (taskId: string, content: string) => {
    try {
      setError(null);
      
      const response = await tasksApi.addComment(taskId, { content });
      
      if (response.success && response.data) {
        return { success: true, comment: response.data };
      } else {
        setError(response.message || 'Ошибка добавления комментария');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Добавление вложения
  const addAttachmentToTask = useCallback(async (taskId: string, file: File) => {
    try {
      setError(null);
      
      const response = await tasksApi.addAttachment(taskId, file);
      
      if (response.success && response.data) {
        return { success: true, attachment: response.data };
      } else {
        setError(response.message || 'Ошибка добавления вложения');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Состояния
    isLoading: localLoading,
    error,
    
    // Действия
    createTask,
    updateTask: updateTaskData,
    deleteTask: removeTask,
    moveTask: moveTaskBetweenColumns,
    changeTaskStatus,
    changeTaskPriority,
    assignTask: assignTaskToUser,
    unassignTask,
    addComment: addCommentToTask,
    addAttachment: addAttachmentToTask,
    clearError
  };
};
