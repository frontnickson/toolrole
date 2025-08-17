# Store

Папка для управления состоянием приложения. Содержит Redux store, slices, селекторы и middleware.

## Структура

```
store/
├── index.ts           # Основной store и конфигурация
├── slices/            # Redux slices для разных доменов
│   ├── authSlice.ts   # Слайс аутентификации
│   ├── userSlice.ts   # Слайс пользователей
│   └── [domain].ts    # Другие слайсы
├── selectors/         # Селекторы для получения данных
│   ├── authSelectors.ts
│   ├── userSelectors.ts
│   └── [domain].ts
├── middleware/         # Redux middleware
│   ├── logger.ts       # Логирование
│   ├── thunk.ts        # Асинхронные действия
│   └── [middleware].ts
└── types/              # Типы для store
    ├── store.types.ts  # Типы store
    └── [domain].ts     # Типы для доменов
```

## Правила создания store

1. **Redux Toolkit** - использование современного Redux Toolkit
2. **Слайсы** - один слайс на один домен
3. **Селекторы** - мемоизированные селекторы с reselect
4. **Типизация** - строгая типизация с TypeScript
5. **Middleware** - только необходимые middleware

## Пример слайса

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from './types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
```

## Типы файлов

### Store Configuration
- **index.ts** - основной store, конфигурация, middleware
- **types/store.types.ts** - типы для store и root state

### Slices
- **authSlice.ts** - аутентификация и авторизация
- **userSlice.ts** - управление пользователями
- **uiSlice.ts** - состояние UI (модалы, уведомления)
- **settingsSlice.ts** - настройки приложения

### Selectors
- **authSelectors.ts** - селекторы для аутентификации
- **userSelectors.ts** - селекторы для пользователей
- **uiSelectors.ts** - селекторы для UI состояния

### Middleware
- **logger.ts** - логирование действий
- **thunk.ts** - асинхронные действия
- **persist.ts** - персистентность состояния

## Принципы

- **Единый источник истины** - все состояние в одном месте
- **Иммутабельность** - состояние не изменяется напрямую
- **Предсказуемость** - изменения через actions и reducers
- **Производительность** - мемоизация селекторов
- **DevTools** - поддержка Redux DevTools для отладки
