import type { ApiResponse } from '../../types';
import { API_BASE_URL, API_TIMEOUT } from '../../constants';

/**
 * Основной класс для работы с API
 * Предоставляет методы для HTTP запросов с автоматической авторизацией
 */
class ApiService {
  private baseURL: string;
  private timeout: number;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
    console.log('🌐 API Service: Инициализация с baseURL:', this.baseURL);
  }

  /**
   * Базовый метод для выполнения HTTP запросов
   * 
   * @param endpoint - конечная точка API
   * @param options - опции запроса
   * @returns Promise с ответом API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Добавляем токен авторизации, если он есть
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
      console.log('🔍 API Service: токен установлен:', this.authToken.substring(0, 20) + '...');
    } else {
      console.log('🔍 API Service: токен НЕ установлен');
    }

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);

      // Проверяем, что ответ содержит JSON
      let data: unknown;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Если ответ не JSON, создаем базовую структуру
        data = { message: response.statusText || 'Non-JSON response' };
      }

      // Обрабатываем ответ от backend
      if (response.ok) {
        // Проверяем, есть ли в ответе поле success
        const responseData = data as any;
        if (responseData && typeof responseData === 'object') {
          // Если backend возвращает структуру { success, data, message }
          if ('success' in responseData) {
            return {
              success: responseData.success,
              data: responseData.data as T,
              message: responseData.message || 'Success'
            };
          }
          // Если backend возвращает данные напрямую
          return {
            success: true,
            data: responseData as T,
            message: 'Success'
          };
        }
        
        return {
          success: true,
          data: data as T,
          message: 'Success'
        };
      } else {
        // Обрабатываем ошибки от backend
        const responseData = data as any;
        const errorMessage = responseData?.detail || 
                           responseData?.message || 
                           `HTTP error! status: ${response.status}`;
        
        console.error('🌐 API Service: Сообщение об ошибке:', errorMessage);
        console.error('🌐 API Service: Полная структура ошибки:', responseData);
        
        return {
          success: false,
          data: null,
          message: errorMessage,
          error: responseData?.error || responseData // Передаем полную структуру ошибки
        };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      console.error('🌐 API Service: Ошибка в запросе:', error);
      
      // Обрабатываем различные типы ошибок
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('🌐 API Service: Таймаут запроса');
          throw new Error('Request timeout');
        }
        console.log('🌐 API Service: Ошибка Error:', error.message);
        throw error;
      }
      
      console.log('🌐 API Service: Неизвестная ошибка');
      throw new Error('Unknown error occurred');
    }
  }

  /**
   * Выполняет GET запрос
   * 
   * @param endpoint - конечная точка API
   * @returns Promise с ответом API
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * Выполняет POST запрос
   * 
   * @param endpoint - конечная точка API
   * @param data - данные для отправки
   * @returns Promise с ответом API
   */
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    console.log('🌐 API Service: POST запрос на', endpoint);
    console.log('🌐 API Service: Данные:', data);
    console.log('🌐 API Service: Полный URL:', `${this.baseURL}${endpoint}`);
    
    // Определяем, нужно ли отправвать как FormData или JSON
    const isFormData = data instanceof FormData;
    
    const headers: Record<string, string> = {};

    // Если это FormData, не устанавливаем Content-Type (браузер сам установит)
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    console.log('🌐 API Service: Заголовки:', headers);
    console.log('🌐 API Service: Метод: POST');

    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
      headers,
    });
  }

  /**
   * Выполняет PUT запрос
   * 
   * @param endpoint - конечная точка API
   * @param data - данные для отправки
   * @returns Promise с ответом API
   */
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Выполняет DELETE запрос
   * 
   * @param endpoint - конечная точка API
   * @returns Promise с ответом API
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log('🌐 API Service: DELETE запрос на', endpoint);
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Выполняет PATCH запрос
   * 
   * @param endpoint - конечная точка API
   * @param data - данные для отправки
   * @returns Promise с ответом API
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Устанавливает токен авторизации для последующих запросов
   * 
   * @param token - JWT токен авторизации
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Удаляет токен авторизации
   */
  clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * Получает текущий токен авторизации
   * 
   * @returns текущий токен или null
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Проверяет, есть ли активный токен авторизации
   * 
   * @returns true если токен установлен
   */
  isAuthenticated(): boolean {
    return this.authToken !== null;
  }
}

// Создаем единственный экземпляр сервиса
export const apiService = new ApiService();
export default apiService;
