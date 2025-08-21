# Redux Store с Redux-Persist

Этот проект использует Redux Toolkit с Redux-Persist для сохранения состояния между сессиями.

## Структура

```
src/store/
├── index.ts          # Основная конфигурация store и persist
├── hooks.ts          # Типизированные хуки для компонентов
├── slices/           # Redux слайсы
│   ├── userSlice.ts  # Управление пользователями
│   └── boardSlice.ts # Управление досками
└── README.md         # Этот файл
```

## Настройка Redux-Persist

### Основная конфигурация (index.ts)

```typescript
const persistConfig = {
  key: "root",           // Ключ для localStorage
  storage,               // Используем localStorage
  whitelist: ["user", "boards"], // Сохраняем только эти слайсы
  version: 1,            // Версия для миграций
  debug: process.env.NODE_ENV === "development", // Отладка в dev режиме
  timeout: 10000,        // Таймаут восстановления (10 сек)
};
```

### Игнорируемые пути для сериализации

```typescript
ignoredPaths: [
  "user.currentUser.createdAt", 
  "user.currentUser.lastActive",
  "user.currentUser.updatedAt",
  "boards.currentBoard.createdAt",
  "boards.currentBoard.updatedAt",
  "boards.boards[].createdAt",
  "boards.boards[].updatedAt"
]
```

## Использование в компонентах

### Базовые хуки

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';

function MyComponent() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const boards = useAppSelector(state => state.boards.boards);
  
  // ... логика компонента
}
```

### Селекторы для оптимизации

```typescript
// userSlice.ts
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;

// boardSlice.ts
export const selectBoards = (state: { boards: BoardState }) => state.boards.boards;
export const selectCurrentBoard = (state: { boards: BoardState }) => state.boards.currentBoard;
```

### Хуки для persist

```typescript
import { usePersistState } from '../store/hooks';

function SettingsComponent() {
  const { clearAllState, clearSliceState } = usePersistState();
  
  const handleClearUserData = () => {
    clearSliceState('user');
  };
  
  const handleClearAllData = () => {
    clearAllState();
  };
}
```

## Что сохраняется

### userSlice
- `currentUser` - текущий пользователь
- `isAuthenticated` - статус аутентификации
- `preferences` - настройки пользователя
- `friends` - список друзей
- `teams` - команды пользователя
- `notifications` - уведомления

### boardSlice
- `boards` - список досок
- `currentBoard` - текущая активная доска
- `archivedBoards` - архивированные доски
- `templates` - шаблоны досок

## Что НЕ сохраняется

- Временные состояния загрузки (`isLoading`)
- Ошибки (`error`)
- Временные данные API

## Отладка

В режиме разработки включено логирование:
- Инициализация store
- Обновления состояния
- Восстановление из persist

## Миграции

При изменении структуры состояния:
1. Увеличьте версию в `persistConfig.version`
2. Добавьте логику миграции в `migrate` функцию
3. Протестируйте на существующих данных

## Производительность

- Используйте селекторы для оптимизации re-renders
- Избегайте создания новых объектов в селекторах
- Используйте `useMemo` для сложных вычислений

## Безопасность

- Не сохраняйте чувствительные данные (пароли, токены)
- Валидируйте данные при восстановлении
- Очищайте данные при выходе пользователя
