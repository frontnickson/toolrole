# 🚀 Руководство по запуску проекта Toolrole

## 📋 Обзор проекта

Проект состоит из двух частей:
- **Frontend** - React приложение с TypeScript и Vite
- **Backend** - Node.js сервер с Express, MongoDB и Redis

## 🛠️ Требования

### Системные требования
- **Node.js** версии 18.0.0 или выше
- **npm** версии 8.0.0 или выше
- **Docker** и **Docker Compose** (для запуска через Docker)
- **Git**

### Проверка версий
```bash
node --version
npm --version
docker --version
docker-compose --version
```

## 🚀 Способ 1: Запуск через Docker (Рекомендуется)

### Шаг 1: Клонирование и настройка
```bash
# Переходим в папку backend
cd backend

# Копируем файл с переменными окружения
cp env.example .env

# Редактируем .env файл (опционально)
nano .env
```

### Шаг 2: Запуск через Docker Compose
```bash
# Запускаем все сервисы
docker-compose up -d

# Проверяем статус
docker-compose ps

# Смотрим логи
docker-compose logs -f
```

### Шаг 3: Запуск Frontend
```bash
# В новом терминале переходим в папку frontend
cd ../toolrole

# Устанавливаем зависимости
npm install

# Запускаем в режиме разработки
npm run dev
```

### Шаг 4: Проверка работы
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **MongoDB**: http://localhost:27018
- **Mongo Express**: http://localhost:8081 (admin/admin)
- **Redis Commander**: http://localhost:8082

## 🔧 Способ 2: Локальный запуск (Для разработки)

### Шаг 1: Настройка Backend

#### 1.1 Установка MongoDB
```bash
# macOS (через Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Или через Docker
docker run -d -p 27017:27017 --name mongodb mongo:5
```

#### 1.2 Установка Redis
```bash
# macOS (через Homebrew)
brew install redis
brew services start redis

# Или через Docker
docker run -d -p 6379:6379 --name redis redis:6-alpine
```

#### 1.3 Настройка Backend
```bash
cd backend

# Устанавливаем зависимости
npm install

# Копируем переменные окружения
cp env.example .env

# Редактируем .env для локального запуска
nano .env
```

**Важные настройки в .env:**
```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/toolrole_db
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:5173
```

#### 1.4 Запуск Backend
```bash
# Режим разработки с автоперезагрузкой
npm run dev

# Или обычный запуск
npm start
```

### Шаг 2: Настройка Frontend

#### 2.1 Установка зависимостей
```bash
cd ../toolrole

# Устанавливаем зависимости
npm install
```

#### 2.2 Запуск Frontend
```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 🔍 Проверка работоспособности

### Backend API
```bash
# Проверка здоровья сервера
curl http://localhost:8000/health

# Проверка MongoDB подключения
curl http://localhost:8000/api/v1/health/db

# Проверка Redis подключения
curl http://localhost:8000/api/v1/health/redis
```

### Frontend
- Откройте http://localhost:5173
- Проверьте, что страница загружается без ошибок
- Проверьте консоль браузера на наличие ошибок

## 🐛 Решение проблем

### Проблема: MongoDB не подключается
```bash
# Проверьте статус MongoDB
brew services list | grep mongodb

# Или для Docker
docker ps | grep mongo

# Проверьте логи
docker logs mongodb
```

### Проблема: Redis не подключается
```bash
# Проверьте статус Redis
brew services list | grep redis

# Или для Docker
docker ps | grep redis

# Проверьте подключение
redis-cli ping
```

### Проблема: Порты заняты
```bash
# Найти процессы, использующие порты
lsof -i :8000
lsof -i :5173
lsof -i :27017
lsof -i :6379

# Остановить процесс
kill -9 <PID>
```

### Проблема: Зависимости не устанавливаются
```bash
# Очистить кэш npm
npm cache clean --force

# Удалить node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Переустановить зависимости
npm install
```

## 📝 Полезные команды

### Docker команды
```bash
# Остановить все сервисы
docker-compose down

# Перезапустить сервис
docker-compose restart app

# Просмотр логов конкретного сервиса
docker-compose logs -f app

# Очистить все контейнеры и образы
docker-compose down -v --rmi all
```

### Backend команды
```bash
# Запуск в режиме разработки
npm run dev

# Запуск с мок-данными
npm run dev:mock

# Запуск тестов
npm test

# Проверка линтера
npm run lint
npm run lint:fix
```

### Frontend команды
```bash
# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Проверка линтера
npm run lint

# Предварительный просмотр сборки
npm run preview
```

## 🔒 Безопасность

### Переменные окружения
- **НЕ коммитьте** файл `.env` в Git
- Используйте разные значения для разработки и продакшена
- Регулярно меняйте JWT секреты

### Доступ к базам данных
- MongoDB: admin/password123 (только для разработки!)
- Redis: password123 (только для разработки!)
- В продакшене используйте сложные пароли

## 📚 Дополнительные ресурсы

- [Документация MongoDB](https://docs.mongodb.com/)
- [Документация Redis](https://redis.io/documentation)
- [Документация Docker](https://docs.docker.com/)
- [Документация Vite](https://vitejs.dev/)
- [Документация React](https://react.dev/)

## 🆘 Получение помощи

Если у вас возникли проблемы:

1. Проверьте логи сервисов
2. Убедитесь, что все зависимости установлены
3. Проверьте версии Node.js и npm
4. Очистите кэш и переустановите зависимости
5. Проверьте, что порты не заняты другими процессами

---

**Удачной разработки! 🎉**
