import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export interface TodoRouteParams {
  mode?: 'list' | 'board' | 'calendar';
  section?: 'inbox' | 'today' | 'home';
  boardId?: string;
  taskId?: string;
}

export const useTodoRouting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const params = useParams();

  // Парсим текущий URL для получения параметров
  const parseCurrentRoute = useCallback((): TodoRouteParams => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const params: TodoRouteParams = {};

    // Ищем todo в пути
    const todoIndex = pathParts.findIndex(part => part === 'todo');
    if (todoIndex === -1) return params;

    const todoParts = pathParts.slice(todoIndex + 1);

    // Определяем режим
    if (todoParts[0] === 'list' || todoParts[0] === 'board' || todoParts[0] === 'calendar') {
      params.mode = todoParts[0] as 'list' | 'board' | 'calendar';
    }

    // Определяем раздел
    if (todoParts[0] === 'inbox' || todoParts[0] === 'today' || todoParts[0] === 'home') {
      params.section = todoParts[0] as 'inbox' | 'today' | 'home';
    }

    // Определяем boardId
    if (params.mode && todoParts[1] && todoParts[1] !== 'task') {
      params.boardId = todoParts[1];
    } else if (params.section && todoParts[1] && todoParts[1] !== 'task') {
      params.boardId = todoParts[1];
    }

    // Определяем taskId
    const taskIndex = todoParts.findIndex(part => part === 'task');
    if (taskIndex !== -1 && todoParts[taskIndex + 1]) {
      params.taskId = todoParts[taskIndex + 1];
    }

    return params;
  }, [location.pathname]);

  // Навигация к определенному режиму
  const navigateToMode = useCallback((mode: 'list' | 'board' | 'calendar', boardId?: string) => {
    let path = `/todo/${mode}`;
    if (boardId) {
      path += `/${boardId}`;
    }
    navigate(path);
  }, [navigate]);

  // Навигация к разделу
  const navigateToSection = useCallback((section: 'inbox' | 'today' | 'home') => {
    navigate(`/todo/${section}`);
  }, [navigate]);

  // Навигация к задаче
  const navigateToTask = useCallback((taskId: string, boardId?: string, mode: 'list' | 'board' | 'calendar' = 'board') => {
    let path = `/todo/${mode}`;
    if (boardId) {
      path += `/${boardId}`;
    }
    path += `/task/${taskId}`;
    navigate(path);
  }, [navigate]);

  // Навигация к доске
  const navigateToBoard = useCallback((boardId: string, mode: 'list' | 'board' | 'calendar' = 'board') => {
    navigate(`/todo/${mode}/${boardId}`);
  }, [navigate]);

  // Закрытие задачи (убираем taskId из URL)
  const closeTask = useCallback(() => {
    const currentParams = parseCurrentRoute();
    if (currentParams.taskId) {
      let path = '/todo';
      
      if (currentParams.section) {
        path += `/${currentParams.section}`;
      } else if (currentParams.mode) {
        path += `/${currentParams.mode}`;
        if (currentParams.boardId) {
          path += `/${currentParams.boardId}`;
        }
      }
      
      navigate(path);
    }
  }, [navigate, parseCurrentRoute]);

  // Обновление URL при изменении состояния
  const updateUrl = useCallback((params: Partial<TodoRouteParams>) => {
    const currentParams = parseCurrentRoute();
    const newParams = { ...currentParams, ...params };

    let path = '/todo';

    if (newParams.section) {
      path += `/${newParams.section}`;
    } else if (newParams.mode) {
      path += `/${newParams.mode}`;
      if (newParams.boardId) {
        path += `/${newParams.boardId}`;
      }
    }

    if (newParams.taskId) {
      path += `/task/${newParams.taskId}`;
    }

    navigate(path);
  }, [navigate, parseCurrentRoute]);

  return {
    parseCurrentRoute,
    navigateToMode,
    navigateToSection,
    navigateToTask,
    navigateToBoard,
    closeTask,
    updateUrl,
    currentParams: parseCurrentRoute()
  };
};
