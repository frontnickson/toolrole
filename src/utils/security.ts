/**
 * Утилиты безопасности для фронтенда
 */

// Константы безопасности
export const SECURITY_CONFIG = {
  // Время жизни токенов (в секундах)
  ACCESS_TOKEN_LIFETIME: 30 * 60, // 30 минут
  REFRESH_TOKEN_LIFETIME: 7 * 24 * 60 * 60, // 7 дней
  
  // Настройки хранения
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    LAST_ACTIVITY: 'last_activity'
  },
  
  // Таймауты
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 минут в миллисекундах
  AUTO_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 минут до истечения
} as const;

/**
 * Безопасное хранение токенов
 */
export class SecureTokenStorage {
  private static instance: SecureTokenStorage;
  
  private constructor() {}
  
  static getInstance(): SecureTokenStorage {
    if (!SecureTokenStorage.instance) {
      SecureTokenStorage.instance = new SecureTokenStorage();
    }
    return SecureTokenStorage.instance;
  }
  
  /**
   * Сохранить токены безопасно
   */
  setTokens(accessToken: string, refreshToken: string): void {
    try {
      // В продакшене можно использовать httpOnly cookies
      localStorage.setItem(SECURITY_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(SECURITY_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      this.updateLastActivity();
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }
  
  /**
   * Получить access token
   */
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }
  
  /**
   * Получить refresh token
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }
  
  /**
   * Очистить все токены
   */
  clearTokens(): void {
    try {
      localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(SECURITY_CONFIG.STORAGE_KEYS.LAST_ACTIVITY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }
  
  /**
   * Проверить, есть ли токены
   */
  hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }
  
  /**
   * Обновить время последней активности
   */
  private updateLastActivity(): void {
    try {
      localStorage.setItem(SECURITY_CONFIG.STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
    } catch (error) {
      console.error('Error updating last activity:', error);
    }
  }
  
  /**
   * Проверить, не истекла ли сессия
   */
  isSessionExpired(): boolean {
    try {
      const lastActivity = localStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.LAST_ACTIVITY);
      if (!lastActivity) return true;
      
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      return timeSinceLastActivity > SECURITY_CONFIG.SESSION_TIMEOUT;
    } catch (error) {
      console.error('Error checking session expiration:', error);
      return true;
    }
  }
  
  /**
   * Проверить, нужно ли обновить токен
   */
  shouldRefreshToken(): boolean {
    try {
      const lastActivity = localStorage.getItem(SECURITY_CONFIG.STORAGE_KEYS.LAST_ACTIVITY);
      if (!lastActivity) return false;
      
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      return timeSinceLastActivity > (SECURITY_CONFIG.SESSION_TIMEOUT - SECURITY_CONFIG.AUTO_REFRESH_THRESHOLD);
    } catch (error) {
      console.error('Error checking token refresh:', error);
      return false;
    }
  }
}

/**
 * Валидация данных на фронтенде
 */
export class InputValidator {
  /**
   * Валидация email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Валидация пароля
   */
  static isValidPassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one digit');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Валидация username
   */
  static isValidUsername(username: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (username.length > 30) {
      errors.push('Username must be no more than 30 characters long');
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores and hyphens');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Санитизация ввода
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Убираем < и >
      .replace(/javascript:/gi, '') // Убираем javascript:
      .replace(/on\w+=/gi, '') // Убираем event handlers
      .trim();
  }
}

/**
 * Утилиты для работы с JWT токенами
 */
export class JWTUtils {
  /**
   * Декодировать JWT токен (без проверки подписи)
   */
  static decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }
  
  /**
   * Проверить, истек ли токен
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
  
  /**
   * Получить время истечения токена
   */
  static getTokenExpirationTime(token: string): Date | null {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return null;
      
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Error getting token expiration time:', error);
      return null;
    }
  }
}

// Экспортируем экземпляр хранилища токенов
export const tokenStorage = SecureTokenStorage.getInstance();
