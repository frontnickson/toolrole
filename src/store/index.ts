import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import boardReducer from "./slices/boardSlice";

// Конфигурация для redux-persist
const persistConfig = {
  key: "root",
  storage,
  // Указываем, какие части состояния сохранять
  whitelist: ["user", "boards"],
  // Настройки для миграций версий
  version: 1,
  // Обработка ошибок при восстановлении
  debug: process.env.NODE_ENV === "development",
};

// Объединяем все reducers
const rootReducer = combineReducers({
  user: userReducer,
  boards: boardReducer,
});

// Создаем persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Создаем store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем проверку сериализации для redux-persist действий
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Игнорируем определенные пути для Date объектов
        ignoredPaths: [
          "user.currentUser.createdAt", 
          "user.currentUser.lastActive",
          "user.currentUser.updatedAt",
          "boards.currentBoard.createdAt",
          "boards.currentBoard.updatedAt",
          "boards.boards[].createdAt",
          "boards.boards[].updatedAt"
        ],
      },
    }),
});

// Создаем persistor
export const persistor = persistStore(store);

// Логируем начальное состояние
console.log("🚀 Redux store инициализирован с redux-persist");
console.log("📊 Начальное состояние:", store.getState());

// Добавляем логирование для отладки
store.subscribe(() => {
  const state = store.getState();
  const prevState = store.getState();
  
  console.log("🔄 Redux store обновлен:", {
    boardsCount: state.boards?.boards?.length || 0,
    currentUser: state.user?.currentUser?.id || "не авторизован",
    currentBoard: state.boards?.currentBoard?.id || "не выбрана",
    action: "store updated"
  });
  
  // Логируем изменения в количестве досок
  if (state.boards?.boards?.length !== prevState.boards?.boards?.length) {
    console.log("📊 Изменение количества досок:", {
      было: prevState.boards?.boards?.length || 0,
      стало: state.boards?.boards?.length || 0
    });
  }
});

// Добавляем обработчики для redux-persist
persistor.subscribe(() => {
  const { bootstrapped } = persistor.getState();
  if (bootstrapped) {
    console.log("✅ Redux-persist восстановление завершено");
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;