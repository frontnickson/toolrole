import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { boardsApi } from '../services/api/boards';
import { tasksApi } from '../services/api/tasks';
import { 
  setCurrentBoard, 
  addBoard, 
  replaceAllBoards,
  updateBoard, 
  updateBoardTasks,
  deleteBoard, 
  toggleFavorite 
} from '../store/slices/boardSlice';
import type { Board } from '../types/board';
import type { RootState } from '../store';

/**
 * Хук для работы с досками через API
 */
export const useBoards = () => {
  const dispatch = useDispatch();
  const { boards, currentBoard, isLoading } = useSelector((state: RootState) => state.boards);
  
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedBoardsCache, setLoadedBoardsCache] = useState<Set<string>>(new Set());

  // Загрузка всех досок пользователя (без задач для оптимизации)
  const loadUserBoards = useCallback(async () => {
    try {
      console.log('📋 useBoards: Начинаем загрузку досок пользователя...');
      setLocalLoading(true);
      setError(null);
      
      const response = await boardsApi.getUserBoards();
      console.log('📋 useBoards: Ответ от API:', response);
      
      if (response.success && response.data) {
        // Загружаем только доски без задач для оптимизации
        // Задачи будут загружаться по требованию при выборе доски
        const boardsWithoutTasks = response.data.map(board => {
          // Проверяем, есть ли колонка просроченных задач
          const hasOverdueColumn = board.columns.some(col => 
            col.title.toLowerCase().includes('просрочено') || 
            col.title.toLowerCase().includes('overdue')
          );
          
          // Если нет колонки просроченных задач, добавляем её
          let columns = board.columns.map(column => ({
            ...column,
            tasks: [] // Инициализируем пустым массивом
          }));
          
          if (!hasOverdueColumn) {
            const overdueColumn = {
              id: `col-${board.id}-overdue`,
              boardId: board.id,
              title: 'Просрочено',
              description: 'Просроченные задачи',
              icon: '⚠️',
              color: '#DC2626',
              order: columns.length,
              isLocked: false,
              isCollapsed: false,
              isStandard: true,
              tasks: [],
              settings: {
                allowTaskCreation: false,
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
            };
            columns.push(overdueColumn);
          }
          
          return {
            ...board,
            columns
          };
        });
        
        // Обновляем Redux store с данными с сервера
        dispatch(replaceAllBoards(boardsWithoutTasks));
        console.log('📋 useBoards: Доски загружены с сервера (без задач):', boardsWithoutTasks.length);
      } else {
        console.log('📋 useBoards: Ошибка загрузки досок:', response.message);
        setError(response.message || 'Ошибка загрузки досок');
        // Очищаем доски при ошибке
        dispatch(replaceAllBoards([]));
      }
    } catch (err) {
      console.log('📋 useBoards: Исключение при загрузке досок:', err);
      setError(err instanceof Error ? err.message : 'Ошибка сети');
      // Очищаем доски при ошибке
      dispatch(replaceAllBoards([]));
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch]);

  // Создание новой доски
  const createBoard = useCallback(async (boardData: Partial<Board>) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await boardsApi.createBoard(boardData);
      
      if (response.success && response.data) {
        dispatch(addBoard(response.data));
        console.log('📋 useBoards: Доска создана:', response.data.title);
        return { success: true, board: response.data };
      } else {
        console.log('📋 useBoards: Ошибка создания доски:', response.message);
        setError(response.message || 'Ошибка создания доски');
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.log('📋 useBoards: Исключение при создании доски:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch]);

  // Обновление доски
  const updateBoardData = useCallback(async (boardId: string, updates: Partial<Board>) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await boardsApi.updateBoard(boardId, updates);
      
      if (response.success && response.data) {
        dispatch(updateBoard({ boardId, updates: response.data }));
        return { success: true, board: response.data };
      } else {
        setError(response.message || 'Ошибка обновления доски');
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

  // Удаление доски
  const removeBoard = useCallback(async (boardId: string) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      const response = await boardsApi.deleteBoard(boardId);
      
      if (response.success) {
        dispatch(deleteBoard(boardId));
        return { success: true };
      } else {
        setError(response.message || 'Ошибка удаления доски');
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

  // Переключение статуса избранного
  const toggleBoardFavorite = useCallback(async (boardId: string) => {
    try {
      setError(null);
      
      const response = await boardsApi.toggleFavorite(boardId);
      
      if (response.success && response.data) {
        dispatch(toggleFavorite(boardId));
        return { success: true, board: response.data };
      } else {
        setError(response.message || 'Ошибка обновления статуса');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Загрузка доски по ID с задачами
  const loadBoard = useCallback(async (boardId: string) => {
    try {
      setLocalLoading(true);
      setError(null);
      
      console.log('📋 useBoards: Загружаем доску с ID:', boardId);
      
      const response = await boardsApi.getBoard(boardId);
      
      if (response.success && response.data) {
        // Загружаем задачи для доски
        const tasksResponse = await tasksApi.getBoardTasks(boardId);
        if (tasksResponse.success && tasksResponse.data) {
          // Добавляем задачи в колонки
          const boardWithTasks = {
            ...response.data,
            columns: response.data.columns.map(column => ({
              ...column,
              tasks: tasksResponse.data.filter((task: any) => task.columnId === column.id)
            }))
          };
          dispatch(setCurrentBoard(boardWithTasks));
          console.log('📋 useBoards: Доска с задачами загружена:', boardWithTasks.title, 'Задач:', tasksResponse.data.length);
        } else {
          dispatch(setCurrentBoard(response.data));
          console.log('📋 useBoards: Доска загружена без задач:', response.data.title);
        }
        return { success: true, board: response.data };
      } else {
        setError(response.message || 'Ошибка загрузки доски');
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

  // Загрузка задач для конкретной доски (оптимизированная версия с кэшированием)
  const loadBoardTasks = useCallback(async (boardId: string, forceReload = false) => {
    try {
      setError(null);
      
      // Проверяем кэш, если не принудительная перезагрузка
      if (!forceReload && loadedBoardsCache.has(boardId)) {
        console.log('📋 useBoards: Задачи для доски уже загружены (из кэша):', boardId);
        return { success: true, fromCache: true };
      }
      
      console.log('📋 useBoards: Загружаем задачи для доски:', boardId);
      
      const tasksResponse = await tasksApi.getBoardTasks(boardId);
      if (tasksResponse.success && tasksResponse.data) {
        // Используем новую функцию для обновления задач
        dispatch(updateBoardTasks({ boardId, tasks: tasksResponse.data }));
        
        // Добавляем в кэш
        setLoadedBoardsCache(prev => new Set(prev).add(boardId));
        
        console.log('📋 useBoards: Задачи обновлены для доски:', boardId, 'Задач:', tasksResponse.data.length);
        return { success: true, tasks: tasksResponse.data };
      } else {
        setError(tasksResponse.message || 'Ошибка загрузки задач');
        return { success: false, error: tasksResponse.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сети';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [dispatch, loadedBoardsCache]);

  // Загрузка статистики доски
  const loadBoardStatistics = useCallback(async (boardId: string) => {
    try {
      setError(null);
      
      const response = await boardsApi.getBoardStatistics(boardId);
      
      if (response.success && response.data) {
        return { success: true, statistics: response.data };
      } else {
        setError(response.message || 'Ошибка загрузки статистики');
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

  // Очистка кэша задач для доски (вызывается при изменении задач)
  const clearBoardTasksCache = useCallback((boardId: string) => {
    setLoadedBoardsCache(prev => {
      const newCache = new Set(prev);
      newCache.delete(boardId);
      console.log('📋 useBoards: Кэш задач очищен для доски:', boardId);
      return newCache;
    });
  }, []);

  // Загружаем доски при инициализации
  useEffect(() => {
    loadUserBoards();
  }, [loadUserBoards]);

  return {
    // Данные
    boards,
    currentBoard,
    
    // Состояния
    isLoading: isLoading || localLoading,
    error,
    
    // Действия
    loadUserBoards,
    createBoard,
    updateBoard: updateBoardData,
    deleteBoard: removeBoard,
    toggleFavorite: toggleBoardFavorite,
    loadBoard,
    loadBoardTasks,
    loadBoardStatistics,
    clearError,
    clearBoardTasksCache,
    
    // Утилиты
    setCurrentBoard: (board: Board | null) => dispatch(setCurrentBoard(board))
  };
};
