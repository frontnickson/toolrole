# Safari Compatibility Guide

## Обзор

Этот документ описывает исправления и улучшения для обеспечения совместимости с браузером Safari на всех платформах (macOS, iOS, iPadOS).

## Основные проблемы Safari

### 1. Flexbox
- Safari требует префиксы `-webkit-` для flexbox свойств
- Некоторые flexbox свойства работают по-разному в Safari
- Проблемы с `flex-shrink` и `flex-grow`

### 2. Grid
- Safari имеет ограниченную поддержку CSS Grid
- Рекомендуется использовать flexbox fallback

### 3. Transform и Transition
- Safari требует префиксы для transform
- Проблемы с производительностью анимаций

### 4. Border-radius и Box-shadow
- Safari может некорректно отображать некоторые значения
- Требуются префиксы для старых версий

## Использование миксинов

### Flexbox миксины
```scss
// Вместо
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;

// Используйте
@include flex-safari-column;
@include flex-safari-center;
```

### Grid миксины
```scss
// Вместо
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1rem;

// Используйте
@include grid-safari(auto-fit, 1rem);
```

### Transform миксины
```scss
// Вместо
transform: translateY(-10px);

// Используйте
@include transform-safari(translateY(-10px));
```

### Transition миксины
```scss
// Вместо
transition: all 0.2s ease;

// Используйте
@include transition-safari(all);
```

## CSS классы для Safari

### Базовые классы
- `.flex-container` - flexbox контейнер с поддержкой Safari
- `.flex-column` - вертикальный flexbox
- `.flex-center` - центрированный flexbox
- `.flex-between` - flexbox с space-between

### Безопасные классы
- `.transform-safe` - безопасные трансформации
- `.transition-safe` - безопасные переходы
- `.border-radius-safe` - безопасные скругления
- `.box-shadow-safe` - безопасные тени

### Утилитарные классы
- `.appearance-none` - сброс appearance
- `.user-select-none` - отключение выделения
- `.overflow-safe` - безопасный overflow
- `.sticky-safe` - безопасный sticky

## Медиа-запросы для Safari

### Safari на macOS
```scss
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  // Safari-специфичные стили
}
```

### Safari на iOS
```scss
@supports (-webkit-touch-callout: none) {
  // iOS Safari стили
}
```

### Высокий DPI
```scss
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  // Стили для высокого DPI
}
```

## Рекомендации

### 1. Всегда используйте миксины
Вместо написания CSS напрямую, используйте предоставленные миксины для обеспечения совместимости.

### 2. Тестируйте на разных версиях Safari
- Safari 14+ (macOS Big Sur)
- Safari 13+ (macOS Catalina)
- Safari на iOS 14+
- Safari на iPadOS 14+

### 3. Используйте fallback
Всегда предоставляйте fallback для новых CSS свойств, которые могут не поддерживаться в старых версиях Safari.

### 4. Оптимизируйте производительность
- Используйте `transform: translateZ(0)` для аппаратного ускорения
- Минимизируйте количество анимаций
- Используйте `will-change` для оптимизации

## Примеры использования

### Карточка с поддержкой Safari
```scss
.card {
  @include flex-safari-column;
  @include border-radius-safari(8px);
  @include box-shadow-safari(0 2px 8px rgba(0, 0, 0, 0.1));
  @include transition-safari(all);
  
  &:hover {
    @include transform-safari(translateY(-2px));
    @include box-shadow-safari(0 4px 16px rgba(0, 0, 0, 0.15));
  }
}
```

### Модальное окно с поддержкой Safari
```scss
.modal {
  @include flex-safari-center;
  @include backdrop-blur-safari(10px);
  @include border-radius-safari(12px);
  
  .modal-content {
    @include box-sizing-safari;
    @include hide-scrollbar-safari;
  }
}
```

### Форма с поддержкой Safari
```scss
.form {
  @include flex-safari-column;
  
  .form-input {
    @include appearance-safari;
    @include border-radius-safari(6px);
    @include transition-safari(border-color, box-shadow);
    
    &:focus {
      @include box-shadow-safari(0 0 0 3px rgba(0, 123, 255, 0.1));
    }
  }
}
```

## Отладка

### Safari Developer Tools
1. Откройте Safari Developer Tools (Develop → Show Web Inspector)
2. Проверьте Console на наличие ошибок
3. Используйте Elements для инспекции CSS
4. Проверьте Network для загрузки ресурсов

### Safari Technology Preview
Используйте Safari Technology Preview для тестирования новых CSS свойств и функций.

### BrowserStack
Тестируйте на реальных устройствах с помощью BrowserStack или аналогичных сервисов.

## Полезные ссылки

- [Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/)
- [Can I Use](https://caniuse.com/) - проверка поддержки CSS свойств
- [MDN Web Docs](https://developer.mozilla.org/) - документация по CSS
- [CSS-Tricks](https://css-tricks.com/) - советы и трюки по CSS

## Поддержка

При возникновении проблем с совместимостью Safari:

1. Проверьте версию Safari
2. Убедитесь, что используются правильные миксины
3. Проверьте Console на наличие ошибок
4. Создайте issue с описанием проблемы
5. Приложите скриншоты и код для воспроизведения
