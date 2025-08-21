# UserSlice - Новая логика работы

## Обзор изменений

Мы переделали `userSlice.ts` в соответствии с вашим подходом к работе с данными пользователя. Теперь логика работает именно так, как вы привыкли:

## Основные принципы

### 1. Расширенный initialState
- **Все возможные поля пользователя** теперь определены в `ExtendedUser` интерфейсе
- Включает: имя, фамилию, пол, возраст, настройки, социальные связи и многое другое
- Нет необходимости в дополнительных slice'ах для разных типов данных

### 2. useState для всех параметров
- В формах используется `useState()` для всех полей `ExtendedUser`
- Каждое изменение поля сразу сохраняется в Redux через `dispatch(setTempUserData())`
- Данные накапливаются в `tempUserData` для последующей обработки

### 3. Redux-persist для автоматического сохранения
- **НЕ используем localStorage** для данных пользователя
- Redux-persist автоматически сохраняет все данные пользователя
- При выходе данные очищаются из Redux store, но сохраняются на сервере
- В localStorage храним только `authToken` для API запросов

## Структура ExtendedUser

```typescript
interface ExtendedUser {
  // Основные данные
  id: number;
  email: string;
  username: string;
  
  // Личные данные
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birthDate?: string;
  age?: number;
  
  // Профиль
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  
  // Настройки
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'ru';
  
  // Статус
  isActive: boolean;
  isVerified: boolean;
  isSuperuser: boolean;
  isOnline: boolean;
  
  // Социальные связи
  friends: string[];
  friendRequests: string[];
  teams: string[];
  
  // Уведомления
  notifications: string[];
  unreadNotificationsCount: number;
  
  // И многое другое...
}
```

## Основные Actions

### Установка пользователя
```typescript
dispatch(setCurrentUser(userData)) // При входе/регистрации
// Redux-persist автоматически сохранит данные
```

### Очистка данных
```typescript
dispatch(clearCurrentUser()) // При выходе
// Redux-persist автоматически очистит сохраненные данные
```

### Временные данные для форм
```typescript
dispatch(setTempUserData(formData)) // При изменении полей формы
dispatch(clearTempUserData()) // При очистке формы
```

### Обновление профиля
```typescript
dispatch(updateUserProfile(updatedFields)) // При изменении профиля
// Redux-persist автоматически сохранит изменения
```

## Что хранится где

### localStorage (только для API)
```typescript
// Только токен аутентификации
localStorage.setItem('authToken', token);
localStorage.removeItem('authToken'); // При выходе
```

### Redux-persist (автоматически)
```typescript
// Все данные пользователя
currentUser: ExtendedUser
isAuthenticated: boolean
isLoading: boolean
error: string | null
tempUserData: Partial<ExtendedUser>
```

### Сервер (постоянное хранение)
```typescript
// Все данные пользователя сохраняются на сервере
// При выходе данные НЕ теряются
// При следующем входе восстанавливаются через API
```

## Пример использования в форме

```typescript
const RegisterForm = () => {
  const dispatch = useDispatch();
  
  // useState для всех полей
  const [formData, setFormData] = useState<Partial<ExtendedUser>>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    // ... все остальные поля
  });

  // При изменении поля - обновляем и локальное состояние, и Redux
  const handleInputChange = (field: keyof ExtendedUser, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Сохраняем в Redux tempUserData
    dispatch(setTempUserData(newData));
  };

  // При отправке формы
  const handleSubmit = async () => {
    // Данные уже в Redux tempUserData
    const result = await register(credentials);
    
    if (result.success) {
      // Очищаем временные данные
      dispatch(clearTempUserData());
      // Основные данные пользователя автоматически сохраняются через Redux-persist
    }
  };
};
```

## Преимущества нового подхода

1. **Простота**: Один slice для всех данных пользователя
2. **Автоматическое сохранение**: Redux-persist делает все за нас
3. **Производительность**: Нет лишних localStorage операций
4. **Отладка**: Все данные пользователя в одном месте
5. **Масштабируемость**: Легко расширять функциональность
6. **Безопасность**: Токен отдельно, данные отдельно

## Миграция с старого подхода

Если у вас есть компоненты, использующие старый `userSlice`:

1. Замените импорты на новые типы
2. Обновите использование `User` на `ExtendedUser`
3. Используйте новые actions вместо старых
4. Обновите селекторы
5. **Уберите все localStorage операции** для данных пользователя

## Селекторы

```typescript
// Основные
selectCurrentUser
selectIsAuthenticated
selectIsLoading
selectError
selectTempUserData

// Дополнительные
selectUserFullName
selectUserAvatar
selectUserTheme
selectUserLanguage
selectUserFriendsCount
selectUserTeamsCount
selectUnreadNotificationsCount
```

## Заключение

Новый подход полностью соответствует вашей логике и правильно использует Redux-persist:
- ✅ `initialState` содержит все возможные поля
- ✅ `useState()` для всех параметров в формах
- ✅ `dispatch()` для сохранения в Redux
- ✅ **Redux-persist автоматически сохраняет данные**
- ✅ **localStorage только для authToken**
- ✅ Очистка данных при выходе (но сохранение на сервере)

Это делает код более понятным, поддерживаемым и соответствующим современным практикам работы с Redux.
