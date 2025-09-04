import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { columnsApi } from '../services/api/columns';
import { addColumn, updateColumn, deleteColumn } from '../store/slices/boardSlice';
import type { Column } from '../types/board';

/**
 * Хук для работы с колонками через API
 */
export const useColumns = () => {
  const dispatch = useDispatch();
  
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Создание новой колонки
  const createColumn = useCallback(async (boardId: string, columnData: Partial<Column>) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await columnsApi.createColumn(boardId, columnData);
      
      if (response.success && response.data) {
        // Обновляем доску в Redux store
        dispatch(addColumn({
          boardId: boardId,
          column: response.data
        }));
        return { success: true, column: response.data };
      } else {
        setError(response.message || 'Ошибка создания колонки');
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

  // Обновление колонки
  const updateColumnData = useCallback(async (boardId: string, columnId: string, updates: Partial<Column>) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await columnsApi.updateColumn(boardId, columnId, updates);
      
      if (response.success && response.data) {
        // Обновляем колонку в Redux store
        dispatch(updateColumn({
          boardId: boardId,
          columnId: columnId,
          updates: updates
        }));
        return { success: true, column: response.data };
      } else {
        setError(response.message || 'Ошибка обновления колонки');
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

  // Удаление колонки
  const removeColumn = useCallback(async (boardId: string, columnId: string) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await columnsApi.deleteColumn(boardId, columnId);
      
      if (response.success) {
        // Удаляем колонку из Redux store
        dispatch(deleteColumn({
          boardId: boardId,
          columnId: columnId
        }));
        return { success: true };
      } else {
        setError(response.message || 'Ошибка удаления колонки');
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

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Состояния
    isLoading: localLoading,
    error,
    
    // Действия
    createColumn,
    updateColumn: updateColumnData,
    deleteColumn: removeColumn,
    clearError
  };
};

