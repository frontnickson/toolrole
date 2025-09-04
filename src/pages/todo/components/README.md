# Todo Components

Компоненты для системы управления задачами (Todo).

## Структура папок

### 📁 board/
Компоненты для управления досками задач.
- `TodoBoard` - основная доска Kanban
- `BoardSettingsMenu` - меню настроек доски

### 📁 tasks/
Компоненты для работы с задачами.
- `TodoList` - список задач
- `TodoCard` - карточка задачи
- `TodoItem` - элемент задачи
- `TodoTaskRow` - строка задачи
- `TodoForm` - форма задачи
- `TaskPage` - страница задачи
- `TaskPageWrapper` - обертка страницы

### 📁 ui/
Общие UI компоненты.
- `TodoSearch` - поиск по задачам
- `TodoFilter` - фильтры задач
- `TodoCalendar` - календарь задач

### 📁 layout/
Компоненты макета.
- `TodoLayout` - основной макет
- `TodoSidebar` - боковая панель

### 📁 modals/
Модальные окна.
- `NewBoardModal` - создание новой доски

## Использование

```tsx
// Импорт всех компонентов
import * as TodoComponents from '../components';

// Импорт по категориям
import { TodoBoard, BoardSettingsMenu } from '../components/board';
import { TodoList, TodoCard } from '../components/tasks';
import { TodoSearch, TodoFilter } from '../components/ui';
import { TodoLayout, TodoSidebar } from '../components/layout';
import { NewBoardModal } from '../components/modals';
```

## Организация

Компоненты организованы по функциональности для лучшей навигации и поддержки кода. Каждая папка содержит связанные компоненты и имеет свой `index.ts` файл для удобного импорта.
