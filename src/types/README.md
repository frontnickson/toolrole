# Система типов и состояний для Task Manager

## Обзор

Создана полноценная система типов и состояний для современного таск-менеджера с поддержкой команд, друзей, уведомлений и расширенной функциональности.

## Структура типов

### 1. Пользователи (`user.ts`)
- **User** - основная модель пользователя
- **UserPreferences** - настройки пользователя (тема, язык, уведомления)
- **UserRole** - роли пользователей (admin, moderator, user, guest)
- **UserStatus** - статусы пользователей (active, inactive, suspended, deleted)
- **Friendship** - система дружбы между пользователями
- **Team** - команды и права доступа
- **Permission** - система разрешений для ресурсов

### 2. Доски и задачи (`board.ts`)
- **Board** - доски с настройками и участниками
- **Column** - колонки досок (Kanban-style)
- **Task** - задачи с полной функциональностью
- **Subtask** - подзадачи
- **Comment** - комментарии к задачам
- **Attachment** - вложения (файлы)
- **Activity** - история изменений
- **BoardTemplate** - шаблоны досок

### 3. Уведомления (`notification.ts`)
- **Notification** - различные типы уведомлений
- **NotificationType** - типы уведомлений (задачи, комментарии, приглашения)
- **NotificationPriority** - приоритеты уведомлений
- **UserNotificationSettings** - настройки уведомлений пользователя
- **QuietHours** - тихие часы
- **DigestFrequency** - частота дайджестов

### 4. Состояния (`state.ts`)
- **UserState** - состояние пользователя в Redux
- **BoardState** - состояние досок в Redux
- **TaskState** - состояние задач (будет добавлено)
- **NotificationState** - состояние уведомлений (будет добавлено)
- **UIState** - состояние интерфейса (будет добавлено)

## Redux Store

### Слои (Slices)

#### UserSlice
- Управление профилем пользователя
- Друзья и заявки в друзья
- Команды
- Уведомления
- Async thunks для API вызовов

#### BoardSlice
- CRUD операции с досками
- Управление колонками
- Участники досок
- Архивация досок
- Шаблоны досок

### Хуки (Hooks)

Созданы типизированные хуки для удобной работы с Redux:

```typescript
// Пользователь
const currentUser = useCurrentUser();
const isAuthenticated = useIsAuthenticated();
const friends = useFriends();
const notifications = useNotifications();

// Доски
const boards = useBoards();
const currentBoard = useCurrentBoard();
const boardColumns = useCurrentBoardColumns();
const boardMembers = useCurrentBoardMembers();
```

## Функциональность

### Пользователи
- ✅ Профили с аватарами и настройками
- ✅ Система дружбы и заявок
- ✅ Команды с ролями и правами
- ✅ Настройки приватности и уведомлений
- ✅ Статусы онлайн/оффлайн

### Доски
- ✅ Создание и настройка досок
- ✅ Kanban колонки с перетаскиванием
- ✅ Участники с правами доступа
- ✅ Шаблоны досок
- ✅ Архивация и восстановление
- ✅ Публичные и приватные доски

### Задачи
- ✅ Полная модель задач с метаданными
- ✅ Подзадачи
- ✅ Комментарии и упоминания
- ✅ Вложения файлов
- ✅ История изменений
- ✅ Наблюдатели
- ✅ Теги и приоритеты
- ✅ Сроки выполнения

### Уведомления
- ✅ Различные типы уведомлений
- ✅ Настройки по типам
- ✅ Тихие часы
- ✅ Дайджесты
- ✅ Приоритеты

### Система прав
- ✅ Роли пользователей
- ✅ Разрешения на ресурсы
- ✅ Управление доступом к доскам
- ✅ Приглашения участников

## Расширяемость

Система спроектирована для легкого расширения:

1. **Новые типы уведомлений** - добавление в enum NotificationType
2. **Дополнительные поля** - расширение интерфейсов
3. **Новые роли** - добавление в enum UserRole/TeamRole
4. **Дополнительные разрешения** - расширение Permission
5. **Новые состояния** - создание новых slice'ов

## Использование

### В компонентах

```typescript
import { useCurrentUser, useBoards } from '../store/hooks';

const MyComponent = () => {
  const currentUser = useCurrentUser();
  const boards = useBoards();
  
  // Использование данных
};
```

### В Redux actions

```typescript
import { useAppDispatch } from '../store/hooks';
import { createBoard, updateBoard } from '../store/slices/boardSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  
  const handleCreateBoard = (boardData) => {
    dispatch(createBoard({ userId: currentUser.id, boardData }));
  };
};
```

## Планы развития

1. **TaskSlice** - полное управление задачами
2. **NotificationSlice** - управление уведомлениями
3. **TeamSlice** - управление командами
4. **FriendSlice** - управление друзьями
5. **UISlice** - состояние интерфейса
6. **DragAndDrop** - перетаскивание задач между колонками
7. **Real-time** - WebSocket для обновлений в реальном времени
8. **Offline** - поддержка работы без интернета
9. **Analytics** - статистика и аналитика
10. **Integrations** - интеграции с внешними сервисами

## Архитектурные принципы

- **Type Safety** - полная типизация TypeScript
- **Single Source of Truth** - централизованное состояние
- **Immutability** - неизменяемость данных
- **Async Operations** - async thunks для API
- **Error Handling** - обработка ошибок на всех уровнях
- **Performance** - оптимизация рендеринга
- **Scalability** - легкость добавления новых функций
