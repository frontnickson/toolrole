# Landing Page Structure

Этот модуль содержит landing страницу приложения Toolrole, организованную по современным принципам разработки.

## Структура папок

```
landing/
├── index.ts                    # Главный экспорт
├── Landing.tsx                 # Основной компонент страницы
├── Landing.module.scss         # Стили основного компонента
├── README.md                   # Документация
├── components/                 # Общие компоненты страницы
│   ├── Header/                 # Компоненты заголовка
│   │   ├── index.ts
│   │   ├── LandingHeader.tsx
│   │   ├── LandingHeader.module.scss
│   │   ├── LandingMobileMenu.tsx
│   │   └── LandingMobileMenu.module.scss
│   ├── Footer/                 # Компоненты подвала
│   │   ├── index.ts
│   │   ├── LandingFooter.tsx
│   │   └── LandingFooter.module.scss
│   └── index.ts                # Экспорт всех компонентов
├── sections/                   # Секции страницы
│   ├── Hero/                   # Главная секция
│   │   ├── index.ts
│   │   ├── Hero.tsx
│   │   └── Hero.module.scss
│   ├── Features/               # Секция "О проекте"
│   │   ├── index.ts
│   │   ├── Features.tsx
│   │   └── Features.module.scss
│   ├── AgentAI/                # Секция AI агента
│   │   ├── index.ts
│   │   ├── AgentAI.tsx
│   │   └── AgentAI.module.scss
│   ├── Price/                  # Секция цен
│   │   ├── index.ts
│   │   ├── Price.tsx
│   │   └── Price.module.scss
│   └── Contact/                # Секция контактов
│       ├── index.ts
│       ├── Contact.tsx
│       └── Contact.module.scss
└── types/                      # Типы для landing страницы
    └── index.ts
```

## Принципы организации

### 1. Компонентный подход
- Каждый компонент находится в отдельной папке
- Каждая папка содержит `index.ts` для экспорта
- Стили компонента находятся рядом с компонентом

### 2. Разделение ответственности
- `components/` - переиспользуемые компоненты страницы
- `sections/` - основные секции контента
- `types/` - типы TypeScript

### 3. Именование
- Компоненты: PascalCase (Hero, Features, etc.)
- Файлы: PascalCase.tsx
- Стили: PascalCase.module.scss
- Папки: PascalCase

### 4. Экспорты
- Каждая папка имеет `index.ts` для экспорта
- Главный `components/index.ts` экспортирует все компоненты
- Главный `sections/index.ts` экспортирует все секции

## Навигация

Страница поддерживает плавную прокрутку к секциям:
- **Главная** → секция Hero
- **О проекте** → секция Features  
- **Цены** → секция Price
- **Контакты** → секция Contact

## Стили

- Используются CSS Modules для изоляции стилей
- Импортируются глобальные переменные и миксины
- Поддерживается адаптивность
- Соблюдается принцип BEM для именования классов

## Добавление новых секций

1. Создайте папку в `sections/`
2. Добавьте компонент, стили и `index.ts`
3. Импортируйте в `Landing.tsx`
4. Добавьте в навигацию при необходимости
