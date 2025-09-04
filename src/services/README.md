# Services

Папка для сервисов - модулей, которые инкапсулируют бизнес-логику и взаимодействие с внешними API.

## Структура

```
services/
├── api/              # API сервисы
│   ├── index.ts      # Основной API клиент
│   ├── auth.ts       # Сервис аутентификации
│   ├── user.ts       # Сервис пользователей
│   └── [service].ts  # Другие API сервисы
├── localStorage/     # Сервисы локального хранилища
│   ├── index.ts      # Основной сервис
│   └── [service].ts  # Специализированные сервисы
├── external/         # Внешние сервисы (платежи, аналитика)
└── [service]/        # Другие сервисы
```

## Правила создания сервисов

1. **Один сервис = один файл** с именем сервиса
2. **Класс или объект** - инкапсуляция логики
3. **Типизация** - строгая типизация с TypeScript
4. **Обработка ошибок** - централизованная обработка ошибок
5. **Логирование** - логирование операций и ошибок

## Пример сервиса

```typescript
/**
 * Сервис для работы с пользователями
 */
export class UserService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Получить список пользователей
   */
  async getUsers(params: GetUsersParams): Promise<User[]> {
    try {
      const response = await this.apiClient.get('/users', { params });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch users', error);
      throw new UserServiceError('Не удалось получить список пользователей');
    }
  }
}
```

## Типы сервисов

### API Services
- **api/index.ts** - основной API клиент с настройками
- **api/auth.ts** - аутентификация, авторизация
- **api/user.ts** - управление пользователями
- **api/upload.ts** - загрузка файлов
- **api/notification.ts** - уведомления

### Local Storage Services
- **localStorage/index.ts** - основной сервис
- **localStorage/auth.ts** - хранение токенов
- **localStorage/settings.ts** - настройки пользователя
- **localStorage/cache.ts** - кэширование данных

### External Services
- **external/payment.ts** - платежные системы
- **external/analytics.ts** - аналитика (Google Analytics, Mixpanel)
- **external/email.ts** - отправка email
- **external/sms.ts** - отправка SMS

### Business Services
- **business/order.ts** - бизнес-логика заказов
- **business/inventory.ts** - управление складом
- **business/reporting.ts** - формирование отчетов

## Принципы

- **Инкапсуляция** - сервисы скрывают детали реализации
- **Переиспользование** - сервисы могут использоваться в разных компонентах
- **Тестируемость** - легко мокать для тестов
- **Обработка ошибок** - централизованная обработка и логирование
- **Конфигурация** - настройки через конфигурационные файлы
