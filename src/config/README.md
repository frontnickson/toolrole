# Config

Папка для конфигурационных файлов приложения - настроек, переменных окружения и констант.

## Структура

```
config/
├── index.ts           # Основная конфигурация (экспорт всех)
├── app.ts             # Конфигурация приложения
├── api.ts             # Конфигурация API
├── environment.ts     # Переменные окружения
├── routes.ts          # Конфигурация маршрутов
├── constants.ts       # Константы приложения
├── validation.ts      # Правила валидации
└── [domain].ts        # Конфигурация для других областей
```

## Правила создания конфигурации

1. **Централизация** - все настройки в одном месте
2. **Переменные окружения** - использование .env файлов
3. **Типизация** - строгая типизация с TypeScript
4. **Валидация** - проверка обязательных настроек
5. **Документация** - комментарии для всех настроек

## Пример конфигурации

```typescript
/**
 * Конфигурация приложения
 */
export const APP_CONFIG = {
  NAME: 'Project Mind',
  VERSION: '1.0.0',
  ENVIRONMENT: import.meta.env.MODE,
  DEBUG: import.meta.env.DEV,
} as const;

/**
 * Конфигурация API
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

/**
 * Конфигурация маршрутов
 */
export const ROUTES_CONFIG = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;
```

## Типы файлов

### App Configuration
- **app.ts** - название, версия, режим работы
- **environment.ts** - переменные окружения
- **build.ts** - настройки сборки

### API Configuration
- **api.ts** - URL, таймауты, заголовки
- **endpoints.ts** - эндпоинты API
- **auth.ts** - настройки аутентификации

### Route Configuration
- **routes.ts** - маршруты приложения
- **navigation.ts** - навигационная структура
- **guards.ts** - защита маршрутов

### Validation Configuration
- **validation.ts** - правила валидации
- **messages.ts** - сообщения об ошибках
- **schemas.ts** - схемы валидации

### Feature Configuration
- **features.ts** - настройки функциональности
- **permissions.ts** - права доступа
- **limits.ts** - лимиты и ограничения

## Переменные окружения

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_APP_NAME=Project Mind
VITE_DEBUG=true
VITE_SENTRY_DSN=https://...
VITE_GOOGLE_ANALYTICS_ID=GA_...
```

## Принципы

- **Централизация** - все настройки в одном месте
- **Типизация** - строгая типизация всех настроек
- **Валидация** - проверка обязательных параметров
- **Гибкость** - настройки через переменные окружения
- **Документация** - подробное описание всех настроек
