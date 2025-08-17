# Components

Папка для переиспользуемых UI компонентов приложения.

## Структура

```
components/
├── ui/           # Базовые UI компоненты (Button, Input, Modal, Card и т.д.)
├── layout/       # Компоненты макета (Header, Sidebar, Footer, Navigation)
└── forms/        # Компоненты форм (Form, Input, Select, Checkbox и т.д.)
```

## Правила создания компонентов

1. **Один компонент = одна папка** с именем компонента
2. **В каждой папке компонента:**
   - `index.tsx` - основной файл компонента
   - `ComponentName.tsx` - файл компонента (если нужен)
   - `ComponentName.scss` - стили компонента
   - `ComponentName.types.ts` - типы и интерфейсы
   - `ComponentName.test.tsx` - тесты (если есть)

## Пример структуры компонента

```
components/ui/Button/
├── index.tsx
├── Button.tsx
├── Button.scss
├── Button.types.ts
└── Button.test.tsx
```

## Типы компонентов

### UI Components
- **Button** - кнопки различных стилей
- **Input** - поля ввода
- **Modal** - модальные окна
- **Card** - карточки контента
- **Badge** - бейджи и метки
- **Avatar** - аватары пользователей

### Layout Components
- **Header** - шапка приложения
- **Sidebar** - боковая панель
- **Footer** - подвал
- **Navigation** - навигация
- **Container** - контейнеры для контента

### Form Components
- **Form** - формы
- **Input** - поля ввода
- **Select** - выпадающие списки
- **Checkbox** - чекбоксы
- **Radio** - радиокнопки
- **Textarea** - многострочные поля

## Принципы

- **Переиспользуемость** - компоненты должны быть универсальными
- **Пропсы** - все настройки через props
- **TypeScript** - строгая типизация
- **SCSS** - стилизация через SCSS
- **Тестирование** - покрытие тестами
