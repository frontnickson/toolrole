import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ExtendedUser, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/user';
import { apiService } from '../services/api';
import { 
  clearCurrentUser, 
  setCurrentUser, 
  updateUserProfile,
  setTempUserData, 
  clearTempUserData,
  setLoading,
  setError,
  clearError
} from '../store/slices/userSlice';
import { replaceAllBoards, setCurrentBoard } from '../store/slices/boardSlice';
import { boardsApi } from '../services/api/boards';
import type { RootState } from '../store';

/**
 * Хук для управления аутентификацией пользователя
 * 
 * Этот хук предоставляет функциональность для:
 * - Входа в систему
 * - Регистрации новых пользователей
 * - Выхода из системы
 * - Проверки существования email/username
 * - Управления состоянием аутентификации
 * 
 * Логика работы:
 * 1. При инициализации проверяет токен в Redux store
 * 2. Если токен есть и пользователь в Redux store - устанавливает токен в API сервис
 * 3. При входе/регистрации создает объект ExtendedUser и сохраняет в Redux store
 * 4. При выходе очищает токен и данные пользователя из Redux store (данные автоматически очищаются через redux-persist)
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  
  // Получаем данные пользователя из Redux store
  const { currentUser, isLoading, error } = useSelector((state: RootState) => state.user);
  
  // Локальное состояние загрузки для этого хука
  const [localLoading, setLocalLoading] = useState(true);

  /**
   * Эффект инициализации хука
   * Выполняется при монтировании компонента и изменении currentUser
   */
  
  useEffect(() => {
    // Проверяем наличие пользователя в Redux store
    // Redux-persist автоматически восстанавливает состояние при перезагрузке
    if (currentUser) {
      console.log('🔍 useAuth: currentUser найден:', currentUser.username);
      console.log('🔍 useAuth: accessToken:', currentUser.accessToken ? 'есть' : 'НЕТ');
      
      // Устанавливаем токен в API сервис для авторизованных запросов
      // Токен должен быть сохранен в Redux store вместе с данными пользователя
      if (currentUser.accessToken) {
        apiService.setAuthToken(currentUser.accessToken);
        console.log('🔍 useAuth: токен установлен в API service');
        
        // Загружаем доски если пользователь уже аутентифицирован
        loadUserBoardsAfterAuth();
      } else {
        console.log('🔍 useAuth: токен НЕ найден в currentUser');
      }
    } else {
      console.log('🔍 useAuth: currentUser НЕ найден');
    }
    
    // Завершаем локальную загрузку
    setLocalLoading(false);
  }, [currentUser]);

  /**
   * Функция загрузки досок пользователя после аутентификации
   */
  const loadUserBoardsAfterAuth = async () => {
    try {
      console.log('📋 useAuth: Загружаем доски после аутентификации...');
      const response = await boardsApi.getUserBoards();
      
      if (response.success && response.data) {
        // Загружаем доски без задач для оптимизации
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
        
        dispatch(replaceAllBoards(boardsWithoutTasks));
        console.log('📋 useAuth: Доски загружены после аутентификации:', boardsWithoutTasks.length);
        return true;
      } else {
        console.log('📋 useAuth: Ошибка загрузки досок после аутентификации:', response.message);
        return false;
      }
    } catch (error) {
      console.error('📋 useAuth: Исключение при загрузке досок после аутентификации:', error);
      return false;
    }
  };

  /**
   * Функция входа в систему
   * 
   * @param credentials - учетные данные для входа (email, password)
   * @returns объект с результатом операции { success: boolean, error?: string }
   */
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    
    try {
      // Устанавливаем состояние загрузки
      dispatch(setLoading(true));
      dispatch(clearError());
      
      // Очищаем доски перед входом (на случай если остались данные от предыдущего пользователя)
      dispatch(replaceAllBoards([]));
      dispatch(setCurrentBoard(null));
      
      // Очищаем данные досок из localStorage
      localStorage.removeItem('selectedBoardId');
      localStorage.removeItem('viewMode');
      localStorage.removeItem('activeNavItem');
      localStorage.removeItem('todoViewMode');
      localStorage.removeItem('todoActiveNavItem');
      
      // Отправляем запрос на сервер для аутентификации
      console.log('🔐 useAuth: Отправляем данные для входа:', credentials);
      const response = await apiService.post<AuthResponse>('/auth/login-email', credentials);
      
      if (response.success && response.data) {
        const { access_token } = response.data;
        
        // Устанавливаем токен в API сервис для последующих запросов
        apiService.setAuthToken(access_token);
        
        // Получаем полные данные пользователя с сервера
        const userResponse = await apiService.get<ExtendedUser>('/auth/me');
        
        if (userResponse.success && userResponse.data) {
          // Проверяем структуру данных - userResponse.data должен содержать объект пользователя
          if (userResponse.data.id) {
            const userData: ExtendedUser = {
              ...userResponse.data,
              accessToken: access_token, // Добавляем токен к данным пользователя
            };
            
            // Устанавливаем пользователя в Redux store
            dispatch(setCurrentUser(userData));
            
            // Загружаем доски пользователя после успешной аутентификации
            await loadUserBoardsAfterAuth();
            
            return { success: true };
          } else {
            console.error('🔐 useAuth: В данных пользователя нет ID, используем fallback');
          }
        } else {
          console.error('🔐 useAuth: Не удалось получить данные пользователя:', userResponse);
        }
        
        // Если не удалось получить данные пользователя, создаем базовый объект
        // Используем фиксированный ID для отладки
        const userData: ExtendedUser = {
          id: 1, // Фиксированный ID для отладки
          email: credentials.email,
          username: credentials.email.split('@')[0],
          accessToken: access_token,
          firstName: credentials.email.split('@')[0],
          lastName: '',
          theme: 'light',
          language: 'ru',
          isActive: true,
          isVerified: false,
          isSuperuser: false,
          isOnline: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          friends: [],
          friendRequests: [],
          teams: [],
          notifications: [],
          unreadNotificationsCount: 0,
          emailNotifications: true,
          pushNotifications: true,
          desktopNotifications: true,
          profileVisibility: 'public',
          showOnlineStatus: true,
          allowFriendRequests: true,
        };
        
        console.error('🔐 useAuth: Создан fallback пользователь:', userData);
        dispatch(setCurrentUser(userData));
        
        // Загружаем доски пользователя после успешной аутентификации
        await loadUserBoardsAfterAuth();
        
        return { success: true };
      }
      
      // Если сервер вернул ошибку
      console.error('🔐 useAuth: Ошибка входа:', response.message);
      
      // Обрабатываем различные типы ошибок входа
      let errorMessage = 'Ошибка входа';
      
      if (response.error) {
        // Если error - это строка, используем её напрямую
        if (typeof response.error === 'string') {
          errorMessage = response.error;
        } else {
          // Если error - это объект, обрабатываем его свойства
          const errorObj = response.error as any;
          if (errorObj.type === 'INVALID_CREDENTIALS') {
            errorMessage = 'Неверный email или пароль';
          } else if (errorObj.type === 'USER_NOT_FOUND') {
            errorMessage = 'Пользователь не найден';
          } else if (errorObj.type === 'ACCOUNT_DISABLED') {
            errorMessage = 'Аккаунт заблокирован';
          } else {
            errorMessage = errorObj.message || response.message || 'Ошибка входа';
          }
        }
      } else {
        errorMessage = response.message || 'Ошибка входа';
      }
      
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
      
    } catch (error) {
      // Если произошла ошибка сети или другая ошибка
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сети';
      console.error('🔐 useAuth: Ошибка входа:', errorMessage);
      
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
      
    } finally {
      // Снимаем состояние загрузки
      dispatch(setLoading(false));
    }
  };

  /**
   * Функция регистрации нового пользователя
   * 
   * @param credentials - данные для регистрации (email, username, password, full_name?)
   * @returns объект с результатом операции { success: boolean, error?: string }
   */
  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    
    try {
      console.log('🔐 useAuth: Начинаем регистрацию пользователя');
      console.log('🔐 useAuth: Данные для регистрации:', credentials);
      
      // Устанавливаем состояние загрузки
      dispatch(setLoading(true));
      dispatch(clearError());
      
      // Очищаем доски перед регистрацией
      dispatch(replaceAllBoards([]));
      dispatch(setCurrentBoard(null));
      
      // Очищаем данные досок из localStorage
      localStorage.removeItem('selectedBoardId');
      localStorage.removeItem('viewMode');
      localStorage.removeItem('activeNavItem');
      localStorage.removeItem('todoViewMode');
      localStorage.removeItem('todoActiveNavItem');
      
      // Отправляем запрос на сервер для регистрации
      console.log('🔐 useAuth: Вызываем apiService.post на /auth/register');
      const response = await apiService.post<ExtendedUser>('/auth/register', credentials);
      
      console.log('🔐 useAuth: Ответ от сервера:', response);
      
      if (response.success && response.data) {
        console.log('🔐 useAuth: Регистрация успешна, выполняем автоматический вход');
        
        // После успешной регистрации автоматически входим в систему
        const loginResult = await login({ 
          email: credentials.email, 
          password: credentials.password 
        });
        
        return loginResult;
      }
      
      // Если сервер вернул ошибку
      console.error('🔐 useAuth: Ошибка регистрации:', response.message);
      console.error('🔐 useAuth: Полная структура ошибки:', response.error);
      
      // Обрабатываем различные типы ошибок
      let errorMessage = 'Ошибка регистрации';
      
      if (response.error) {
        // Если error - это строка, используем её напрямую
        if (typeof response.error === 'string') {
          errorMessage = response.error;
        } else {
          // Если error - это объект, обрабатываем его свойства
          const errorObj = response.error as any;
          if (errorObj.type === 'USER_EXISTS') {
            errorMessage = errorObj.message || 'Пользователь уже существует';
          } else if (errorObj.type === 'VALIDATION_ERROR') {
            errorMessage = 'Ошибка валидации данных';
            if (errorObj.details && errorObj.details.length > 0) {
              errorMessage += ': ' + errorObj.details.map((d: any) => d.message).join(', ');
            }
          } else {
            errorMessage = errorObj.message || response.message || 'Ошибка регистрации';
          }
        }
      } else {
        errorMessage = response.message || 'Ошибка регистрации';
      }
      
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
      
    } catch (error) {
      // Если произошла ошибка сети или другая ошибка
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сети';
      console.error('🔐 useAuth: Ошибка регистрации:', errorMessage);
      console.error('🔐 useAuth: Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
      
    } finally {
      // Снимаем состояние загрузки
      dispatch(setLoading(false));
    }
  };

  /**
   * Функция проверки существования email в системе
   * 
   * @param email - email для проверки
   * @returns true если email уже существует, false если свободен
   */
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      console.log('🔐 useAuth: Проверка существования email:', email);
      
      const response = await apiService.post<{ exists: boolean }>('/auth/check-email', { email });
      const exists = response.success && response.data ? Boolean(response.data.exists) : false;
      
      console.log('🔐 useAuth: Email существует:', exists);
      return exists;
      
    } catch (error) {
      console.error('🔐 useAuth: Ошибка при проверке email:', error);
      return false; // В случае ошибки считаем email свободным
    }
  };

  /**
   * Функция проверки существования username в системе
   * 
   * @param username - username для проверки
   * @returns true если username уже существует, false если свободен
   */
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      console.log('🔐 useAuth: Проверка существования username:', username);
      
      const response = await apiService.post<{ exists: boolean }>('/auth/check-username', { username });
      const exists = response.success && response.data ? Boolean(response.data.exists) : false;
      
      console.log('🔐 useAuth: Username существует:', exists);
      return exists;
      
    } catch (error) {
      console.error('🔐 useAuth: Ошибка при проверке username:', error);
      return false; // В случае ошибки считаем username свободным
    }
  };

  /**
   * Функция выхода из системы
   * Очищает данные пользователя и доски из Redux store
   * Redux-persist автоматически очистит сохраненные данные
   */
  const logout = () => {
    try {
      // Очищаем токен в API сервисе
      apiService.clearAuthToken();
      
      // Очищаем данные пользователя из Redux store
      dispatch(clearCurrentUser());
      
      // Очищаем доски из Redux store
      dispatch(replaceAllBoards([]));
      dispatch(setCurrentBoard(null));
      
      // Очищаем данные досок из localStorage
      localStorage.removeItem('selectedBoardId');
      localStorage.removeItem('viewMode');
      localStorage.removeItem('activeNavItem');
      localStorage.removeItem('todoViewMode');
      localStorage.removeItem('todoActiveNavItem');
      
      console.log('🔐 useAuth: Пользователь вышел из системы, данные очищены');
      
    } catch (error) {
      console.error('🔐 useAuth: Ошибка при выходе из системы:', error);
    }
  };

  /**
   * Функция установки временных данных пользователя
   * Используется для форм регистрации/редактирования профиля
   * 
   * @param data - временные данные пользователя
   */
  const setTempData = (data: Partial<ExtendedUser>) => {
    dispatch(setTempUserData(data));
  };

  /**
   * Функция очистки временных данных пользователя
   */
  const clearTempData = () => {
    dispatch(clearTempUserData());
  };

  /**
   * Функция обновления профиля пользователя в Redux store
   * 
   * @param data - данные для обновления профиля
   */
  const updateUserProfileInStore = (data: Partial<ExtendedUser>) => {
    dispatch(updateUserProfile(data));
  };

  // Вычисляем статус аутентификации на основе наличия пользователя
  const isAuthenticated = !!currentUser;

  // Логируем текущее состояние для отладки
  console.log('🔐 useAuth: Текущее состояние - пользователь:', !!currentUser, 'загрузка:', isLoading || localLoading);

  // Возвращаем объект с функциями и данными
  return {
    // Данные пользователя
    user: currentUser,
    currentUser,
    
    // Состояния
    isLoading: isLoading || localLoading,
    isAuthenticated,
    error,
    
    // Основные функции аутентификации
    login,
    register,
    logout,
    
    // Функции проверки
    checkEmailExists,
    checkUsernameExists,
    
    // Функции для работы с временными данными
    setTempData,
    clearTempData,
    
    // Функции для работы с профилем
    updateUserProfile: updateUserProfileInStore,
  };
};
