# Hooks

Папка для кастомных React хуков. Хуки содержат переиспользуемую логику состояния и побочных эффектов.

## Структура

```
hooks/
├── useApi.ts          # Хук для работы с API
├── useLocalStorage.ts # Хук для работы с localStorage
├── useDebounce.ts     # Хук для debounce
├── useThrottle.ts     # Хук для throttle
├── useClickOutside.ts # Хук для клика вне элемента
├── useWindowSize.ts   # Хук для размеров окна
└── [hook].ts          # Другие хуки
```

## Правила создания хуков

1. **Именование** - всегда начинается с `use`
2. **Один хук = один файл** с именем хука
3. **Типизация** - строгая типизация с TypeScript
4. **Документация** - JSDoc комментарии для описания

## Пример хука

```typescript
/**
 * Хук для работы с API запросами
 * @param apiMethod - метод API для выполнения
 * @param initialData - начальные данные
 * @returns объект с состоянием и методами
 */
export function useApi<T>(
  apiMethod: (...args: any[]) => Promise<ApiResponse<T>>,
  initialData: T | null = null
): UseApiReturn<T> {
  // логика хука
}
```

## Типы хуков

### API Hooks
- **useApi** - базовый хук для API запросов
- **useGet** - хук для GET запросов
- **usePost** - хук для POST запросов
- **usePut** - хук для PUT запросов
- **useDelete** - хук для DELETE запросов

### State Hooks
- **useLocalStorage** - работа с localStorage
- **useSessionStorage** - работа с sessionStorage
- **useToggle** - переключение boolean значения
- **useCounter** - счетчик с increment/decrement

### UI Hooks
- **useClickOutside** - клик вне элемента
- **useHover** - состояние наведения
- **useFocus** - состояние фокуса
- **useScroll** - отслеживание скролла

### Utility Hooks
- **useDebounce** - debounce для значений
- **useThrottle** - throttle для значений
- **useWindowSize** - размеры окна браузера
- **useMediaQuery** - медиа-запросы

## Принципы

- **Переиспользование** - хуки должны быть универсальными
- **Чистота** - хуки не должны иметь побочных эффектов
- **Типизация** - строгая типизация всех параметров и возвращаемых значений
- **Документация** - подробное описание назначения и использования
- **Тестирование** - покрытие тестами для сложных хуков
