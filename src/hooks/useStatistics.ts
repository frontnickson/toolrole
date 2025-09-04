import { useState, useCallback } from 'react';
import { statisticsApi } from '../services/api/statistics';

/**
 * Хук для работы со статистикой через API
 */
export const useStatistics = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Получение общей статистики пользователя
  const loadUserStatistics = useCallback(async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await statisticsApi.getUserStatistics();
      
      if (response.success && response.data) {
        return { success: true, statistics: response.data };
      } else {
        setError(response.message || 'Ошибка загрузки статистики пользователя');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, []);

  // Получение статистики по доскам
  const loadBoardsStatistics = useCallback(async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await statisticsApi.getBoardsStatistics();
      
      if (response.success && response.data) {
        return { success: true, statistics: response.data };
      } else {
        setError(response.message || 'Ошибка загрузки статистики досок');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, []);

  // Получение статистики по задачам
  const loadTasksStatistics = useCallback(async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await statisticsApi.getTasksStatistics();
      
      if (response.success && response.data) {
        return { success: true, statistics: response.data };
      } else {
        setError(response.message || 'Ошибка загрузки статистики задач');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, []);

  // Получение статистики активности
  const loadActivityStatistics = useCallback(async (period?: 'day' | 'week' | 'month' | 'year') => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await statisticsApi.getActivityStatistics(period);
      
      if (response.success && response.data) {
        return { success: true, statistics: response.data };
      } else {
        setError(response.message || 'Ошибка загрузки статистики активности');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, []);

  // Получение статистики производительности
  const loadPerformanceStatistics = useCallback(async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await statisticsApi.getPerformanceStatistics();
      
      if (response.success && response.data) {
        return { success: true, statistics: response.data };
      } else {
        setError(response.message || 'Ошибка загрузки статистики производительности');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, []);

  // Получение статистики по времени
  const loadTimeStatistics = useCallback(async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await statisticsApi.getTimeStatistics();
      
      if (response.success && response.data) {
        return { success: true, statistics: response.data };
      } else {
        setError(response.message || 'Ошибка загрузки статистики по времени');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, []);

  // Получение статистики по командам
  const loadTeamStatistics = useCallback(async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await statisticsApi.getTeamStatistics();
      
      if (response.success && response.data) {
        return { success: true, statistics: response.data };
      } else {
        setError(response.message || 'Ошибка загрузки статистики команд');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, []);

  // Получение детальной статистики по доске
  const loadBoardDetailedStatistics = useCallback(async (boardId: string) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await statisticsApi.getBoardDetailedStatistics(boardId);
      
      if (response.success && response.data) {
        return { success: true, statistics: response.data };
      } else {
        setError(response.message || 'Ошибка загрузки детальной статистики доски');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
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
    loadUserStatistics,
    loadBoardsStatistics,
    loadTasksStatistics,
    loadActivityStatistics,
    loadPerformanceStatistics,
    loadTimeStatistics,
    loadTeamStatistics,
    loadBoardDetailedStatistics,
    clearError
  };
};
