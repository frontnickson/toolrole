// Константы приложения
export const APP_NAME = 'Project Mind';
export const APP_VERSION = '1.0.0';

// API константы
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const API_TIMEOUT = 10000;

// Локальное хранилище
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Темы оформления
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Языки
export const LANGUAGES = {
  RU: 'ru',
  EN: 'en',
} as const;

// Роли пользователей
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// Статусы
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;
