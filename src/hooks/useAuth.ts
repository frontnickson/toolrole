import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ExtendedUser, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/user';
import { apiService } from '../services/api';
import { 
  clearCurrentUser, 
  setCurrentUser, 
  setTempUserData, 
  clearTempUserData,
  setLoading,
  setError,
  clearError
} from '../store/slices/userSlice';
import type { RootState } from '../store';
import { store } from '../store';

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
      console.log('🔐 useAuth: Пользователь аутентифицирован - устанавливаем токен в API сервис');
      // Устанавливаем токен в API сервис для авторизованных запросов
      // Токен должен быть сохранен в Redux store вместе с данными пользователя
      if (currentUser.accessToken) {
        apiService.setAuthToken(currentUser.accessToken);
      }
    } else {
      console.log('🔐 useAuth: Пользователь не аутентифицирован');
    }
    
    // Завершаем локальную загрузку
    setLocalLoading(false);
  }, [currentUser]);

  /**
   * Функция входа в систему
   * 
   * @param credentials - учетные данные для входа (email, password)
   * @returns объект с результатом операции { success: boolean, error?: string }
   */
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 useAuth: Попытка входа с учетными данными:', credentials.email);
    
    try {
      // Устанавливаем состояние загрузки
      dispatch(setLoading(true));
      dispatch(clearError());
      
      // Отправляем запрос на сервер для аутентификации
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success && response.data) {
        const { access_token } = response.data;
        console.log('🔐 useAuth: Токен получен, создаем объект пользователя');
        
        // Устанавливаем токен в API сервис для последующих запросов
        apiService.setAuthToken(access_token);
        
        // Создаем расширенный объект пользователя с данными из credentials
        // В реальном приложении здесь должен быть вызов API для получения полных данных пользователя
        const userData: ExtendedUser = {
          id: Date.now(), // Временный ID для демонстрации
          email: credentials.email,
          username: credentials.email.split('@')[0], // Извлекаем username из email
          accessToken: access_token, // Сохраняем токен в объекте пользователя
          
          // Личные данные
          firstName: credentials.email.split('@')[0], // Используем username как firstName
          lastName: '', // Пока пустое
          
          // Настройки по умолчанию
          theme: 'light',
          language: 'ru',
          
          // Статус
          isActive: true,
          isVerified: false,
          isSuperuser: false,
          isOnline: true,
          
          // Даты
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          
          // Социальные связи (пустые массивы)
          friends: [],
          friendRequests: [],
          teams: [],
          
          // Уведомления
          notifications: [],
          unreadNotificationsCount: 0,
          
          // Настройки уведомлений
          emailNotifications: true,
          pushNotifications: true,
          desktopNotifications: true,
          
          // Приватность
          profileVisibility: 'public',
          showOnlineStatus: true,
          allowFriendRequests: true,
        };
        
        console.log('🔐 useAuth: Объект пользователя создан:', userData);
        
        // Устанавливаем пользователя в Redux store
        // Redux-persist автоматически сохранит все данные пользователя включая токен
        console.log('🔐 useAuth: Сохраняем пользователя в Redux store (с автоматическим сохранением через redux-persist)');
        dispatch(setCurrentUser(userData));
        
        // Проверяем, что данные действительно попали в store
        setTimeout(() => {
          const storeState = store.getState();
          console.log('🔐 useAuth: Состояние Redux store после входа:', storeState.user);
        }, 100);
        
        return { success: true };
      }
      
      // Если сервер вернул ошибку
      console.log('🔐 useAuth: Ошибка входа:', response.message);
      dispatch(setError(response.message || 'Ошибка входа'));
      return { success: false, error: response.message || 'Ошибка входа' };
      
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
    console.log('🔐 useAuth: Попытка регистрации с учетными данными:', credentials.email);
    
    try {
      // Устанавливаем состояние загрузки
      dispatch(setLoading(true));
      dispatch(clearError());
      
      // Отправляем запрос на сервер для регистрации
      const response = await apiService.post<ExtendedUser>('/auth/register', credentials);
      
      if (response.success && response.data) {
        console.log('🔐 useAuth: Регистрация успешна, выполняем автоматический вход');
        
        // После успешной регистрации автоматически входим в систему
        const loginResult = await login({ 
          email: credentials.email, 
          password: credentials.password 
        });
        
        if (loginResult.success) {
          console.log('🎉 Регистрация завершена - пользователь автоматически вошел в систему');
        }
        
        return loginResult;
      }
      
      // Если сервер вернул ошибку
      console.log('🔐 useAuth: Ошибка регистрации:', response.message);
      dispatch(setError(response.message || 'Ошибка регистрации'));
      return { success: false, error: response.message || 'Ошибка регистрации' };
      
    } catch (error) {
      // Если произошла ошибка сети или другая ошибка
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сети';
      console.error('🔐 useAuth: Ошибка регистрации:', errorMessage);
      
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
      const exists = response.success && response.data ? response.data.exists : false;
      
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
      const exists = response.success && response.data ? response.data.exists : false;
      
      console.log('🔐 useAuth: Username существует:', exists);
      return exists;
      
    } catch (error) {
      console.error('🔐 useAuth: Ошибка при проверке username:', error);
      return false; // В случае ошибки считаем username свободным
    }
  };

  /**
   * Функция выхода из системы
   * Очищает данные пользователя из Redux store
   * Redux-persist автоматически очистит сохраненные данные
   */
  const logout = () => {
    console.log('🔐 useAuth: Выход пользователя из системы - начало');
    
    try {
      // Очищаем токен в API сервисе
      apiService.clearAuthToken();
      console.log('🔐 useAuth: Токен очищен в API сервисе');
      
      // Очищаем данные пользователя из Redux store
      // Redux-persist автоматически очистит сохраненные данные
      dispatch(clearCurrentUser());
      console.log('🔐 useAuth: Redux store очищен (redux-persist автоматически очистит сохраненные данные)');
      
      console.log('🚪 Пользователь успешно вышел из системы');
      
    } catch (error) {
      console.error('🔐 useAuth: Ошибка при выходе:', error);
    }
  };

  /**
   * Функция установки временных данных пользователя
   * Используется для форм регистрации/редактирования профиля
   * 
   * @param data - временные данные пользователя
   */
  const setTempData = (data: Partial<ExtendedUser>) => {
    console.log('🔐 useAuth: Установка временных данных:', data);
    dispatch(setTempUserData(data));
  };

  /**
   * Функция очистки временных данных пользователя
   */
  const clearTempData = () => {
    console.log('🔐 useAuth: Очистка временных данных');
    dispatch(clearTempUserData());
  };

  // Вычисляем статус аутентификации на основе наличия пользователя
  const isAuthenticated = !!currentUser;

  // Логируем текущее состояние для отладки
  console.log('🔐 useAuth: Текущее состояние - пользователь:', !!currentUser, 'загрузка:', isLoading || localLoading);

  // Возвращаем объект с функциями и данными
  return {
    // Данные пользователя
    user: currentUser,
    
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
  };
};
