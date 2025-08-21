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
        // Наш упрощенный backend возвращает данные напрямую
        return {
          success: true,
          data: data as T,
          message: 'Success'
        };
      } else {
        // Обрабатываем ошибки от backend
        const errorMessage = (data as { detail?: string; message?: string })?.detail || 
                           (data as { detail?: string; message?: string })?.message || 
                           `HTTP error! status: ${response.status}`;
        
        return {
          success: false,
          data: null,
          message: errorMessage
        };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Обрабатываем различные типы ошибок
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
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
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
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
