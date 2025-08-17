# Features

Папка для функциональных модулей приложения. Каждый feature - это независимый блок функциональности.

## Структура

```
features/
├── auth/          # Модуль аутентификации
├── dashboard/     # Модуль дашборда
├── profile/       # Модуль профиля пользователя
├── settings/      # Модуль настроек
├── notifications/ # Модуль уведомлений
└── [feature]/     # Другие модули
```

## Правила создания features

1. **Один feature = одна папка** с именем функциональности
2. **В каждой папке feature:**
   - `index.ts` - экспорт всех компонентов и логики
   - `components/` - компоненты, специфичные для feature
   - `hooks/` - хуки для feature
   - `services/` - сервисы для feature
   - `types/` - типы для feature
   - `utils/` - утилиты для feature
   - `constants/` - константы для feature

## Пример структуры feature

```
features/auth/
├── index.ts
├── components/
│   ├── LoginForm/
│   ├── RegisterForm/
│   └── ForgotPassword/
├── hooks/
│   ├── useAuth.ts
│   └── useLogin.ts
├── services/
│   └── authService.ts
├── types/
│   └── auth.types.ts
├── utils/
│   └── auth.utils.ts
└── constants/
    └── auth.constants.ts
```

## Типы features

### Auth Feature
- **Login** - вход в систему
- **Register** - регистрация
- **Password Reset** - сброс пароля
- **Profile Management** - управление профилем

### Dashboard Feature
- **Overview** - общий обзор
- **Analytics** - аналитика
- **Reports** - отчеты
- **Charts** - графики и диаграммы

### Profile Feature
- **User Info** - информация о пользователе
- **Settings** - настройки
- **Preferences** - предпочтения
- **Security** - безопасность

## Принципы

- **Инкапсуляция** - каждый feature самодостаточен
- **Переиспользование** - компоненты могут использоваться в других features
- **API** - взаимодействие с бэкендом через services
- **State Management** - управление состоянием через хуки или store
- **TypeScript** - строгая типизация всех данных
