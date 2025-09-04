# Исправление проблемы с сохранением задач

## Проблема
Задачи исчезали при обновлении страницы, несмотря на то, что Redux-Persist был настроен для сохранения состояния.

## Корень проблемы
Проблема была в функции `replaceAllBoards` в `boardSlice.ts`. При загрузке досок с сервера эта функция полностью заменяла все доски, включая те, у которых уже были загружены задачи. Это приводило к потере данных о задачах.

## Решение

### 1. Исправлена функция `replaceAllBoards`
**До:**
```typescript
replaceAllBoards: (state, action: PayloadAction<Board[]>) => {
  state.boards = action.payload.map(board => {
    if (!board.columns || board.columns.length === 0) {
      board.columns = createStandardColumns(board.id);
    }
    return board;
  });
}
```

**После:**
```typescript
replaceAllBoards: (state, action: PayloadAction<Board[]>) => {
  // Сохраняем задачи из существующих досок
  const existingTasksMap = new Map<string, Map<string, Task[]>>();
  
  state.boards.forEach(board => {
    const boardTasks = new Map<string, Task[]>();
    board.columns.forEach(column => {
      if (column.tasks && column.tasks.length > 0) {
        boardTasks.set(column.id, [...column.tasks]);
      }
    });
    if (boardTasks.size > 0) {
      existingTasksMap.set(board.id, boardTasks);
    }
  });

  // Заменяем доски, но сохраняем существующие задачи
  state.boards = action.payload.map(board => {
    if (!board.columns || board.columns.length === 0) {
      board.columns = createStandardColumns(board.id);
    }
    
    // Восстанавливаем задачи из существующих досок
    const existingBoardTasks = existingTasksMap.get(board.id);
    if (existingBoardTasks) {
      board.columns.forEach(column => {
        const existingTasks = existingBoardTasks.get(column.id);
        if (existingTasks) {
          column.tasks = existingTasks;
        }
      });
    }
    
    return board;
  });
}
```

### 2. Добавлена новая функция `updateBoardTasks`
Создана специальная функция для обновления задач в доске без полной замены:

```typescript
updateBoardTasks: (state, action: PayloadAction<{ boardId: string; tasks: Task[] }>) => {
  const { boardId, tasks } = action.payload;
  const board = state.boards.find(b => b.id === boardId);
  if (board) {
    // Очищаем существующие задачи и добавляем новые
    board.columns.forEach(column => {
      column.tasks = tasks.filter(task => task.columnId === column.id);
    });
    board.updatedAt = Date.now();
  }
  
  // Обновляем currentBoard если это текущая доска
  if (state.currentBoard?.id === boardId) {
    state.currentBoard.columns.forEach(column => {
      column.tasks = tasks.filter(task => task.columnId === column.id);
    });
    state.currentBoard.updatedAt = Date.now();
  }
}
```

### 3. Улучшена функция `updateBoard`
Добавлена поддержка обновления колонок с задачами:

```typescript
updateBoard: (state, action: PayloadAction<{ boardId: string; updates: Partial<Board> }>) => {
  const { boardId, updates } = action.payload;
  const board = state.boards.find(b => b.id === boardId);
  if (board) {
    // Если обновления содержат колонки с задачами, обновляем их
    if (updates.columns) {
      board.columns = updates.columns;
    } else {
      Object.assign(board, updates);
    }
    board.updatedAt = Date.now();
  }
  
  // Обновляем currentBoard если это текущая доска
  if (state.currentBoard?.id === boardId) {
    if (updates.columns) {
      state.currentBoard.columns = updates.columns;
    } else {
      Object.assign(state.currentBoard, updates);
    }
    state.currentBoard.updatedAt = Date.now();
  }
}
```

### 4. Обновлен хук `useBoards`
Функция `loadBoardTasks` теперь использует новую функцию `updateBoardTasks`:

```typescript
const loadBoardTasks = useCallback(async (boardId: string, forceReload = false) => {
  // ... проверка кэша ...
  
  const tasksResponse = await boardsApi.getBoardTasks(boardId);
  if (tasksResponse.success && tasksResponse.data) {
    // Используем новую функцию для обновления задач
    dispatch(updateBoardTasks({ boardId, tasks: tasksResponse.data }));
    
    // Добавляем в кэш
    setLoadedBoardsCache(prev => new Set(prev).add(boardId));
    
    return { success: true, tasks: tasksResponse.data };
  }
  // ...
}, [dispatch, loadedBoardsCache]);
```

## Результат

### ✅ Что исправлено:
1. **Задачи сохраняются при обновлении страницы** - Redux-Persist теперь корректно сохраняет и восстанавливает задачи
2. **Задачи не теряются при перезагрузке досок** - функция `replaceAllBoards` сохраняет существующие задачи
3. **Оптимизированная загрузка задач** - задачи загружаются только при необходимости
4. **Кэширование работает корректно** - избегание повторных запросов

### 🔧 Технические улучшения:
- Добавлена функция `updateBoardTasks` для точного обновления задач
- Улучшена функция `updateBoard` для поддержки обновления колонок
- Исправлена логика сохранения задач в `replaceAllBoards`
- Обновлен хук `useBoards` для использования новых функций

### 📊 Производительность:
- Задачи загружаются только при клике на доску
- Кэширование предотвращает повторные запросы
- Redux-Persist корректно сохраняет состояние
- Оптимизированные обновления состояния

## Тестирование

Для проверки исправлений:

1. **Создайте доску с задачами**
2. **Обновите страницу** - задачи должны остаться
3. **Переключитесь между досками** - задачи должны загружаться корректно
4. **Создайте/измените задачу** - изменения должны сохраняться
5. **Проверьте в DevTools** - состояние должно сохраняться в localStorage

## Файлы изменены:
- `toolrole/src/store/slices/boardSlice.ts` - основные исправления
- `toolrole/src/hooks/useBoards.ts` - обновление логики загрузки
- `toolrole/src/hooks/useBoardTasks.ts` - интеграция с новыми функциями
- `toolrole/src/constants/index.ts` - обновление порта API

