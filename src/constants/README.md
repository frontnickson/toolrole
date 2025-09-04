# Constants

Папка для констант приложения - неизменяемых значений, используемых в разных частях приложения.

## Структура

```
constants/
├── index.ts          # Основные константы (экспорт всех)
├── api.ts            # Константы для API
├── app.ts            # Константы приложения
├── ui.ts             # Константы UI
├── validation.ts     # Константы валидации
├── messages.ts       # Сообщения и тексты
├── routes.ts         # Маршруты приложения
└── [domain].ts       # Константы для других областей
```

## Правила создания констант

1. **Один файл = одна область** констант
2. **Экспорт через index.ts** - централизованный экспорт
3. **Именование** - UPPER_SNAKE_CASE для констант
4. **Группировка** - логическое группирование констант
5. **Документация** - комментарии для сложных констант

## Пример констант

```typescript
/**
 * API константы
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * Статусы HTTP ответов
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Роли пользователей
 */
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

/**
 * Размеры компонентов
 */
export const COMPONENT_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
} as const;
```

## Типы файлов

### API Constants
- **api.ts** - URL, таймауты, заголовки
- **endpoints.ts** - эндпоинты API
- **status.ts** - HTTP статусы

### App Constants
- **app.ts** - название, версия, настройки
- **config.ts** - конфигурация приложения
- **environment.ts** - переменные окружения

### UI Constants
- **ui.ts** - размеры, цвета, анимации
- **breakpoints.ts** - точки перелома для адаптивности
- **zIndex.ts** - z-индексы элементов

### Validation Constants
- **validation.ts** - правила валидации
- **limits.ts** - лимиты полей
- **patterns.ts** - регулярные выражения

### Message Constants
- **messages.ts** - тексты сообщений
- **errors.ts** - сообщения об ошибках
- **success.ts** - сообщения об успехе

### Route Constants
- **routes.ts** - маршруты приложения
- **paths.ts** - пути к страницам
- **params.ts** - параметры маршрутов

## Принципы

- **Централизация** - все константы в одном месте
- **Неизменяемость** - константы не должны изменяться
- **Переиспользование** - константы используются в разных частях
- **Читаемость** - понятные имена и группировка
- **Типизация** - использование `as const` для строгой типизации
